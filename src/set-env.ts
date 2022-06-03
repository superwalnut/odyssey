import { writeFile } from 'fs';

// Configure Angular `environment.ts` file path
var targetPath = './src/environments/environment.ts';

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
    measurementId: '${process.env.MEASUREMENT_ID}',
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
