//  SMSPigeon
/** This project consists of using Twilio's API to take a start and end address from a text message and use Google Maps Direction's
  * API to obtain directions and send them back to the user. The user will have to text the number 438-500-MAPS (438-500-6277) to
  * get instructions towards its destination.

  * @author Steven Iacobellis, Emanuel Sharma, Tatum Alenko, Narra Pangan
  * @version January 28th 2018 */

// Twilio Credentials
const accountSid = 'ACf6a7c177cb6b65a1582f72995d53396c';
const authToken = '1c0e6e9c117ec4fa02d0a7e21237a23a';

// // Require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

const http = require('http');
const bodyParser = require('body-parser');

const app = require('express')();

const { MessagingResponse } = require('twilio').twiml;

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyD1ii-FjGln2tvyMg_3VqZSLuPsR4ill-s',
    Promise, // 'Promise' is the native constructor.
});

// app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/sms', async (req, res) => {
    try {
        const twiml = new MessagingResponse();
        const input = req.body.Body;
        const directions = await getGmapsRes(input);

        // console.log(directions);

        let shortDirections = [];


        if (Array.isArray(directions)) {
            // eslint-disable-next-line no-restricted-syntax
            for (const direction of directions) {
                if ([shortDirections, direction].join('\n').length < 1600) {
                    shortDirections.push(direction);
                } else {
                    console.log(shortDirections.join('\n'));
                    twiml.message(shortDirections.join('\n'));
                    shortDirections = [direction];
                }
            }
        }
        console.log(shortDirections.join('\n'));
        twiml.message(shortDirections.join('\n'));

        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    } catch (e) {
        console.log(e);
    }
});

http.createServer(app).listen(1337, () => {
    console.log('Express server listening on port 1337');
});

function checkFrom(compare) {
    const keywords = ['from ', 'de ', 'beginning at ']
    let indice = -1;
    let i;
    for(i = 0; i < keywords.length; i++)
        if (compare.indexOf(keywords[i]) != -1) {
            indice = compare.indexOf(keywords[i]);
            break;
        }
    return { length: keywords[i].length, indice };
}

function checkTo(compare) {
    const keywords = ['to ', 'towards ', 'toward ', 'toward ']
    let indice = -1;
    let i;
    for (i = 0; i < keywords.length; i++)
        if (compare.indexOf(keywords[i]) != -1) {
            indice = compare.indexOf(keywords[i])
            break
        }
    return { length: keywords[i].length, indice }
}

function checkBy(compare) {
    let keywords = ['using ', 'by means of ', 'by means ', 'via ', 'by '];
    let indice = -1;
    let i;
    for (i = 0; i < keywords.length; i++)
        if (compare.indexOf(keywords[i]) != -1) {
            indice = compare.indexOf(keywords[i])
            break
        }
    return { length: keywords[i].length, indice }
}
async function getGmapsRes(input) {
    try { /**
        console.log(input);
        const from = input.indexOf('from ');
        const to = input.indexOf('to ');
        const by = input.indexOf('by ');

        const origin = (from != -1) ? input.substring(from + 5, Math.min((to < from) ? input.length : to, (by < from) ? input.length : by)) : '';
        const destination = (to != -1) ? input.substring(to + 3, Math.min((from < to) ? input.length : from, (by < to) ? input.length : by)) : '';
        const mode = (by != -1) ? input.substring(by + 3, Math.min((from < by) ? input.length : from, (to < by) ? input.length : to)) : '';
        console.log(origin);
        console.log(destination);
        console.log(mode);
    */

        keyFrom = checkFrom(input);
        keyTo = checkTo(input);
        keyBy = checkBy(input);

        const from = keyFrom.indice; //input.indexOf("from ");
        const to = keyTo.indice; //input.indexOf("to ");
        const by = keyBy.indice; //input.indexOf("by ");

        const origin = (from != -1) ? input.substring(from + keyFrom.length, Math.min((to < from) ? input.length : to, (by < from) ? input.length : by)) : "";
        const destination = (to != -1) ? input.substring(to + keyTo.length, Math.min((from < to) ? input.length : from, (by < to) ? input.length : by)) : "";
        const mode = (by != -1) ? input.substring(by + keyBy.length, Math.min((from < by) ? input.length : from, (to < by) ? input.length : to)) : "";

        console.log("location : " + origin);
        console.log("destination : " + destination);
        console.log("method : " + mode);

        
        const query = {};
        if (origin) query.origin = origin.toLowerCase().trim();
        if (destination) query.destination = destination.toLowerCase().trim();
        if (mode) query.mode = mode.toLowerCase().trim();

        const response = await googleMapsClient.directions(query).asPromise();
        console.log(response);

        const replaceThis = [/<b>|<\/b>|<div>|<\/div>|<.*>/g, ''];
        const directions = [];

        // console.log(response);

        response.json.routes.forEach((route) => {
            if (!Array.isArray(route.legs)) return;
            route.legs.forEach((leg) => {
                if (!Array.isArray(leg.steps)) return;
                leg.steps.forEach((step) => {
                    // if (!Array.isArray(step.steps)) return;
                    // step.steps.forEach((step2) => {
                    //     // if (!Array.isArray(step2)) return;
                    //     directions.push(step2.html_instructions ? step2.html_instructions.replace(...replaceThis) : step2.html_instructions);
                    //     console.log(step2.html_instructions ? step2.html_instructions.replace(...replaceThis) : step2.html_instructions);
                    //     // console.log(step2.transit_details ? step2.transit_details.replace(...replaceThis) : step2.transit_details);
                    // });
                    directions.push(step.html_instructions ? `▶ ${step.html_instructions.replace(...replaceThis)} (${step.distance.text})` : step.html_instructions);
                    // console.log(step.html_instructions ? step.html_instructions.replace(...replaceThis) : step.html_instructions);
                });
            });
        });

        // console.log(directions);

        return directions;
    } catch (e) {
        console.log(e);
    }
    // console.log(response.json.routes[0].legs[0].steps[0].steps[0].html_instructions);
}

