import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else if (success) {
    console.log('Email service ready');
  }
});

export async function sendBookingConfirmation(
  email: string,
  customerName: string,
  serviceName: string,
  bookingDate: Date,
  amount: number,
  duration?: number,
  durationUnit?: string,
  destination?: string,
  hourlyRate?: number
) {
  const durationText = duration && durationUnit ? `${duration} ${durationUnit}${duration > 1 ? 's' : ''}` : 'N/A';
  const rateText = hourlyRate ? `${hourlyRate} Taka/hour` : 'Variable';
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '✓ Booking Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Thank You for Your Booking!</h2>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${customerName},</p>
          <p>Your booking has been successfully confirmed. Here are the details:</p>
          <div style="background-color: white; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Booking Date:</strong> ${new Date(bookingDate).toLocaleDateString()}</p>
            <p><strong>Booking Time:</strong> ${new Date(bookingDate).toLocaleTimeString()}</p>
            <p><strong>Duration:</strong> ${durationText}</p>
            <p><strong>Rate:</strong> ${rateText}</p>
            <p><strong>Pickup Location:</strong> ${destination || 'N/A'}</p>
            <p><strong>Amount Paid:</strong> ${(amount / 100).toFixed(0)} Taka</p>
          </div>
          <p>We look forward to serving you!</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p style="margin-top: 30px; color: #666;">Best regards,<br/><strong>Booking Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Booking confirmation email sent successfully:', info.response);
    return true;
  } catch (error) {
    console.error('✗ Error sending booking confirmation email:', error);
    return false;
  }
}

export async function sendAdminNotification(
  customerName: string,
  serviceName: string,
  bookingDate: Date,
  amount: number,
  duration?: number,
  durationUnit?: string,
  destination?: string,
  customerEmail?: string,
  customerPhone?: string
) {
  const durationText = duration && durationUnit ? `${duration} ${durationUnit}${duration > 1 ? 's' : ''}` : 'N/A';
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: '🔔 New Booking Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2196F3; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">New Booking Alert</h2>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>A new booking has been received:</p>
          <div style="background-color: white; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0;">
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Customer Email:</strong> ${customerEmail || 'N/A'}</p>
            <p><strong>Customer Phone:</strong> ${customerPhone || 'N/A'}</p>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Duration:</strong> ${durationText}</p>
            <p><strong>Pickup Location:</strong> ${destination || 'N/A'}</p>
            <p><strong>Booking Date:</strong> ${new Date(bookingDate).toLocaleDateString()}</p>
            <p><strong>Booking Time:</strong> ${new Date(bookingDate).toLocaleTimeString()}</p>
            <p><strong>Amount:</strong> ${(amount / 100).toFixed(0)} Taka</p>
          </div>
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">View in Admin Panel</a></p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Admin notification email sent successfully:', info.response);
    return true;
  } catch (error) {
    console.error('✗ Error sending admin notification email:', error);
    return false;
  }
}
