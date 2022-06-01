import { writeFile } from 'fs';
// Configure Angular `environment.ts` file path
var targetPath = './src/environments/environment.uat.ts';

// Load node modules
require('dotenv').load();
// `environment.ts` file structure
const envConfigFile = `export const environment = {
  production: '${process.env.PRODUCTION}',
  mail_url: '${process.env.MAIL_URL}',
  domain: "https://hbc666.club",
  firebase: {
    apiKey: '${process.env.API_KEY}',
    authDomain: "hbclub-919aa.firebaseapp.com",
    projectId: "hbclub-919aa",
    storageBucket: "hbclub-919aa.appspot.com",
    messagingSenderId: "662012824452",
    appId: "1:662012824452:web:53cfe97159e39745a5abd1",
    measurementId: "G-E3M8ZFWFZB",
  }
};
`;

console.log('The file `environment.ts` will be written with the following content: \n');
console.log(envConfigFile);

if(`${process.env.PRODUCTION}` == "true"){
  targetPath = './src/environments/environment.prod.ts';
}

writeFile(targetPath, envConfigFile, function (err) {
   if (err) {
       throw console.error(err);
   } else {
       console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
   }
});
