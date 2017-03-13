/**
* The main app handler that will be invoked by the AWS Lambda function
* http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
*/
require('babel-polyfill')

const Emailer = require('./lib/emailer')

const CONTACT_EMAIL = 'contact@yourdomain.com'
const SES_CONFIG = {
  region: 'eu-west-1'
}

// event - holds all the Lambda headers and request info
// context - has information about the Lambda runtime - http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
// callback - optional function to be called after the code execution, i.e. callback(error, stringResponse)
function handler (event, context, callback) {
  console.log('Lambda params:', JSON.stringify(event))  
  
  // This handler will both catch APIGateway and CLI invokations
  // the passed in httpMethod will make the distinction between the two of them
  if (event.httpMethod) {
    // It's an APIGateway event

    const data = parseApiGatewayEventData(event)
    
    // Defining our request API route by method and path
    const route = `${data.method}_${data.path}`
    
    switch (route) {
      case 'POST_/ContactForm':
        sendContactEmail(data.bodyParams)
        .then(({ response, params })=> {
          console.log('Email successfully sent.', response)
          console.dir(params, { depth: 10 })
          respondToLambdaRoute(callback, {})
        }).catch((err)=> {
          console.error('Could not send email.', err)
          respondToLambdaRoute(callback, 'Request error.', 500)
        })
        break
      
      default:
        respondToLambdaRoute(callback, `Unknown route '${route}'.`, 404)
    }

  } else if (event.task) {
    // It might be a Lambda task through direct invocation

    // Direct Lambda invokations, from CLI or through the AWS-SDK API
    // will have to pass an extra param called 'task' and extra params through 'params'
    switch (event.task) {
      case 'CONTACT':
        sendContactEmail(event.params)
        .then(({ response, params })=> {
          console.log('Email successfully sent.', response)
          console.dir(params, { depth: 10 })
          respondToLambdaTask(callback, {})
        }).catch((err)=> {
          console.error('Could not send email.', err)
          respondToLambdaTask(callback, 'Request error.', 500)
        })
        break
      
      default:
        respondToLambdaTask(callback, null, `Unknown task '${event.task}'.`)
    }

  } else {
    // Catch any unhandled app error and pass it to the Lambda response
    callback(`Don\'t know how to process event. ${JSON.stringify(event)}`)
  }

}

// Send it!
function sendContactEmail (data) {
  const emailer = new Emailer()
  return emailer.send({
    to: CONTACT_EMAIL,
    from: data.email,
    subject: 'Contact from site',
    template: 'contact',
    data
  })
}

// Extract event info from Lambda request
function parseApiGatewayEventData (event) {
  const body = {}
  try {
    Object.assign(body, event.body)
  } catch (e) {
    console.warn(`Could not parse Lambda body params: ${event.body}`)
  }
  return {
    headers: event.headers,
    path: event.resource,
    method: event.httpMethod,
    queryParams: event.queryStringParameters,
    pathParams: event.pathParameters,
    bodyParams: body
  }
}

// Handle the Lambda task response, convert the result to string
function respondToLambdaTask (callback, response, error){
  try {
    response = JSON.stringify(response)
  } catch (e) {
    response = `${response}`
  }
  callback(error, response)
}

// Handle the Lambda API Gateway response, convert the result to string
function respondToLambdaRoute (callback, response, error){
  const statusCode = error ? 500 : 200
  if (error) {
    response = typeof error === Error ? error.message : error
  }
  try {
    response = JSON.stringify(response)
  } catch (e) {
    response = `${response}`
  }
  // Add cross-origin headers to the response to support browser ajax requests
  const apiGatewayResponse = {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
      'Content-Type': 'application/json'
    },
    body: response
  }
  callback(null, apiGatewayResponse)
}

// Export the index.handler function, expected and invoked by AWS Lambda
export { handler }