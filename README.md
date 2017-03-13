# Lambda Contact Form on NodeJS

Send contact form emails with AWS Lambda, SES and NodeJS.

## Install

- verify an email address with SES ([see tutorial](http://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses.html))
- create a Lambda function with APIGateway trigger ([see tutorial](http://docs.aws.amazon.com/lambda/latest/dg/getting-started.html))
- add SES full permissions to the newlly created Lambda function
- adjust the `scripts/*.sh` files to match your Lambda name
- make sure you have `aws-cli` installed locally ([see tutorial](http://docs.aws.amazon.com/cli/latest/userguide/installing.html))
- `npm install`
- `npm run deploy`

Invoke Lambda from CLI from `scripts/invoke.sh`.
Add your contact email and `SES` config to `src/lib/emailer.js`.


## Contact form

Once your Lambda code deployed, build your HTML contact form and send Ajax requests to your APIGateway endpoint.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Contact form</title>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
</head>
<body>
  <h1>Contact us</h1>
  <form id="contact-form">
    <div>
      <input type="text" name="name" placeholder="Name" id="name">
    </div>
    <div>
      <input type="email" name="email" placeholder="Email" id="email">
    </div>
    <div>
      <textarea name="message" placeholder="Message" id="message"></textarea>
    </div>
    <div>
      <button type="button" id="send-bt">Send</button>
    </div>
  </form>
  <script type="text/javascript">
    var API_GATEWAY_ENDPOINT = 'https://your-api-id.execute-api.eu-west-1.amazonaws.com/prod'
    document.getElementById("send-bt").onclick = function () {
      axios.post(API_GATEWAY_ENDPOINT + '/ContactForm', {
        name: document.getElementById('name').value(),
        email: document.getElementById('email').value(),
        message: document.getElementById('message').value()
      })
      .then(function (response) {
        console.log(response)
        alert('Message sent!')
      })
      .catch(function (error) {
        console.log(error)
        alert('Could not send message :(')
      });
    }
  </script>
</body>
</html>
```