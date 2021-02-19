const sgMail = require('@sendgrid/mail')

export default async (req, res) => {
    if (!process.env.SENDGRID_API_KEY) return res.status(400).send('Message not sent.')
    sgMail.setApiKey('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')
    const { email, message } = req.body

    const content = {
        to: 'akainurev@gmail.com',
        from: email,
        subject: `New Message From - ${email}`,
        text: message,
        html: `<p>${message}</p>`
    }

    try {
        await sgMail.send(content)
        res.status(200).send('Message sent successfully.')
    } catch (error) {
        console.log('ERROR', error)
        res.status(400).send('Message not sent.')
    }
}

