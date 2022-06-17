// https://www.zeolearn.com/magazine/sending-and-receiving-emails-using-nodejs
import nodemailer from 'nodemailer';
const senderEmail = process.env.EMAIL || '';

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
});

export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
}

export const sendMail = async (options: MailOptions) => {
    transporter.sendMail(
        {
            ...options,
            from: {
                name: options.from,
                address: senderEmail,
            },
        },
        (e) => {
            if (e) {
                console.log(e);
            }
            transporter.close();
        }
    );
};
