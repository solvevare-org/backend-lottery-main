import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        auth: {
            user: 'info@solvevare.com',
            pass: '@Solvevare2024',
        }
    });

    const mailOptions = {
        from: 'info@solvevare.com', // Replace with your sender email
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
};