

////////////////////////////////////////////////////
////////  ChaoticBots Bot Training Platform ////////
///////            version 0.5.0            ///////
//////////////////////////////////////////////////

import express        from 'express';
import path           from 'path';
import socketIo       from 'socket.io';
import http           from 'http';
import find           from 'lodash/find';
import chalk          from 'chalk';
import db             from './db';
import moment         from 'moment';
import spamFilter     from './spamFilter';
import config         from '../config';
import PubNub         from 'pubnub';
import redis          from 'socket.io-redis';

import { RECEIVE_POST, RECEIVE_BOARD, RECEIVE_DELETE_POST, RECEIVE_LIKE, RECEIVE_EDIT_POST,
    ADD_POST_SUCCESS, DELETE_POST, LIKE_SUCCESS, EDIT_POST,
    RECEIVE_CLIENT_LIST, RECEIVE_SESSION_NAME, JOIN_SESSION,
    RENAME_SESSION, LEAVE_SESSION,
    LOGIN_SUCCESS } from './actions';

              //////////////////////////////////////////////////////
              ////////        Configure Chat Platform       ///////
              ////////////////////////////////////////////////////

const app = express();
const httpServer = new http.Server(app);
const io = socketIo(httpServer);
const port = process.env.PORT || 4000;
const htmlFile = process.env.NODE_ENV === 'production' ?
    path.resolve(__dirname, '..', 'content', 'index.html') :
    path.resolve(__dirname, '..', 'content', 'index.html');
const assetsFolder = path.resolve(__dirname, '..', 'assets');
const staticFolder = path.resolve(__dirname, '..', 'static');

const g = chalk.green.bind(chalk);
const b = chalk.blue.bind(chalk);
const gr = chalk.grey.bind(chalk);
const r = chalk.red.bind(chalk);
const y = chalk.yellow.bind(chalk);
const s = str => b(str.replace('retrospected/', ''));

const antiSpam = config.Use_Anti_Spam ? spamFilter : (ip, cb) => cb();

const testStore = {
  session: '',
  socket: '',
  user: ''
}
    ////////////////////////////////////////////////////////////////
    ////////        MAINLINE GLOBAL NETWORK INTEGRATION      ///////
    ////////////////////////////////////////////////////////////////


    const pubnub = new PubNub({
      subscribeKey: config.SUB_KEY,
      publishKey: config.PUB_KEY,
      secretKey: config.PUB_SECRET,
      ssl: true
    })

    const pub_channel = port != 8080 ? 'FROM_CHAOTIC' : 'TO_CHAOTIC';

    const sub_channel = port == 8080 ? 'FROM_CHAOTIC' : 'TO_CHAOTIC';

      /////////////////////////////////////////////////////////////////
      ////////        Cross Server Messaging Integration        ///////
      /////////////////////////////////////////////////////////////////

      io.adapter(redis({host: 'localhost', port: 6379}));

      ///////////////////////////////////////////////
      ////////        MAINLINE FUNCTIONS      ///////
      ///////////////////////////////////////////////

