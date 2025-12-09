const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// NOTICE THE CURLY BRACES { } BELOW
async function sendMail({ to, subject, text }) {   
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        // Now 'to' will be a proper string, so the error log will look right
        console.error(`Error sending email to ${to}:`, error);
        throw error; // Throw error so the controller knows it failed
    }
}

module.exports = sendMail;