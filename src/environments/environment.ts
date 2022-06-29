import {firebase} from './local.environment'

export const environment = {
  env: 'local',
  production: 'false',
  mail_url: 'http://localhost:5001/hbclub-919aa/us-central1',
  domain: "https://hbc666.club",
  ...firebase,
};
