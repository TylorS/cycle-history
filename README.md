# @cycle/history

This is the standard Cycle driver for dealing with the History API.

This project is 100% compatible with rackt/history, most notably used to create React-Router. This allows for a Cycle application to be embedded inside of an existing React application and share history instances.

Though this library makes use of the interface that the rackt/history library provides, any other library can be used which satisfies the interface. For more information on this interface please see the [documentation](https://cyclejs.github.io/history/docs). Also take note of the ServerHistory object we have made to easily allow for server-side rendering of your Cycle application.

## Install
```shell
$ npm install --save @cycle/history
```

## Documentation

Documentation can be found [here](https://cyclejs.github.io/history/docs)
