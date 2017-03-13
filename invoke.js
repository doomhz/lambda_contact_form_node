/**
* Simulates a Lambda invokation request on localhost
*/

require('babel-register')
require('babel-polyfill')
const handler = require('./src/index').handler

const task = 'CONTACT'
const params = {
  email: 'john.doe@test.com',
  name: 'John Doe',
  message: 'Hi there!'
}

handler({ task: task, params: params }, {}, (err, response)=> {
  if (err) {
    return console.error('Lambda error: ', err)
  }
  console.log('Lambda response: ', response)
})