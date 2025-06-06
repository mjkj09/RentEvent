const SibApiV3Sdk = require('sib-api-v3-sdk');

// Configure Brevo (formerly Sendinblue) API
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

exports.sendVenueInquiry = async (requestData) => {
    try {
        const { venue, senderName, senderEmail, senderPhone, eventDate, eventType, expectedGuestCount, message, receiver } = requestData;

        const eventDateFormatted = eventDate
            ? new Date(eventDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            : 'Not specified';

        const emailContent = {
            sender: {
                name: 'RentEvent Platform',
                email: process.env.BREVO_SENDER_EMAIL || 'noreply@rentevent.com'
            },
            to: [{
                email: receiver.email,
                name: `${receiver.name} ${receiver.surname}`
            }],
            subject: `New Venue Inquiry - ${venue.name}`,
            htmlContent: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            line-height: 1.6; 
                            color: #333; 
                            margin: 0; 
                            padding: 0; 
                        }
                        .container { 
                            max-width: 600px; 
                            margin: 0 auto; 
                            padding: 20px; 
                            background-color: #ffffff; 
                        }
                        .header { 
                            background: linear-gradient(135deg, #2B293D 0%, #4A4A5E 100%); 
                            color: white; 
                            padding: 30px; 
                            text-align: center; 
                            border-radius: 10px 10px 0 0; 
                        }
                        .header h1 { 
                            margin: 0; 
                            font-size: 28px; 
                            font-weight: 700; 
                        }
                        .content { 
                            padding: 30px; 
                            background-color: #f8f9fa; 
                        }
                        .venue-info { 
                            background: #fff; 
                            padding: 20px; 
                            border-radius: 8px; 
                            margin-bottom: 20px; 
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
                        }
                        .venue-name { 
                            color: #2B293D; 
                            font-size: 22px; 
                            font-weight: 600; 
                            margin-bottom: 10px; 
                        }
                        .contact-info { 
                            background: #e8f4f8; 
                            padding: 15px; 
                            border-radius: 6px; 
                            margin: 15px 0; 
                        }
                        .info-item { 
                            background: #fff; 
                            padding: 15px; 
                            border-radius: 6px; 
                            border-left: 4px solid #FFE047; 
                            margin-bottom: 10px;
                        }
                        .info-label { 
                            font-weight: 600; 
                            color: #2B293D; 
                            font-size: 14px; 
                        }
                        .info-value { 
                            color: #666; 
                            font-size: 16px; 
                        }
                        .message-section { 
                            background: #fff; 
                            padding: 20px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
                        }
                        .message-content { 
                            background: #f8f9fa; 
                            padding: 15px; 
                            border-radius: 6px; 
                            font-style: italic; 
                            border-left: 4px solid #2B293D; 
                        }
                        .cta-button { 
                            display: inline-block; 
                            background: #FFE047; 
                            color: #2B293D; 
                            padding: 15px 30px; 
                            text-decoration: none; 
                            border-radius: 8px; 
                            font-weight: 600; 
                            font-size: 16px; 
                            margin: 10px 5px;
                        }
                        .footer { 
                            background: #2B293D; 
                            color: white; 
                            padding: 20px; 
                            text-align: center; 
                            border-radius: 0 0 10px 10px; 
                            font-size: 14px; 
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🏛️ New Venue Inquiry</h1>
                            <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone is interested in your venue!</p>
                        </div>
                        
                        <div class="content">
                            <div class="venue-info">
                                <div class="venue-name">📍 ${venue.name}</div>
                                <p style="color: #666; margin: 0;">${venue.category} • ${venue.location?.city}, ${venue.location?.region}</p>
                            </div>

                            <div class="contact-info">
                                <h3 style="color: #2B293D; margin-top: 0;">👤 Contact Information</h3>
                                <p><strong>Name:</strong> ${senderName}</p>
                                <p><strong>Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
                                <p><strong>Phone:</strong> <a href="tel:${senderPhone}">${senderPhone}</a></p>
                            </div>

                            <div class="info-item">
                                <div class="info-label">📅 Event Date</div>
                                <div class="info-value">${eventDateFormatted}</div>
                            </div>
                            
                            <div class="info-item">
                                <div class="info-label">🎉 Event Type</div>
                                <div class="info-value">${eventType}</div>
                            </div>
                            
                            <div class="info-item">
                                <div class="info-label">👥 Expected Guests</div>
                                <div class="info-value">${expectedGuestCount} people (Max: ${venue.capacity})</div>
                            </div>

                            <div class="message-section">
                                <h3 style="color: #2B293D; margin-top: 0;">💬 Message from ${senderName}</h3>
                                <div class="message-content">
                                    "${message}"
                                </div>
                            </div>

                            <div style="text-align: center; margin: 30px 0;">
                                <p style="margin-bottom: 20px; color: #666;">Ready to respond to this inquiry?</p>
                                <a href="mailto:${senderEmail}?subject=Re: ${venue.name} Venue Inquiry&body=Hi ${senderName},%0D%0A%0D%0AThank you for your interest in ${venue.name}!" class="cta-button">
                                    📧 Reply via Email
                                </a>
                                <a href="tel:${senderPhone}" class="cta-button">
                                    📞 Call ${senderPhone}
                                </a>
                            </div>
                        </div>

                        <div class="footer">
                            <p style="margin: 0 0 10px 0;"><strong>RentEvent Platform</strong></p>
                            <p style="margin: 0; opacity: 0.8;">Connecting venues with perfect events</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            textContent: `
New Venue Inquiry - ${venue.name}

Contact Information:
- Name: ${senderName}
- Email: ${senderEmail}
- Phone: ${senderPhone}

Event Details:
- Date: ${eventDateFormatted}
- Type: ${eventType}
- Expected Guests: ${expectedGuestCount} people
- Venue Capacity: ${venue.capacity} people max

Message:
"${message}"

To respond, reply to this email or call ${senderPhone}.

---
RentEvent Platform
            `
        };

        console.log(`📧 Sending venue inquiry email to ${receiver.email} for venue: ${venue.name}`);

        const result = await apiInstance.sendTransacEmail(emailContent);
        console.log('✅ Email sent successfully:', result.messageId);

        return {
            success: true,
            messageId: result.messageId
        };

    } catch (error) {
        console.error('❌ Error sending venue inquiry email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

exports.sendInquiryConfirmation = async (requestData) => {
    try {
        const { venue, senderName, senderEmail, receiver } = requestData;

        const emailContent = {
            sender: {
                name: 'RentEvent Platform',
                email: process.env.BREVO_SENDER_EMAIL || 'noreply@rentevent.com'
            },
            to: [{
                email: senderEmail,
                name: senderName
            }],
            subject: `Inquiry Sent - ${venue.name}`,
            htmlContent: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
                        .header { background: linear-gradient(135deg, #2B293D 0%, #4A4A5E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { padding: 30px; background-color: #f8f9fa; }
                        .success-message { background: #d4edda; color: #155724; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
                        .venue-info { background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                        .footer { background: #2B293D; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Inquiry Sent Successfully</h1>
                        </div>
                        
                        <div class="content">
                            <div class="success-message">
                                <h3 style="margin-top: 0;">Your venue inquiry has been sent!</h3>
                                <p style="margin-bottom: 0;">The venue owner will contact you soon.</p>
                            </div>

                            <div class="venue-info">
                                <h3 style="color: #2B293D; margin-top: 0;">📍 ${venue.name}</h3>
                                <p style="color: #666; margin: 0;">${venue.category} • ${venue.location?.city}, ${venue.location?.region}</p>
                            </div>

                            <p>Dear ${senderName},</p>
                            <p>Thank you for your interest in <strong>${venue.name}</strong>. Your inquiry has been successfully delivered to ${receiver.name} ${receiver.surname}.</p>
                            <p>You should receive a response within 24-48 hours. The venue owner will contact you via email or phone to discuss your event details and provide pricing information.</p>
                        </div>

                        <div class="footer">
                            <p style="margin: 0 0 10px 0;"><strong>RentEvent Platform</strong></p>
                            <p style="margin: 0; opacity: 0.8;">Connecting venues with perfect events</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            textContent: `
Inquiry Sent Successfully - ${venue.name}

Dear ${senderName},

Thank you for your interest in ${venue.name}. Your inquiry has been successfully delivered to ${receiver.name} ${receiver.surname}.

You should receive a response within 24-48 hours.

---
RentEvent Platform
            `
        };

        const result = await apiInstance.sendTransacEmail(emailContent);
        console.log('✅ Confirmation email sent successfully:', result.messageId);

        return {
            success: true,
            messageId: result.messageId
        };

    } catch (error) {
        console.error('❌ Error sending confirmation email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};