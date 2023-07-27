const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;
const adminPhone = process.env.ADMIN_PHONE;
const client = require("twilio")(accountSid, authToken);

const SmsController = (phone, message) => {
  client.messages
    .create({
      body: message,
      from: adminPhone,
      to: `+254${phone}`
    })
    .then((message) => console.log(message.sid));
};

module.exports = SmsController
