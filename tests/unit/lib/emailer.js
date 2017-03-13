import should from 'should'
import Emailer from '../../../src/lib/emailer'
import * as mocks from '../../mocks'
import clone from 'lodash/fp/clone'

describe('Emailer', () => {

  describe('send', () => {
    it('sends a contact email', async () => {
      const emailData = {
        to: 'to@test.com',
        from: 'from@test.com',
        subject: 'Contact from site',
        template: 'contact',
        data: {
          name: 'John',
          email: 'from@test.com',
          message: 'Hi!'
        }
      }
      const sesParams = {
        Destination: { ToAddresses: ['to@test.com'] },
        Message: {
          Body: {
            Html: {
              Data: ''
            },
            Text: {
              Data: ''
            }
          },
          Subject: { Data: 'Contact from site' }
        },
        Source: 'from@test.com'
      }
      const ses = mocks.buildSES()
      const emailer = new Emailer(ses)
      const { response, params } = await emailer.send(emailData)
      sesParams.Message.Body.Html.Data = clone(params.Message.Body.Html.Data)
      sesParams.Message.Body.Text.Data = clone(params.Message.Body.Text.Data)
      ses.sendEmail.calledWith(sesParams).should.be.true()
      params.should.deepEqual(sesParams)
    })
  })

})