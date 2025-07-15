export const otpVerificationTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Spyne</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f8fafc; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                    Spyne
                </h1>
                <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">
                    Welcome to the future of business automation
                </p>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 24px;">🔐</span>
                    </div>
                    <h2 style="color: #1e293b; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">
                        Verify Your Email Address
                    </h2>
                </div>
                
                <p style="color: #475569; margin: 0 0 20px 0; font-size: 16px; text-align: center;">
                    Hi <strong style="color: #1e293b;">${name}</strong>,
                </p>
                
                <p style="color: #475569; margin: 0 0 30px 0; font-size: 16px; text-align: center;">
                    Thanks for joining Spyne! To complete your registration and start exploring our platform, please verify your email address using the verification code below:
                </p>
                
                <!-- OTP Box -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border: 2px dashed #667eea; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                    <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                        Your Verification Code
                    </p>
                    <div style="background: #ffffff; border-radius: 8px; padding: 20px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                        <span style="font-size: 32px; font-weight: 700; color: #667eea; letter-spacing: 6px; font-family: 'Courier New', monospace;">
                            ${otp}
                        </span>
                    </div>
                    <p style="color: #64748b; margin: 10px 0 0 0; font-size: 14px;">
                        ⏰ This code expires in <strong>10 minutes</strong>
                    </p>
                </div>
                
                <!-- Instructions -->
                <div style="background: #f1f5f9; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
                    <h3 style="color: #1e293b; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                        What's next?
                    </h3>
                    <ul style="color: #475569; margin: 0; padding-left: 20px; font-size: 14px;">
                        <li>Enter this code in the verification page</li>
                        <li>Complete your profile setup</li>
                        <li>Start exploring Spyne's powerful features</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                    <p style="color: #64748b; font-size: 14px; margin: 0;">
                        Didn't request this email? You can safely ignore it.
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                    Best regards,<br/>
                    <strong style="color: #1e293b;">The Spyne Team</strong>
                </p>
                
                <div style="margin: 20px 0;">
                    <a href="#" style="color: #667eea; text-decoration: none; font-size: 14px; margin: 0 15px;">Support</a>
                    <a href="#" style="color: #667eea; text-decoration: none; font-size: 14px; margin: 0 15px;">Privacy</a>
                    <a href="#" style="color: #667eea; text-decoration: none; font-size: 14px; margin: 0 15px;">Terms</a>
                </div>
                
                <p style="color: #94a3b8; font-size: 12px; margin: 15px 0 0 0;">
                    © 2025 Spyne. All rights reserved.
                </p>
            </div>
            
        </div>
    </body>
    </html>
  `;
};