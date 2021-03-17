import * as functions from "firebase-functions";
const cors = require('cors')({origin: true});

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const mailgun = require("mailgun-js");

export const sendemail = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    // your function body here - use the provided req and res from cors
      if(request.method !== "POST"){
        response.status(400).send('Please send a POST request');
        return;
      }

      console.log('hitting');
      console.log('request', request?.body);

      if(request?.body.length <= 0){
        response.status(400).send('Please send a valid request');
        return;
      }

      const data = request?.body;
      console.log('data', data);

      const DOMAIN = 'hbc666.club';
      const mg = mailgun({apiKey: '520a91c49b5a694b32f640f22dd313af-29561299-804372a6', domain: DOMAIN});
      const email = {
        from: 'HBC Support <support@hbc666.club>',
        to: 'kevin.wangwei@gmail.com',
        subject: 'Hello',
        text: 'Testing some kevin!'
      };

      mg.messages().send(email);

      response.status(200).send("success");
      return;
    })
});