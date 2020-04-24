# Express Starter  [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) ![Dependencies](https://david-dm.org/calvin-evans/express-starter.svg) [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/calvin-evans/express-starter/blob/master/LICENSE)


There are probably hundres of Express boilerplates - but this one is mine :smirk:

## Features / Modules

* Babel es7 transpilation (support for asnyc/await etc)
* [Passport](https://www.npmjs.com/package/passport) integration with email/password login and JWT request authentication
* Roles-based auth with [ACL](https://www.npmjs.com/package/acl)
* MongoDB via [Mongoose](https://www.npmjs.com/package/mongoose)
* Dynamic route creation based on folder structure
* Unit tests with [Mocha](https://www.npmjs.com/package/mocha)
* Logging with papertrail integration if env vars are specified, falls back to [debug](https://www.npmjs.com/package/debug)
* Fixtures, API error generation and various other handy bits

Pull request welcome :)

## Usage

`npm run dev` to start in dev mode
`npm build` to create prod build
`npm start` to run built version

 check .env.example for example env vars

## License

MIT