db().then(store => {

    const users = {};
    const d = () => y(`[${moment().format('HH:mm:ss')}]`);

    const getRoom = sessionId => `board-${sessionId}`;

    const sendToAll = (socket, sessionId, action, data) => {
        console.log(`${d()}${g(' ==> ')} ${s(action)} ${gr(JSON.stringify(data))}`);
        socket
            .broadcast
            .to(getRoom(sessionId))
            .emit(action, data);

    };

    const sendToSelf = (socket, action, data) => {
        console.log(`${d()}${g(' --> ')} ${s(action)} ${gr(JSON.stringify(data))}`);
        socket.emit(action, data);
    };

    const persist = session => store.set(session)
        .catch(err => console.error(err));

    const sendClientList = (sessionId, socket) => {
        const room = io.nsps['/'].adapter.rooms[getRoom(sessionId)];
        if (room) {
            const clients = Object.keys(room.sockets);
            const names = clients.map((id, i) => users[id] || `(Anonymous #${i})`);

            sendToSelf(socket, RECEIVE_CLIENT_LIST, names);
            sendToAll(socket, sessionId, RECEIVE_CLIENT_LIST, names);

        }
    };

    const recordUser = (sessionId, name, socket) => {
        const socketId = socket.id;
        if (!users[socketId] || users[socketId] !== name) {
            users[socketId] = name || null;
        }

        sendClientList(sessionId, socket);
    };

    const receivePost = (session, data, socket) => {
        session.posts.push(data);
        persist(session);
        sendToAll(socket, session.id, RECEIVE_POST, data);
    };

    const joinSession = (session, data, socket) => {

        socket.join(getRoom(session.id), () => {
            socket.sessionId = session.id;

            if (session.posts.length) {
                sendToSelf(socket, RECEIVE_BOARD, session.posts);
            }
            if (session.name) {
                sendToSelf(socket, RECEIVE_SESSION_NAME, session.name);
            }

            recordUser(session.id, data.user, socket);
        });
    };

    const renameSession = (session, data, socket) => {
      session.name = data;
      persist(session);
      sendToAll(socket, session.id, RECEIVE_SESSION_NAME, data);
    };

    const leave = (session, data, socket) => {
        socket.leave(getRoom(session.id), () => {
            sendClientList(session.id, socket);
        });
    };

    const login = (session, data, socket) => {

        recordUser(session.id, data.name, socket);
    };

    const deletePost = (session, data, socket) => {
        session.posts = session.posts.filter(p => p.id !== data.id);
        persist(session);
        sendToAll(socket, session.id, RECEIVE_DELETE_POST, data);
    };

    const like = (session, data, socket) => {
        const post = find(session.posts, p => p.id === data.post.id);
        if (post) {
            const array = data.like ? post.likes : post.dislikes;

            if (array.indexOf(data.user) === -1) {
                array.push(data.user);
                persist(session);
                sendToAll(socket, session.id, RECEIVE_LIKE, data);
            }
        }
    };

    const edit = (session, data, socket) => {
        const post = find(session.posts, p => p.id === data.post.id);
        if (post) {
            post.content = data.content;
            persist(session);
            sendToAll(socket, session.id, RECEIVE_EDIT_POST, data);
        }
    };


    // drives process via handles for socket and global network routines
    const actions = [
        { type: ADD_POST_SUCCESS, handler: receivePost },
        { type: JOIN_SESSION, handler: joinSession },
        { type: RENAME_SESSION, handler: renameSession },
        { type: DELETE_POST, handler: deletePost },
        { type: LIKE_SUCCESS, handler: like },
        { type: EDIT_POST, handler: edit },
        { type: LOGIN_SUCCESS, handler: login },
        { type: LEAVE_SESSION, handler: leave }];



  /////////////////////////////////////////////////////////////////////////
  ////////        MAINLINE GLOBAL NETWORK MESSAGE ACTIONS           ///////
  ////////////////////////////////////////////////////////////////////////

  pubnub.addListener({
    message: function(message){
        console.log({message: message})
        console.log({payload: JSON.stringify(message.message.payload) })

        const action = {};
        action.type = message.message.action;
        const data = {};
        data.payload = message.message.payload;

        function search(nameKey, myArray) {
            for (let i=0; i < myArray.length; i++) {
              if (myArray[i].type === nameKey) {
            return myArray[i];
          }
        }
      }

      const resultObject = search(action.type, actions);

      console.log("--------------PUBNUB SUBSCRIBE RESULTS -------------");

      console.log(d() + r(' <--  ') +
                  s(action.type),
                  gr(JSON.stringify(data)));

      console.log({actionobject: resultObject});

        }
      })

  pubnub.subscribe({
      channels: [sub_channel]
      });

    ////////////////////////////////////////////////////
    ////////        MAINLINE EXPRESS CONFIG      ///////
    ///////////////////////////////////////////////////

    app.use('/assets', express.static(assetsFolder));
    app.use('/static', express.static(staticFolder));
    app.use('/favicon.ico', express.static(path.resolve(staticFolder, 'favicon.ico')));
    app.get('/*', (req, res) => res.sendFile(htmlFile));


    /////////////////////////////////////////////////////
    ////////        MAINLINE SOCKET ACTIONS      ///////
    ////////////////////////////////////////////////////


    io.on('connection', socket => {
        const ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
        antiSpam(ip, () => {
            console.log(d() + b(' Connection: ') +
                        r('New user connected'), gr(socket.id), gr(ip));

          io.on('time', function (data) {
                      console.log(data);
                  });
          socket.on('time', function (data) {
                      console.log(data);
                  });

            actions.forEach(action => {
                socket.on(action.type, data => {
                    antiSpam(ip, () => {
                        console.log(d() + r(' <--  ') +
                                    s(action.type),
                                    gr(JSON.stringify(data)));
                        const sid = action.type === LEAVE_SESSION ?
                                    socket.sessionId : data.sessionId;

                        //////////////////////////////////
                            pubnub.publish({
                                     message: {
                                         socket: socket.id,
                                         action: action.type,
                                         session: data.sessionId,
                                         payload: data.payload
                                       },
                                     channel: pub_channel},

                                     function (status, response) {
                                         if (status.error) {
                                             console.log(status)
                                           } else {
                                             console.log("message Published w/ timetoken", response.timetoken)
                                             }
                                         });
                        //////////////////////////////////////

                        if (sid) {
                            store.get(sid).then(session => {
                                action.handler(session, data.payload, socket);

                            });
                        }
                    });
                });
            });

            socket.on('disconnect', () => {
                if (socket.sessionId) {
                    sendClientList(socket.sessionId, socket);
                }
            });
        });
    });

     ///////////////////////////////////////////////////
     ////////        MAINLINE Server SetUp      ///////
   ///////////////////////////////////////////////////

    httpServer.listen(port);
    const env = process.env.NODE_ENV || 'dev';
    console.log(`Server started on port ${r(port)}, environment: ${b(env)}`);
});
