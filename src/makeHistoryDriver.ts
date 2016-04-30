import {StreamAdapter} from '@cycle/base';
import {History, Location, HistoryDriverOptions, Pathname} from './interfaces';

import {captureClicks} from './captureClicks';
import {ServerHistory} from './serverHistory';

function makeUpdateHistory(history: History) {
  return function updateHistory(location: Location | Pathname) {
    if ('string' === typeof location) {
      history.push(history.createLocation(location));
    } else if ('object' === typeof location) {
      // suport things like history.replace()
      const {type = 'push'} = (<Location> location);
      if (type === 'go') {
        history[type](location);
      } else {
        history[type](location);
      }
    } else {
      throw new Error('History Driver input must be a string or an ' +
        'object but received ${typeof url}');
    }
  };
}

function defaultOnErrorFn(err: Error) {
  if (console && console.error !== void 0) {
    console.error(err);
  }
}

export function makeHistoryDriver(history: History, options?: HistoryDriverOptions) {
  if (!history || typeof history !== 'object'
    || typeof history.createLocation !== 'function'
    || typeof history.createHref !== 'function'
    || typeof history.listen !== 'function'
    || typeof history.push !== 'function') {
    throw new TypeError('makeHistoryDriver requires an valid history object ' +
      'containing createLocation(), createHref(), push(), and listen() methods');
  }
  const capture: boolean = options && options.capture || false;
  const onError: (err: Error) => void = options && options.onError || defaultOnErrorFn;

  return function historyDriver(sink$: any, runSA: StreamAdapter) {
    let {observer, stream} = runSA.makeHoldSubject();
    let unlisten = history.listen((location: Location) => {
      observer.next(location);
    });

    runSA.streamSubscribe(sink$, {
      next: makeUpdateHistory(history),
      error: onError,
      complete: () => {
        unlisten();
        observer.complete();
      }
    });

    if (capture) {
      captureClicks((pathname: Pathname) => {
        const location = history.createLocation(pathname);
        history.push(location);
      });
    }
    const history$ = history instanceof ServerHistory
      ? stream.take(1)
      : stream;

    history$.createHref = history.createHref;
    history$.createLocation = history.createLocation;

    return history$;
  };
}
