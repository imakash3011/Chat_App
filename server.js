//for server side socket connection
//socket donot work with the express but we are using it here for the middlewares
const express =require('express')

// syntax for including the Path module in your application
const path = require('path')

const socketio = require('socket.io')

//it is used to run both the express and socket.io module on http server together
const http =require('http')

// The first line here is grabbing the main Express module from the package you installed. 
//This module is a function, which we then run on the second line to create our app variable. 
//You can create multiple apps this way, each with their own requests and responses.

const app =express(); 

//here we are creating http server by yourself
// The http.createServer() method creates an HTTP Server object.
// The HTTP Server object makes your computer behave as an HTTP server.
const server = http.createServer(app)

const io=socketio(server)

let userskts={}
app.use('/',express.static(path.join(__dirname,'frontend')))

// the server and client's Socket object act as EventEmitters,
// you can emit and listen for events in a bi-directional manner.
// make a connection with the user from server side
io.on('connection',(socket)=>{
    console.log("New socket formed from " + socket.id)
    //when server get connected we use the following command
    socket.emit('connected')

    // make connection with server from user side 
    socket.on('login',(data)=>{
        //we are doing this to privately send the data to the user
        //username is in data.user
        userskts[data.user] = socket.id
        console.log(userskts)
    })

    socket.on('send_msg',(data)=>{
        // console.log("Received message = " + data.message)
        //send the typed message to the client instead of sending it to console
        //if we use io.emit , then everyone will gets the msg
        //if we use socket.broadcast.emit, only others get the msg

        if(data.message.startsWith('@')){
            //data.message = "@a : hello"
            //split at :, then remove @ from beginning
            let recipient = data.message.split(':')[0].substr(1)
            let rcptSocket = userskts[recipient]
            io.to(rcptSocket).emit('recv_msg',data)
        }else{
            // socket.broadcast.emit('recv_msg',data)
            io.emit('recv_msg', data)
        }
    })
})


server.listen(4132, ()=> console.log('Website open on http://localhost:4132'))