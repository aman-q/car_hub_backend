export const otpVerificationTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - SPYNE</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);">
            
            <!-- Header with gradient -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center; position: relative;">
                <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 15px; padding: 30px; margin: 0 auto; max-width: 300px;">
                    <div style="width: 60px; height: 60px; background: #ffffff; border-radius: 15px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);">
                        <span style="font-size: 28px;">🔐</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 700; letter-spacing: -1px;">
                        SPYNE
                    </h1>
                    <p style="color: rgba(255, 255, 255, 0.8); margin: 8px 0 0 0; font-size: 16px; font-weight: 500;">
                        Premium Car Rentals
                    </p>
                </div>
            </div>
            
            <!-- Content -->
            <div style="padding: 50px 40px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h2 style="color: #1a202c; margin: 0 0 16px 0; font-size: 32px; font-weight: 700; line-height: 1.2;">
                        Verify Your Email
                    </h2>
                    <p style="color: #718096; margin: 0; font-size: 18px; line-height: 1.6;">
                        Hi <strong style="color: #2d3748;">${name}</strong>, we're excited to have you on board! Please verify your email address to get started.
                    </p>
                </div>
                
                <!-- OTP Code -->
                <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 20px; padding: 40px 30px; text-align: center; margin: 40px 0; border: 1px solid #e2e8f0;">
                    <p style="color: #4a5568; margin: 0 0 20px 0; font-size: 16px; font-weight: 500;">
                        Your verification code
                    </p>
                    <div style="background: #ffffff; border-radius: 15px; padding: 25px; margin: 0 auto; display: inline-block; border: 2px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                        <span style="font-size: 42px; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: 12px; font-family: 'Courier New', monospace;">
                            ${otp}
                        </span>
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
                        <p style="color: #856404; margin: 0; font-size: 14px; font-weight: 500;">
                            ⏰ This code expires in 10 minutes
                        </p>
                    </div>
                </div>
                
                <!-- Action buttons -->
                <div style="text-align: center; margin: 40px 0;">
                    <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: 600; display: inline-block; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                        Verify Email Address
                    </a>
                </div>
                
                <div style="background: #f7fafc; border-radius: 15px; padding: 25px; margin: 30px 0; border-left: 4px solid #667eea;">
                    <p style="color: #4a5568; margin: 0; font-size: 15px; line-height: 1.6;">
                        <strong style="color: #2d3748;">Security tip:</strong> We will never ask for your verification code via phone or email. If you didn't request this code, please ignore this email.
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                <div style="margin-bottom: 20px;">
                    <a href="#" style="color: #667eea; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 500;">Help Center</a>
                    <a href="#" style="color: #667eea; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 500;">Contact Support</a>
                    <a href="#" style="color: #667eea; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 500;">Privacy Policy</a>
                </div>
                <p style="color: #718096; margin: 0; font-size: 14px;">
                    © 2025 SPYNE. All rights reserved.
                </p>
                <p style="color: #a0aec0; margin: 8px 0 0 0; font-size: 12px;">
                    This email was sent to verify your account. If you have any questions, contact us at support@spyne.com
                </p>
            </div>
            
        </div>
    </body>
    </html>
  `;
};

export const bookingConfirmationTemplate = (user, car, booking) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmed - SPYNE</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px;">
        <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; position: relative;">
                <div style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border-radius: 15px; padding: 30px; margin: 0 auto; max-width: 400px;">
                    <div style="width: 80px; height: 80px; background: #ffffff; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);">
                        <span style="font-size: 36px; color: #10b981;">✅</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 36px; font-weight: 700; letter-spacing: -1px;">
                        Booking Confirmed!
                    </h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 0; font-size: 16px; font-weight: 500;">
                        Your rental is all set
                    </p>
                </div>
            </div>
            
            <!-- Content -->
            <div style="padding: 50px 40px;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h2 style="color: #1a202c; margin: 0 0 16px 0; font-size: 28px; font-weight: 700;">
                        Hi ${user.fname}! 🎉
                    </h2>
                    <p style="color: #718096; margin: 0; font-size: 18px; line-height: 1.6;">
                        We're thrilled to confirm your booking. Get ready for an amazing driving experience!
                    </p>
                </div>
                
                <!-- Booking Details Card -->
                <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 20px; padding: 40px 35px; margin: 40px 0; border: 1px solid #e2e8f0;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h3 style="color: #2d3748; margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">
                            ${car.title}
                        </h3>
                        <div style="background: #667eea; color: #ffffff; padding: 8px 20px; border-radius: 25px; display: inline-block; font-size: 14px; font-weight: 600;">
                              Booking ID: #${booking._id.toString().slice(-8).toUpperCase()}
                        </div>
                    </div>
                    
                    <!-- Booking Timeline -->
                    <div style="background: #ffffff; border-radius: 15px; padding: 30px; margin: 25px 0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                            <div style="text-align: left; flex: 1;">
                                <div style="color: #10b981; font-size: 14px; font-weight: 600; margin-bottom: 5px;">PICKUP</div>
                                <div style="color: #1a202c; font-size: 18px; font-weight: 700; margin-bottom: 5px;">${formatDate(booking.startDate)}</div>
                                <div style="color: #4a5568; font-size: 14px;">${formatTime(booking.startDate)}</div>
                            </div>
                            <div style="flex: 0 0 40px; text-align: center;">
                                <div style="width: 40px; height: 2px; background: linear-gradient(to right, #10b981, #667eea);"></div>
                            </div>
                            <div style="text-align: right; flex: 1;">
                                <div style="color: #dc2626; font-size: 14px; font-weight: 600; margin-bottom: 5px;">RETURN</div>
                                <div style="color: #1a202c; font-size: 18px; font-weight: 700; margin-bottom: 5px;">${formatDate(booking.endDate)}</div>
                                <div style="color: #4a5568; font-size: 14px;">${formatTime(booking.endDate)}</div>
                            </div>
                        </div>
                        
                        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                                <div>
                                    <div style="color: #4a5568; font-size: 14px; margin-bottom: 5px;">📍 Pickup Location</div>
                                    <div style="color: #1a202c; font-size: 16px; font-weight: 600;">${booking.pickupLocation}</div>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <div>
                                    <div style="color: #4a5568; font-size: 14px; margin-bottom: 5px;">📍 Drop-off Location</div>
                                    <div style="color: #1a202c; font-size: 16px; font-weight: 600;">${booking.dropoffLocation}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Price Breakdown -->
                    <div style="background: #ffffff; border-radius: 15px; padding: 30px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
                        <h4 style="color: #1a202c; margin: 0 0 20px 0; font-size: 18px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                            💰 Payment Summary
                        </h4>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                            <span style="color: #4a5568; font-size: 16px;">Rental Total</span>
                            <span style="color: #1a202c; font-size: 16px; font-weight: 600;">$${booking.price}</span>
                        </div>
                        <div style="border-top: 2px solid #e2e8f0; padding-top: 15px; margin-top: 15px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #1a202c; font-size: 20px; font-weight: 700;">Total Paid</span>
                                <span style="color: #10b981; font-size: 24px; font-weight: 800;">$${booking.price}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div style="text-align: center; margin: 40px 0;">
                    <a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-size: 16px; font-weight: 600; display: inline-block; margin: 0 10px 15px 10px; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);">
                        View Booking Details
                    </a>
                    <a href="#" style="background: #ffffff; color: #667eea; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-size: 16px; font-weight: 600; display: inline-block; margin: 0 10px 15px 10px; border: 2px solid #667eea;">
                        Contact Support
                    </a>
                </div>
                
                <!-- Important Info -->
                <div style="background: #fef3c7; border-radius: 15px; padding: 25px; margin: 30px 0; border-left: 4px solid #f59e0b;">
                    <h4 style="color: #92400e; margin: 0 0 15px 0; font-size: 16px; font-weight: 700;">
                        📋 Important Reminders
                    </h4>
                    <ul style="color: #92400e; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                        <li>Bring a valid driver's license and credit card</li>
                        <li>Arrive 15 minutes early for pickup</li>
                        <li>Vehicle inspection will be conducted before and after rental</li>
                        <li>Return with the same fuel level as pickup</li>
                    </ul>
                </div>
                
                <div style="background: #f0f9ff; border-radius: 15px; padding: 25px; margin: 30px 0; border-left: 4px solid #0ea5e9;">
                    <p style="color: #0c4a6e; margin: 0; font-size: 15px; line-height: 1.6;">
                        <strong style="color: #075985;">Need help?</strong> Our customer support team is available 24/7 to assist you. Contact us at support@spyne.com or call +1 (555) 123-4567.
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #1a202c; margin: 0 0 15px 0; font-size: 18px; font-weight: 700;">
                        SPYNE
                    </h4>
                    <p style="color: #718096; margin: 0 0 20px 0; font-size: 14px;">
                        Premium car rentals for your every journey
                    </p>
                </div>
                <div style="margin-bottom: 20px;">
                    <a href="#" style="color: #667eea; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 500;">Manage Booking</a>
                    <a href="#" style="color: #667eea; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 500;">Help Center</a>
                    <a href="#" style="color: #667eea; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 500;">Contact Support</a>
                </div>
                <p style="color: #718096; margin: 0; font-size: 14px;">
                    © 2025 SPYNE. All rights reserved.
                </p>
                <p style="color: #a0aec0; margin: 8px 0 0 0; font-size: 12px;">
                    This email was sent regarding your booking. If you have any questions, contact us at support@spyne.com
                </p>
            </div>
            
        </div>
    </body>
    </html>
  `;
};