const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const fs = require('fs');
const util = require('util');

const app = express();

app.use(bodyParser());

app.post('/sms', (req, res) => {

  const twiml = new MessagingResponse();

  const input = req.body.Body.toLowerCase();

  function from(compFrom){
    
  }
  
  const from = input.indexOf(" from ");
  const to = input.indexOf(" to ");
  const by = input.indexOf(" by ");

  const location = input.substring(from + 6, to);
  const destination = input.substring(to + 4, by);
  const method = input.substring(by + 4, input.length);

  console.log("location : " + location);
  console.log("destination : " + destination);
  console.log("method : " + method);

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
  
  console.log(req.body.Body);

});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});