// Install: npm install resend
import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Super fast OTP sending
export const sendOtpMail = async (to, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'DashDine <onboarding@resend.dev>', // Use your verified domain
      to: [to],
      subject: 'Reset Your Password',
      html: `<p>Your OTP for reset DashDine password is <b>${otp}</b>. It expires in 5 minutes.</p>`
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    console.log('Email sent:', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error: error.message };
  }
};

export const sendDeliveryOtpMail = async (user, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'DashDine <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Delivery OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Delivery Confirmation</h2>
          <p>Hi ${user.fullName},</p>
          <p>Your OTP for delivery confirmation is:</p>
          <h1 style="background: #f0f0f0; padding: 15px; text-align: center; letter-spacing: 5px;">
            ${otp}
          </h1>
          <p>This OTP expires in 5 minutes.</p>
          <p>Best regards,<br>DashDine Team</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    console.log('Delivery OTP sent:', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error sending delivery OTP:', error);
    return { success: false, error: error.message };
  }
};

// Non-blocking versions
export const sendOtpMailAsync = (to, otp) => {
  sendOtpMail(to, otp).catch(err => 
    console.error('Failed to send OTP:', err)
  );
};

export const sendDeliveryOtpMailAsync = (user, otp) => {
  sendDeliveryOtpMail(user, otp).catch(err => 
    console.error('Failed to send delivery OTP:', err)
  );
};

// Setup instructions:
// 1. Sign up at https://resend.com
// 2. Get API key from dashboard
// 3. Add to .env: RESEND_API_KEY=re_xxxxx
// 4. Verify your domain (optional, or use onboarding@resend.dev for testing)
