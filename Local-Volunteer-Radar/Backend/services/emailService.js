const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


const getApprovalEmailTemplate = (userName, userType) => ({
    subject: 'Registration Approved - Local Volunteer Radar',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #14b8a6;">Registration Approved!</h2>
            <p>Dear ${userName},</p>
            <p>Great news! Your ${userType} registration has been approved by our admin team.</p>
            <p>You can now log in to your account and start using all features.</p>
            <a href="http://localhost:5173/login" 
               style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #3b82f6, #14b8a6); 
                      color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
                Login Now
            </a>
            <p>Thank you for joining our community!</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Local Volunteer Radar Team</p>
        </div>
    `
});

const getRejectionEmailTemplate = (userName, userType) => ({
    subject: 'Registration Update - Local Volunteer Radar',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ef4444;">Registration Status Update</h2>
            <p>Dear ${userName},</p>
            <p>We regret to inform you that your ${userType} registration could not be approved at this time.</p>
            <p>If you have questions, please contact our support team.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">Local Volunteer Radar Team</p>
        </div>
    `
});


const sendEmail = async (to, template) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || `"Local Volunteer Radar" <${process.env.EMAIL_USER}>`,
            to,
            subject: template.subject,
            html: template.html
        });
        console.log(`Email sent to ${to}`);
        return { success: true };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendApprovalEmail: (userEmail, userName, userType) =>
        sendEmail(userEmail, getApprovalEmailTemplate(userName, userType)),
    sendRejectionEmail: (userEmail, userName, userType) =>
        sendEmail(userEmail, getRejectionEmailTemplate(userName, userType))
};
