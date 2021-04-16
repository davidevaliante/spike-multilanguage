const sgMail = require('@sendgrid/mail')

export default async (req, res) => {
    const { email, message } = req.body

    const content = {
        to: 'akainurev@gmail.com',
        from: email,
        subject: `New Message From - ${email}`,
        text: message,
        html: `<p>${message}</p>`
    }

    try {
        console.log('sending')
        await sgMail.send(content)
        res.status(200).send({text:'Message sent successfully.'})
        console.log('sent')

    } catch (error) {
        console.log('ERROR', error)
        res.status(400).send('Message not sent.')
    }
}

