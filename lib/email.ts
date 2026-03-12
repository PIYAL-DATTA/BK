import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendBookingConfirmation(
  email: string,
  customerName: string,
  serviceName: string,
  bookingDate: Date,
  amount: number
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Booking Confirmation',
    html: `
      <h2>Thank You for Your Booking!</h2>
      <p>Dear ${customerName},</p>
      <p>Your booking has been confirmed. Here are the details:</p>
      <ul>
        <li><strong>Service:</strong> ${serviceName}</li>
        <li><strong>Date:</strong> ${new Date(bookingDate).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${new Date(bookingDate).toLocaleTimeString()}</li>
        <li><strong>Amount Paid:</strong> $${(amount / 100).toFixed(2)}</li>
      </ul>
      <p>We look forward to serving you!</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br/>Booking Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendAdminNotification(
  customerName: string,
  serviceName: string,
  bookingDate: Date,
  amount: number
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Booking Received',
    html: `
      <h2>New Booking Alert</h2>
      <p>A new booking has been received:</p>
      <ul>
        <li><strong>Customer:</strong> ${customerName}</li>
        <li><strong>Service:</strong> ${serviceName}</li>
        <li><strong>Date:</strong> ${new Date(bookingDate).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${new Date(bookingDate).toLocaleTimeString()}</li>
        <li><strong>Amount:</strong> $${(amount / 100).toFixed(2)}</li>
      </ul>
      <p>Please review in the admin panel.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending admin email:', error);
  }
}
