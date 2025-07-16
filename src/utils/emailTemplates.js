export const otpVerificationTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Spyne</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 500px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: #2563eb; padding: 32px 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px;">
                    Spyne
                </h1>
                <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 15px;">
                    Car Rental Platform
                </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 32px;">
                <h2 style="color: #1f2937; margin: 0 0 8px 0; font-size: 24px; font-weight: 700; text-align: center;">
                    Verify Your Email
                </h2>
                
                <p style="color: #6b7280; margin: 0 0 32px 0; font-size: 16px; text-align: center; line-height: 1.5;">
                    Hi <strong style="color: #1f2937;">${name}</strong>, please use the code below to verify your email address:
                </p>
                
                <!-- OTP -->
                <div style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 32px 24px; text-align: center; margin: 32px 0;">
                    <div style="background: #ffffff; border-radius: 8px; padding: 24px; margin: 0 auto; display: inline-block; border: 1px solid #e5e7eb;">
                        <span style="font-size: 36px; font-weight: 900; color: #2563eb; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${otp}
                        </span>
                    </div>
                    <p style="color: #6b7280; margin: 16px 0 0 0; font-size: 14px;">
                        Valid for 10 minutes
                    </p>
                </div>
                
                <p style="color: #6b7280; margin: 32px 0 0 0; font-size: 14px; text-align: center;">
                    If you didn't request this, please ignore this email.
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                    © 2025 Spyne. All rights reserved.
                </p>
            </div>
            
        </div>
    </body>
    </html>
  `;
};