import {firebase} from './local.environment'

export const environment = {
  env: 'local',
  production: 'false',
  mail_url: 'http://localhost:5001/hbclub-919aa/us-central1',
  domain: "https://hbc666.club",
  payments:{
    cashPay: "https://buy.stripe.com/4gw5kB9U40sLcDK146",
    memberTopup50: "https://buy.stripe.com/5kA4gx1nyb7pgU0dQT",
    memberTopup100: "https://buy.stripe.com/9AQaEV4zK0sLdHOeUY",
    memberTopup170: "https://buy.stripe.com/eVa4gx2rC3EX7jq145",
    memberTopup300: "https://buy.stripe.com/fZebIZc2c7Vd8nu6ot",
  },
  ...firebase,
};
