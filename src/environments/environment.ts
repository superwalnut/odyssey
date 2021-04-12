// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  mail_url: "http://localhost:5001/hbclub-919aa/us-central1",
  firebase: {
    mailgunapi:"520a91c49b5a694b32f640f22dd313af-29561299-804372a6",
    apiKey: "AIzaSyARtsKbJSMmNK4gX-KVODBGc6JNociGU8M",
    authDomain: "hbc-uat-9f2ad.firebaseapp.com",
    projectId: "hbc-uat-9f2ad",
    storageBucket: "hbc-uat-9f2ad.appspot.com",
    messagingSenderId: "733704090264",
    appId: "1:733704090264:web:9f62c53e02f071b92716ed",
    measurementId: "G-DC4S7YNP37"
  }
  // firebase: {
  //   mailgunapi:"520a91c49b5a694b32f640f22dd313af-29561299-804372a6",
  //   apiKey: "AIzaSyCV2fY_LZCFmFuAE7YaBe2vdrrCue3ca0U",
  //   authDomain: "hbc-dev-c5967.firebaseapp.com",
  //   projectId: "hbc-dev-c5967",
  //   storageBucket: "hbc-dev-c5967.appspot.com",
  //   messagingSenderId: "859665213873",
  //   appId: "1:859665213873:web:dce5b954eddb327d843590",
  //   measurementId: "G-F7GD08WM72"
  // }
};
