require('babel-polyfill')

const Lambda = require('./lib/lambda')
const Emailer = require('./lib/emailer')

function handler (event, context, callback) {
  console.log('Lambda params:', JSON.stringify(event))
  const lambda = new Lambda(event, callback)

  if (lambda.isApiGateway && lambda.params.method === 'OPTIONS') {
    return lambda.respond()
  }

  if (lambda.currentRoute === 'POST_/v1/contact' || lambda.currentTask === 'CONTACT') {
    sendContactEmail(lambda.params)
    .then(({ response, params })=> {
      console.log('Email successfully sent.', response)
      console.dir(params, { depth: 10 })
      lambda.respond()
    }).catch((err)=> {
      console.error('Could not send email.', err)
      lambda.respond(null, 'Request error.')
    })
  } else {
    lambda.respond(null, `Unknown invocation '${JSON.stringify(event)}'.`)
  }
}

function sendContactEmail (data) {
  const sesMock = {sendEmail: ()=> {return {promise: ()=> Promise.resolve({})}}}
  const emailer = new Emailer(sesMock)
  return emailer.send({
    to: 'ping@blogfordevs.com',
    from: data.email,
    subject: 'Contact from site',
    template: 'contact',
    data
  })
}

export { handler }