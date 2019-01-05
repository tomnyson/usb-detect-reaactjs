var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var setting =  require('./usb.js')
var usbDetect = require('usb-detection');
usbDetect.startMonitoring();
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(function(req, res, next) {
  if (req.headers.origin) {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization')
      res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
      if (req.method === 'OPTIONS') return res.send(200)
  }
  next()
})
var Message = mongoose.model('Message',{
  name : String,
  message : String
})
// var dbUrl = 'mongodb://username:password@ds257981.mlab.com:57981/simple-chat'
// app.get('/messages', (req, res) => {
//   Message.find({},(err, messages)=> {
//     res.send(messages);
//   })
// })
// app.get('/messages', (req, res) => {
//   Message.find({},(err, messages)=> {
//     res.send(messages);
//   })
// })

app.get('/listusb',async (req, res) => {
 let drives =  await setting.getAll()
  let listUsb = drives.filter(item => item.isUSB === true)
  console.log('gia tri tra ve', drives)
  res.send({result: listUsb})
})
app.post('/writeusb',async (req, res) => {
  let isSuccess = await setting.writeFile(req.body.payload)
  console.log('ket qua la', isSuccess)
  if(isSuccess) {
    res.sendStatus(200) 
  }else {
    res.sendStatus(400)  
  } 
  });
  app.post('/add',async (req, res) => {
    console.log('call add func')
    let a = req.body.a
    let b = req.body.b
    let sum = a + b
      res.send({result: sum}) 
    })
// app.post('/messages', (req, res) => {
//   var message = new Message(req.body);
//   message.save((err) =>{
//     if(err)
//       sendStatus(500);
//     io.emit('message', req.body);
//     res.sendStatus(200);
//   })
// })
//setting.helloworld();
setting.getAll()
setting.checkUsb()
io.on('connection', (socket) =>{
  usbDetect.on('add', function (device) {
    socket.emit('addUsb', device)
  });
  usbDetect.on('remove', function (device) {
    socket.emit('removeUsb', device)
  });
  
})



// mongoose.connect(dbUrl ,{useMongoClient : true} ,(err) => {
//   console.log('mongodb connected',err);
// })
var server = http.listen(3008, () => {
  console.log('server is running on port', server.address().port);
});