# SMS Pigeon
> A Maps Service for the Dataless Travellers

## Inspiration
12 hours of procrastination and first ever hackathon for everyone. Oh, and first time NodeJS noobs for 3/4 of us.

## What it does
SMS Pigeon's goal is simple. Not everyone has the luxury to have mobile plans with data to use Google Maps, especially if someone is travelling in a different country where data roaming plans are unaffordable. When SMS (texting) is all you have on hand, SMS Pigeon comes to the rescue by replying to your text query in simple format with step by step navigation directions to your destination.

## How we built it
SMS Pigeon was built in NodeJS using mainly two APIs: Twilio and Google Maps Directions API. Using an Express server in NodeJS, the Twilio API allows the server to listen for SMS messages sent to the Twilio associated number conveniently chosen as +1-514-795-MAPS(6277). Afterwards, using the Google Maps Directions API, the user query is parsed for specific keywords and sent to request the navigation directions which is then pushed back to the user in a bullet point step-by-step list.

## Challenges we ran into
Many... Since 3/4 of our team were introduced to NodeJS for the very first time during this project, a lot of new skills were learned and hair was pulled. Specifically, although the Twilio API was well documented, the integration of a backend server using Express and trying to incorporate the Google Maps Directions API together presented more of an obstacle than we all first assumed. It's the little things that get you!

Accomplishments that we're proud of
Completely new environment was learned for most of us, were able to finalize our minimal viable project and for that we are very pleased. Although we would of loved to have incorporated the speech to text transcription features within the Twilio API to allow users to ask their query vocally, we ran out of time.

## What we learned
NodeJS, what is an API, what can we do with all these things, and how we can make use of it to build something that actually works.

## What's next for SMS Pigeon
Ideally, the next step would be to deploy the server in the cloud via Heroku or something similar. After that, the next step would be to integrate speech to text transcription and making the parsing more flexible and less verbose.

## Built With
`node.js`, `javascript `, `twilio`, `google-directions`