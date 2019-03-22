# Express Starter

There are probably hundres of Express boilerplates - but this one is mine :smirk:

## Features

* Babel es7 transpilation (support for asnyc/await etc)
* [Passport](https://www.npmjs.com/package/passport) integration with email/password login and JWT request authentication
* Roles-based auth with [ACL](https://www.npmjs.com/package/acl)
* [Mongoose](https://www.npmjs.com/package/joigoose) integration with [Joi](https://www.npmjs.com/package/joi)-based schemas via [Joigoose](https://www.npmjs.com/package/joigoose)
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
