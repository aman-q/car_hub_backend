export const otpVerificationTemplate = (name, otp) => {
  return `
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for registering! Please verify your email using the OTP below:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for 10 minutes.</p>
    <p>Regards,<br/>Your App Team</p>
  `;
};