import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: config.MAIL_USER,
    clientId: config.MAIL_CLIENT_ID,
    clientSecret: config.MAIL_CLIENT_SECRET,
    refreshToken: config.MAIL_REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export const sendPasswordResetEmail = async (email, name, token) => {
  const resetLink = `${config.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h1 style="color: #333;">Password Reset Request</h1>
      <p style="color: #666; font-size: 16px;">Hello ${name}, someone requested a password reset for your account.</p>
      <p style="color: #666; font-size: 16px;">If this was you, please click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" 
           style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
           Reset Password
        </a>
      </div>
      <p style="color: #999; font-size: 12px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  return await transporter.sendMail({
    from: `"Online Hackathon" <${config.MAIL_USER}>`,
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export default transporter;