import sinon from 'sinon'

export const buildSES = ()=> {
  return {
    sendEmail: sinon.stub().returns({
      promise: sinon.stub().returns(Promise.resolve({ status: 200 }))
    })
  }
}