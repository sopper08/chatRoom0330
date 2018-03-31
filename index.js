const express = require('express');
const app = express(); //app還不是server, 在未listen前都不是server
server = app.listen(3000, function () {
    console.log('Server is listening on port 3000.')
});
const io = require('socket.io').listen(server);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/test', function (req, res) {
    var username = req.query.username;
    if (username != '' && username != undefined) {
        res.sendFile(__dirname + '/chatroom.html');
        // res.send('Welcome, '+ username + '!');
    } else {
        res.redirect('/');
    }
});

// io.on打開listen
io.on('connection', function(socket){
    socket.on('msg', function(msg){
        // console.log(msg);
        io.emit('msg', msg);
    });
    socket.on('online', function(usr){
        msg = usr + "　上線了！"
        socket.broadcast.emit('usrOnline', msg);
    });
    socket.on('leaveRoom', function(usr){
        // server聽到該client要離開的訊息, 回送leave給他離開
        socket.emit('leave');
        // server告訴其他人誰離開了
        msg = usr + "　離開了。"
        socket.broadcast.emit('usrLeft', msg);
    });
});

