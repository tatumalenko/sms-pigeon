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

  const from = req.body.Body.str.toLowerCase().indexOf("from");
  const to = req.body.Body.toLowerCase().str.indexOf("to");
  const by = req.body.Body.toLowerCase().str.indexOf("by");

  const location = req.body.Body.str.substring(from + 4, to);
  const destination = req.body.Body.str.substring(to + 2, by);
  const method = req.body.Body.str.substring(by + 2, req.body.Body.str.length);

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
  
 console.log(req.body.Body);

});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});