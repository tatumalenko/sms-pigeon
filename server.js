/** SMS Pigeon - A SMS Maps Service for the Dataless Travellers
  * This project consists of using Twilio's API to take a start and end address from a text message and use Google Maps Direction's
  * API to obtain directions and send them back to the user. The user will have to text the number 438-795-MAPS (438-795-6277) to
  * get instructions towards its destination.

  * @author Steven Iacobellis, Emanuel Sharma, Tatum Alenko, Narra Pangan
  * @version 1.0
  */

const secrets = require('./secrets.json');
const http = require('http');
const bodyParser = require('body-parser');

const app = require('express')();

const { MessagingResponse } = require('twilio').twiml;

const googleMapsClient = require('@google/maps').createClient({
    key: secrets.googleApiKey,
    Promise, // 'Promise' is the native constructor.
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/sms', async (req, res) => {
    try {
        const twiml = new MessagingResponse();
        const input = req.body.Body.toLowerCase();

        // Send help info if requested on format to submit query text
        if (['help me', 'help?', 'help', '?'].includes(input)) {
            const helpMsg = () => ([
                'To use SMS Pigeon, make sure to enter your map query in the following format:',
                '"from <address> to <address> by <method=driving|walking|transit>"',
                'E.g.: "from 1234 mcgill street montreal to 4321 guy avenue montreal by transit"',
            ].join('\n'));
            twiml.message(helpMsg());
            res.writeHead(200, { 'Content-Type': 'text/xml' });
            res.end(twiml.toString());
            return;
        }

        const directions = await getGmapsDirections(input);
        let shortDirections = [];
        console.log(directions);

        if (Array.isArray(directions)) {
            // eslint-disable-next-line no-restricted-syntax
            for (const direction of directions) {
                // Must loop over array of strings to ensure not over message POST limit of 1600 characters
                if ([shortDirections, direction].join('\n').length < 1600) {
                    shortDirections.push(direction);
                } else {
                    console.log(shortDirections.join('\n'));
                    twiml.message(shortDirections.join('\n'));
                    shortDirections = [direction];
                }
            }
        }
        if (shortDirections.length !== 0) {
            console.log(shortDirections.join('\n'));
            twiml.message(shortDirections.join('\n'));
        } else { // directions is simply a string (not array), likely an error message
            console.log(directions);
            twiml.message(directions);
        }

        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    } catch (e) {
        console.log(e);
    }
});

http.createServer(app).listen(1337, () => {
    console.log('Express server listening on port 1337');
});

async function getGmapsDirections(input) {
    console.log(input);

    const keyFrom = getValidAlias(input, ['from ', 'de ', 'beginning at ']);
    const keyTo = getValidAlias(input, ['to ', 'towards ', 'toward ', 'toward ']);
    const keyBy = getValidAlias(input, ['using ', 'by means of ', 'by means ', 'via ', 'by ']);

    const from = keyFrom.index;
    const to = keyTo.index;
    const by = keyBy.index ? keyBy.index : -1;

    const origin = (from != -1) ? input.substring(from + keyFrom.length, Math.min((to < from) ? input.length : to, (by < from) ? input.length : by)) : '';
    const destination = (to != -1) ? input.substring(to + keyTo.length, Math.min((from < to) ? input.length : from, (by < to) ? input.length : by)) : '';
    const mode = (by != -1) ? input.substring(by + keyBy.length, Math.min((from < by) ? input.length : from, (to < by) ? input.length : to)) : '';

    console.log(`origin: ${origin}`);
    console.log(`destination: ${destination}`);
    console.log(`mode: ${mode}`);

    const errorMsg = () => (['Unfortunately, Google Maps was unable to find any results for your query.',
        `Origin: ${origin}`,
        `Destination: ${destination}`,
        `Mode: ${mode}`].join('\n'));

    try {
        const query = {};
        if (origin) query.origin = origin.toLowerCase().trim();
        if (destination) query.destination = destination.toLowerCase().trim();
        if (mode) query.mode = mode.toLowerCase().trim();
        console.log(`mode: ${mode}`);

        const response = await googleMapsClient.directions(query).asPromise();
        console.log(response);

        if (['NOT_FOUND', 'ZERO_RESULTS'].includes(response.json.status)) {
            return errorMsg();
        }

        const replaceThis = [/<b>|<\/b>|<div>|<\/div>|<.*>/g, ''];
        const directions = [];

        response.json.routes.forEach((route) => {
            if (!Array.isArray(route.legs)) return;
            route.legs.forEach((leg) => {
                if (!Array.isArray(leg.steps)) return;
                leg.steps.forEach((step) => {
                    directions.push(step.html_instructions ? `▶ ${step.html_instructions.replace(...replaceThis)} (${step.distance.text})` : step.html_instructions);
                });
            });
        });

        return directions;
    } catch (e) {
        console.log(e);
        return errorMsg();
    }
}

function getValidAlias(inputToValidate, aliases) {
    let index = -1;
    let i;
    for (i = 0; i < aliases.length; i++) {
        if (inputToValidate.indexOf(aliases[i]) != -1) {
            index = inputToValidate.indexOf(aliases[i]);
            break;
        }
    }
    return aliases[i] ? { length: aliases[i].length, index } : -1;
}
