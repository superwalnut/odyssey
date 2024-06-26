import { writeFile } from 'fs';

// Configure Angular `environment.ts` file path
var targetPath = './src/environments/environment.prod.ts';

// Load node modules
require('dotenv').load();
// `environment.ts` file structure
const envConfigFile = `export const environment = {
  production: '${process.env.PRODUCTION}',
  mail_url: '${process.env.MAIL_URL}',
  domain: "https://hbc666.club",
  firebase: {
    apiKey: '${process.env.API_KEY}',
    authDomain: '${process.env.AUTH_DOMAIN}',
    projectId: '${process.env.PROJECT_ID}',
    storageBucket: '${process.env.STORAGE_BUCKET}',
    messagingSenderId: '${process.env.MESSAGING_SENDER_ID}',
    appId: '${process.env.APP_ID}',
    measurementId: '${process.env.MEASUREMENT_ID}'
  },
  payments:{
    cashPay: "https://buy.stripe.com/4gw5kB9U40sLcDK146",
    memberTopup50: "https://buy.stripe.com/5kA4gx1nyb7pgU0dQT",
    memberTopup100: "https://buy.stripe.com/9AQaEV4zK0sLdHOeUY",
    memberTopup170: "https://buy.stripe.com/eVa4gx2rC3EX7jq145",
    memberTopup300: "https://buy.stripe.com/fZebIZc2c7Vd8nu6ot",
  }
};
`;

console.log('The file `environment.ts` will be written with the following content: \n');
console.log(envConfigFile);

writeFile(targetPath, envConfigFile, function (err) {
   if (err) {
       throw console.error(err);
   } else {
       console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
   }
});
