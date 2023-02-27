let exprss = require('express')
let app = exprss()
let path = require ('path')
const { Socket } = require('socket.io')
let port = 3010
let serverListen = app.listen(port, ()=>{console.log(`your port is start ${port}`);})
let io = require('socket.io')(serverListen)


app.use(exprss.static(path.join(__dirname,'public')))

// app.get('/',()=>{
//     console.log("hello");
// })

let socketsConected = new Set()

io.on('connection',onConnected)

function onConnected(socket){
    console.log("socket-id--------",socket.id);
    socketsConected.add(socket.id)

io.emit('clients-total', socketsConected.size)

socket.on('disconnect', () => {
    console.log('Socket disconnected successfully ()()()()()()()()()()()', socket.id);
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)

})

socket.on('message', (data) => {
    console.log("message data $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",data)
    socket.broadcast.emit('chat-message', data)
})

socket.on('feedback', (data) => {
    console.log("feedback data +++++++++++++++++++++++++++++++++",data);
    socket.broadcast.emit('feedback', data)

})


}   

