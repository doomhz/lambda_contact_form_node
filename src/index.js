import Emailer from './lib/emailer'

async function run () {
  const emailConfig = {
    to: 'ping@blogfordevs.com',
    from: 'ping@blogfordevs.com',
    subject: 'Contact from site',
    template: 'contact',
    data: {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      message: 'Hi there!',
    }
  }
  const sesMock = {sendEmail: ()=> {return {promise: ()=> Promise.resolve({})}}}
  const emailer = new Emailer(sesMock)

  try {
    const { response, params } = await emailer.send(emailConfig)
    console.log('Email successfully sent.')
    console.dir(params, {depth: 10})
    console.log(response)
  } catch (err) {
    console.error('Could not send email.')
    throw err
  }
}

run()