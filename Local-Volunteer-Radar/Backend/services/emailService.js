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
            <a href="https://local-volunteer-radar-f.onrender.com/login" 
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

const getOTPEmailTemplate = (otp) => ({
    subject: 'Password Reset OTP - Local Volunteer Radar',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0891b2;">Password Reset Request</h2>
            <p>You requested to reset your password. Use the OTP below to verify your identity:</p>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="color: #0891b2; letter-spacing: 8px; font-size: 32px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #6b7280;">This OTP is valid for 10 minutes.</p>
            <p style="color: #6b7280;">If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #9ca3af; font-size: 12px;">Local Volunteer Radar - Connecting Communities</p>
        </div>
    `
});

module.exports = {
    sendApprovalEmail: (userEmail, userName, userType) =>
        sendEmail(userEmail, getApprovalEmailTemplate(userName, userType)),
    sendRejectionEmail: (userEmail, userName, userType) =>
        sendEmail(userEmail, getRejectionEmailTemplate(userName, userType)),
    sendOTPEmail: (userEmail, otp) =>
        sendEmail(userEmail, getOTPEmailTemplate(otp))
};
