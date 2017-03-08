import fs from 'fs'
import { SES } from 'aws-sdk'
import handlebars from 'handlebars'

const TEMPLATES_PATH = `${__dirname}/../emails`
const SES_CONFIG = {
  region: 'eu-west-1'
}
const SES_PARAMS = {
  Destination: {
    ToAddresses: []
  },
  Message: {
    Body: {
      Html: {
        Data: '',
      },
      Text: {
        Data: '',
      }
    },
    Subject: {
      Data: '',
    }
  },
  Source: '',
}

export default class Emailer {

  constructor (ses = new SES(SES_CONFIG)) {
    this._ses = ses
  }

  async send ({ to, from, subject, template, data }) {
    const templateBody = await buildTemplate(template, data)
    const params = Object.assign({}, SES_PARAMS)
    params.Source = from
    params.Destination.ToAddresses = [to]
    params.Message.Subject.Data = subject
    params.Message.Body.Html.Data = templateBody.html
    params.Message.Body.Text.Data = templateBody.text
    const response = await this._ses.sendEmail(params).promise()
    return { response, params }
  }

}

async function buildTemplate (templateName, templateData) {
  const [htmlBody, textBody] = await Promise.all([
    readTemplateBody(`${TEMPLATES_PATH}/${templateName}.html`),
    readTemplateBody(`${TEMPLATES_PATH}/${templateName}.txt`)
  ])
  return {
    html: handlebars.compile(htmlBody)(templateData),
    text: handlebars.compile(textBody)(templateData)
  }
}

async function readTemplateBody (path) {
  return new Promise((resolve, reject)=> {
    fs.readFile(path, 'utf8', (err, content)=> {
      if (err) {
        return reject(err)
      }
      resolve(content)
    })
  })
}
