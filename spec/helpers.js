const got = require('got')
// const faker = require('faker')
const application = require('../build')

const PORT = process.env.PORT || 3000

async function queryApi(method, resource, options) {
  const customOptions = Object.assign({}, options, { json: true, method })
  let response
  try {
    response = await got(`http://localhost:${PORT}${resource}`, customOptions)
  } catch (error) {
    response = error.response
  }
  return response
}

function startApi() {
  let server

  before(done => {
    application().then(app => {
      server = app.listen(PORT, done)
    })
  })

  after(() => {
    server.close()
  })
}

module.exports = {
  queryApi,
  testUtils: {
    startApi
  }
}
