// // Twilio Credentials
const accountSid = 'ACf6a7c177cb6b65a1582f72995d53396c';
const authToken = '1c0e6e9c117ec4fa02d0a7e21237a23a';

// // require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

const http = require('http');
const app = require('express')();
const { MessagingResponse } = require('twilio').twiml;

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyD1ii-FjGln2tvyMg_3VqZSLuPsR4ill-s',
    Promise, // 'Promise' is the native constructor.
});

// client.messages
//     .create({
//         to: '+16136191409',
//         from: '+14387956277',
//         body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//     })
//     .then(message => console.log(message.sid));

// client.messages
//     .create({
//         to: '+16136191409',
//         from: '+14387956277',
//         body: 'Yo check this shittt outtttttt.',
//         mediaUrl: 'https://images-na.ssl-images-amazon.com/images/I/51mEs5FrAWL._SL500_AC_SS350_.jpg',
//     })
//     .then(message => console.log(message.sid));


// app.post('/sms', (req, res) => {
//     const twiml = new MessagingResponse();

//     twiml.message('Its pretty bad outside right now. You\'re better off staying in tonight.');

//     res.writeHead(200, { 'Content-Type': 'text/xml' });
//     res.end(twiml.toString());

//     // client.messages
//     //     .create({.
//     //         to: '+16136191409',
//     //         from: '+14387956277',
//     //         body: 'Yo check this shittt outtttttt.',
//     //         mediaUrl: 'https://images-na.ssl-images-amazon.com/images/I/51mEs5FrAWL._SL500_AC_SS350_.jpg',
//     //     })
//     //     .then(message => console.log(message.sid));


// });

// http.createServer(app).listen(1337, () => {
//     console.log('Express server listening on port 1337');
// });

const getGmapsRes = async () => {
    const response = await googleMapsClient.directions({
        origin: 'Concordia, Montreal, Canada',
        destination: '1572 visitation street, montreal',
        mode: 'transit',
    }).asPromise();

    response.json.routes.forEach((route) => {
        route.legs.forEach((leg) => {
            leg.steps.forEach((step) => {
                step.steps.forEach((step2) => {
                    console.log(step2.html_instructions);
                    console.log(step2.transit_details);
                });
            });
        });
    });
    // console.log(response.json.routes[0].legs[0].steps[0].steps[0].html_instructions);
};
    // .asPromise()
    // .then((response) => {
    //     console.log(response);
    // });

getGmapsRes();
