# ChaoticBot Series



It features the following technologies:

* [React](https://github.com/facebook/react)
* [Redux](https://github.com/reactjs/redux)
* [Socket IO](http://socket.io)
* [Webpack](https://github.com/webpack/webpack)
* [Hot-reloading](https://webpack.github.io/docs/hot-module-replacement.html)
* [Material UI design](https://www.google.com/design/spec/material-design/introduction.html)
* [Modular CSS](https://github.com/css-modules/css-modules)
* [redux-saga](https://github.com/yelouafi/redux-saga)
* [reselect](https://github.com/reactjs/reselect)
* [Multilingual](https://stackoverflow.com/questions/33413880/react-redux-and-multilingual-internationalization-apps-architecture) / Internationalization
* [MongoDB](https://www.mongodb.org/) (optional), defaults to [NeDB](https://github.com/louischatriot/nedb) (in-process)


## Development

Clone this repository
npm i to install the dependencies (Node 4+, NPM 3+)
Open another terminal (you need two of those)
npm run start-server on the first terminal to start the server bit
npm run start-ui on the second terminal, to run live webpack with hot-reload
Open your browser on http://localhost:8081

also test the program by executing (after running npm build)
1. npm run startx to open an app on port 3000,
2. and npm run starty for app on post 8080
The apps on different servers will communicate through redis, and share all text messages among users

## Production

* Clone this repository
* `npm i` to install the dependencies (Node 6+, NPM 4+)
* `npm run build` to build everything (client and server)
* `npm start` to run the server on port 8080
* Open your browser on [http://localhost:8080](http://localhost:8080)

## How to enable SocketIO anti-spam
