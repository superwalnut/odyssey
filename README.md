
#### Prerequisites
Before you begin, make sure your development environment includes `Node.js®` and an `npm` package manager.

###### Node.js
Angular 11 requires `Node.js` version 10.13 or later.

- To check your version, run `node -v` in a terminal/console window.
- To get `Node.js`, go to [nodejs.org](https://nodejs.org/).

###### Angular CLI
Install the Angular CLI globally using a terminal/console window.
```bash
npm install -g @angular/cli
```

##### Update to Angular 11
Angular 11 requires `Node.js` version 10.13 or newer    
Update guide - see: [https://update.angular.io](https://update.angular.io)

## Installation

### Clone repo

``` bash
# clone the repo
$ git clone https://github.com/coreui/coreui-free-angular-admin-template.git my-project

# go into app's directory
$ cd my-project

# install app's dependencies
$ npm install
```

## Usage

``` bash
# serve with hot reload at localhost:4200.
$ ng serve

# build for production with minification
$ ng build
```

## What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

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

## Documentation

The documentation for the CoreUI Free Angularp Admin Template is hosted at our website [CoreUI](https://coreui.io/angular/)

## Contributing

Please read through our [contributing guidelines](https://github.com/coreui/coreui-free-angular-admin-template/blob/master/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

Editor preferences are available in the [editor config](https://github.com/coreui/coreui-free-angular-admin-template/blob/master/.editorconfig) for easy use in common text editors. Read more and download plugins at <http://editorconfig.org>.

## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, CoreUI Free Admin Template is maintained under [the Semantic Versioning guidelines](http://semver.org/).

See [the Releases section of our project](https://github.com/coreui/coreui-free-angular-admin-template/releases) for changelogs for each release version.

## Creators

**Łukasz Holeczek**

* <https://twitter.com/lukaszholeczek>
* <https://github.com/mrholek>

**Andrzej Kopański**

* <https://github.com/xidedix>

## Community

Get updates on CoreUI's development and chat with the project maintainers and community members.

- Follow [@core_ui on Twitter](https://twitter.com/core_ui).
- Read and subscribe to [CoreUI Blog](https://coreui.io/blog/).

### Community Projects

Some of projects created by community but not maintained by CoreUI team.

* [NuxtJS + Vue CoreUI](https://github.com/muhibbudins/nuxt-coreui)
* [Colmena](https://github.com/colmena/colmena)

## Copyright and license

copyright 2017-2021 creativeLabs Łukasz Holeczek. Code released under [the MIT license](https://github.com/coreui/coreui-free-angular-admin-template/blob/master/LICENSE).
There is only one limitation you can't re-distribute the CoreUI as stock. You can’t do this if you modify the CoreUI. In past we faced some problems with persons who tried to sell CoreUI based templates.

## Support CoreUI Development

CoreUI is an MIT licensed open source project and completely free to use. However, the amount of effort needed to maintain and develop new features for the project is not sustainable without proper financial backing. You can support development by donating on [PayPal](https://www.paypal.me/holeczek), buying [CoreUI Pro Version](https://coreui.io/pro) or buying one of our [premium admin templates](https://genesisui.com/?support=1).

As of now I am exploring the possibility of working on CoreUI full-time - if you are a business that is building core products using CoreUI, I am also open to conversations regarding custom sponsorship / consulting arrangements. Get in touch on [Twitter](https://twitter.com/lukaszholeczek).

## Add new component

ng g c views/[name] --module:app.module

## Firebase deployment
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
When you're ready, deploy your web app
firebase deploy --only hosting:hbclub
visit: https://hbclub-919aa.web.app/

## New Angular, NPM version, run this 
npm install --legacy-peer-deps
