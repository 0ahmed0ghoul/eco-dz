import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === "true" || false,
  auth: {
    user: process.env.SMTP_USER || "your-email@gmail.com",
    pass: process.env.SMTP_PASS || "your-app-password"
  }
});

/**
 * Send booking confirmation email
 */
export const sendBookingConfirmation = async (email, bookingDetails) => {
  try {
    const {
      trip,
      participants,
      fullName,
      phone,
      totalPrice,
      agencyName,
      agencyContact
    } = bookingDetails;

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: #f9f9f9;
              border-radius: 8px;
            }
            .header {
              background: #2ecc71;
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: white;
              padding: 20px;
              border-radius: 0 0 8px 8px;
            }
            .booking-details {
              background: #f0f0f0;
              padding: 15px;
              border-left: 4px solid #2ecc71;
              margin: 15px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
            }
            .detail-label {
              font-weight: bold;
              color: #2ecc71;
            }
            .detail-value {
              text-align: right;
            }
            .trip-info {
              background: #e8f8f5;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
            }
            .agency-info {
              background: #fff3e0;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            .total-price {
              font-size: 24px;
              color: #2ecc71;
              font-weight: bold;
              text-align: center;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Booking Confirmation</h1>
              <p>Your trip is confirmed!</p>
            </div>

            <div class="content">
              <p>Dear <strong>${fullName}</strong>,</p>
              <p>Thank you for booking with us! Here are your booking details:</p>

              <div class="trip-info">
                <h3>📍 Trip Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Trip Name:</span>
                  <span class="detail-value"><strong>${trip.title}</strong></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Destination:</span>
                  <span class="detail-value">${trip.destination}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Start Date:</span>
                  <span class="detail-value">${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate || trip.startDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration:</span>
                  <span class="detail-value">${trip.duration}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Description:</span>
                  <span class="detail-value">${trip.description}</span>
                </div>
              </div>

              <div class="booking-details">
                <h3>👥 Your Booking</h3>
                <div class="detail-row">
                  <span class="detail-label">Participants:</span>
                  <span class="detail-value">${participants} ${participants > 1 ? 'people' : 'person'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Price per Person:</span>
                  <span class="detail-value">DA ${trip.price.toLocaleString()}</span>
                </div>
              </div>

              <div class="total-price">
                Total Price: DA ${totalPrice.toLocaleString()}
              </div>

              <div class="agency-info">
                <h3>🏢 Agency Information</h3>
                <p><strong>${agencyName}</strong></p>
                ${agencyContact?.email ? `<p>📧 Email: <a href="mailto:${agencyContact.email}">${agencyContact.email}</a></p>` : ''}
                ${agencyContact?.phone ? `<p>📞 Phone: <a href="tel:${agencyContact.phone}">${agencyContact.phone}</a></p>` : ''}
                ${agencyContact?.whatsapp ? `<p>💬 WhatsApp: <a href="https://wa.me/${agencyContact.whatsapp}">${agencyContact.whatsapp}</a></p>` : ''}
              </div>

              <div class="booking-details">
                <h3>📋 Your Contact Information</h3>
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${fullName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${email}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span>
                  <span class="detail-value">${phone}</span>
                </div>
              </div>

              <p style="margin-top: 20px; font-style: italic;">
                The agency will contact you shortly to confirm the final details. 
                Please keep this email as your booking reference.
              </p>

              <div class="footer">
                <p>© 2024 Eco-Tourism Algeria. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this address.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER || "noreply@ecotourism.dz",
      to: email,
      subject: `Booking Confirmation - ${trip.title}`,
      html: emailTemplate
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Booking confirmation email sent to ${email}`);
    return result;
  } catch (error) {
    console.error(`❌ Error sending booking email:`, error.message);
    // Don't throw error - allow booking to be saved even if email fails
    return null;
  }
};

/**
 * Send email to agency about new booking
 */
export const sendBookingNotificationToAgency = async (agencyEmail, bookingDetails) => {
  try {
    const {
      trip,
      participants,
      fullName,
      email,
      phone,
      totalPrice,
      agencyName
    } = bookingDetails;

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: #f9f9f9;
              border-radius: 8px;
            }
            .header {
              background: #3498db;
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: white;
              padding: 20px;
              border-radius: 0 0 8px 8px;
            }
            .booking-details {
              background: #f0f0f0;
              padding: 15px;
              border-left: 4px solid #3498db;
              margin: 15px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
            }
            .detail-label {
              font-weight: bold;
              color: #3498db;
            }
            .detail-value {
              text-align: right;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            .total-price {
              font-size: 20px;
              color: #3498db;
              font-weight: bold;
              text-align: center;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 New Booking Received</h1>
              <p>You have a new booking for: <strong>${trip.title}</strong></p>
            </div>

            <div class="content">
              <p>A customer has booked your trip!</p>

              <div class="booking-details">
                <h3>👤 Customer Information</h3>
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${fullName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value"><a href="mailto:${email}">${email}</a></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span>
                  <span class="detail-value">${phone}</span>
                </div>
              </div>

              <div class="booking-details">
                <h3>🎯 Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Trip:</span>
                  <span class="detail-value">${trip.title}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Participants:</span>
                  <span class="detail-value">${participants} ${participants > 1 ? 'people' : 'person'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Start Date:</span>
                  <span class="detail-value">${new Date(trip.startDate).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Price per Person:</span>
                  <span class="detail-value">DA ${trip.price.toLocaleString()}</span>
                </div>
              </div>

              <div class="total-price">
                Revenue: DA ${totalPrice.toLocaleString()}
              </div>

              <p style="margin-top: 20px;">
                Please contact the customer to confirm the booking details and arrange payment/logistics.
              </p>

              <div class="footer">
                <p>© 2024 Eco-Tourism Algeria. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_USER || "noreply@ecotourism.dz",
      to: agencyEmail,
      subject: `New Booking: ${trip.title} - ${participants} participants`,
      html: emailTemplate
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Booking notification email sent to agency ${agencyEmail}`);
    return result;
  } catch (error) {
    console.error(`❌ Error sending agency notification email:`, error.message);
    return null;
  }
};
