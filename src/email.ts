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
        user: 'willf668@gmail.com',
        clientId:
            '927404576135-ed0oqe4sbqrrp50m10ebbdbqrhp6orb4.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken:
            '1//04BariPWK8F0MCgYIARAAGAQSNwF-L9Ir_96MztBB85bg7spoMUnzvKYquffpogeG70wxXjGdeEz0dwiAw_hfGvmVo_FySkct9sY',
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
