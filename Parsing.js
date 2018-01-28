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

  function checkFrom(compare){
    let keywords = ["from ", "de ", "beginning at "]
    let indice = -1;
    let i;
    for(i = 0; i < keywords.length; i++)
      if(compare.indexOf(keywords[i]) != -1){
        indice = compare.indexOf(keywords[i])
        break
      }
    return {length:keywords[i].length, indice}
  }
  function checkTo(compare){
    let keywords = ["to ", "towards ", "toward ", "toward ", "via " ]
    let indice = -1;
    let i;
    for(i = 0; i < keywords.length; i++)
      if(compare.indexOf(keywords[i]) != -1){
        indice = compare.indexOf(keywords[i])
        break
      }
    return {length:keywords[i].length, indice}
  }
  function checkBy(compare){
    let keywords = ["by ", "using ", "by means of "]
    let indice = -1;
    let i;
    for(i = 0; i < keywords.length; i++)
      if(compare.indexOf(keywords[i]) != -1){
        indice = compare.indexOf(keywords[i])
        break
      }
    return {length:keywords[i].length, indice}
  }
  keyFrom = checkFrom(input);
  keyTo = checkTo(input);
  keyBy = checkBy(input);

  const from = keyFrom.indice; //input.indexOf("from ");
  const to = keyTo.indice; //input.indexOf("to ");
  const by = keyBy.indice; //input.indexOf("by ");
  
  const location = (from != -1) ? input.substring(from + keyFrom.length, Math.min((to < from) ? input.length : to, (by < from) ? input.length : by)) : "";
  const destination = (to != -1) ? input.substring(to + keyTo.length, Math.min((from < to) ? input.length : from, (by < to) ? input.length : by)) : "";
  const method = (by != -1) ? input.substring(by + keyBy.length, Math.min((from < by) ? input.length : from, (to < by) ? input.length : to)) : "";
  
  console.log("location : " + location);
  console.log("destination : " + destination);
  console.log("method : " + method);

  twiml.message(location);
  twiml.message(destination);
  twiml.message(method);

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
  
 console.log(req.body.Body);

});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});