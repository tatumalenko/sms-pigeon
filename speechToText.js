const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const app = express();

// Returns TwiML which prompts the caller to record a message
app.post('/record', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();
  const twiml2 = new VoiceResponse();

  twiml.say('Hello. Please state your current location after the beep and press the # key when done');

  // Use <Record> to record and transcribe the caller's message
  twiml.record({transcribe: true, maxLength: 30});
  twiml.finishOnKey('#');

  twiml2.say('Please state your destination after the beep and press the # key when done.')
  twiml2.record({transcribe: true, maxLength: 30});
  twim2.finishOnKey('#');

  // End the call with <Hangup>
  twiml.hangup();

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

// Create an HTTP server and listen for requests on port 3000
app.listen(3000);