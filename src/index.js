require('babel-polyfill')

const Lambda = require('./lib/lambda')
const Emailer = require('./lib/emailer')

function handler (event, context, callback) {
  console.log('Lambda params:', JSON.stringify(event))
  
  const lambda = new Lambda(event, callback)

  if (lambda.currentRoute === 'POST_/ContactForm' || lambda.currentTask === 'CONTACT') {
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
    console.error('Unknown invocation.', JSON.stringify(event))
    lambda.respond(null, 'Unknown invocation.')
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