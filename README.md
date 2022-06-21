<p align="center">
  <a href="https://hbc666.club">
    <img src="https://ik.imagekit.io/hbc666/hbc/hero/Facebook_Banner_zgOUjnett.jpg" alt="hbc">
  </a>
</p>

## Technology Stack

- [Angular 11](https://easybase.io/react-and-react-native-user-authentication/)
- [Firebase](https://easybase.io/react-database-app-tutorial/)
- [CoreUI](https://coreui.io/angular/)

#### Prerequisites

Before you begin, make sure your development environment includes `Node.js®` and an `npm` package manager.

```bash
Git clone https://github.com/superwalnut/hbc-secrets.git

```

1. Copy .env to Odssey root folder
2. Copy local.environment.ts to Odssey src/environments folder

both files are added to .gitignore

## Debug Locally

- make sure you have the .env file contains all required secrets. (https://github.com/superwalnut/hbc-secrets)

- npm run start or ng serve

## Build & Deploy

Try to avoid run command: npm run config.

When you run npm run config, it will run set-env.ts to override the environment.prod.ts file, that will populate all the secrets from your .env (environment variables).

If you did run that, no big deal. Just please ignore all the changes to environment.ts or environment.prod.ts files.

## Getting Started

```bash
# serve with hot reload at localhost:4200.
$ ng serve

# build for production with minification
$ ng build
```

```
free-angular-admin-template/
├── e2e/
├── src/
│   ├── app/
│   ├── assets/
│   ├── environments/
│   ├── scss/
│   ├── index.html
│   └── ...
├── .angular-cli.json
├── ...
├── package.json
└── ...
```

```
npm install
```

## Add new component

ng g c views/[name] --module=app.module

## Firebase deployment

```
firebase login
firebase init
Specify your site in firebase.json
{
  "hosting": {
    "site": "hbclub",
    "public": "public",
  ...
  }
}
```

When you're ready, deploy your web app
firebase deploy --only hosting:hbclub
visit: https://hbclub-919aa.web.app/

## New Angular/NPM version, run this

npm install --legacy-peer-deps

##### Update to Angular 11

Angular 11 requires `Node.js` version 10.13 or newer  
Update guide - see: [https://update.angular.io](https://update.angular.io)
