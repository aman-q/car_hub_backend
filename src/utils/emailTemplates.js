// ─── date helpers ─────────────────────────────────────────────────────────────

const fmtShort = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmtYear  = (d) => new Date(d).getFullYear();
const fmtFull  = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// ─── shared CSS injected into every template ──────────────────────────────────

const css = `
<style>
  body,table,td,p,a,h1,h2,span { -webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
  table,td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
  @media only screen and (max-width:620px) {
    .card        { width:100% !important;border-radius:0 !important; }
    .outer       { padding:0 !important; }
    .hero        { padding:36px 24px 32px !important; }
    .body-pad    { padding:32px 24px !important; }
    .footer-pad  { padding:24px !important; }
    .h1          { font-size:24px !important;line-height:1.25 !important; }
    .ticket-l    { display:block !important;width:100% !important;border-right:none !important;border-bottom:1px dashed #D1D5DB !important;padding-right:0 !important; }
    .ticket-r    { display:block !important;width:100% !important;padding-left:0 !important;padding-top:20px !important; }
    .otp-cell    { width:40px !important;height:52px !important;font-size:24px !important;border-radius:8px !important; }
    .otp-gap     { width:6px !important; }
    .btn         { width:100% !important;display:block !important;text-align:center !important;box-sizing:border-box !important; }
    .fl          { display:block !important;margin:5px 0 !important; }
    .row-label   { font-size:11px !important; }
    .row-value   { font-size:13px !important; }
  }
</style>`;

// ─── structural helpers ───────────────────────────────────────────────────────

// Dark SPYNE brand bar at the very top
const brandBar = `
<tr>
  <td align="left" style="background:#0F172A;padding:18px 40px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <span style="font-size:18px;font-weight:700;color:#FFFFFF;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">SPYNE</span>
          <span style="font-size:12px;color:#64748B;margin-left:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Premium Car Rentals</span>
        </td>
      </tr>
    </table>
  </td>
</tr>`;

// Coloured hero: icon + heading + subtitle + optional badge
const hero = (color, iconEmoji, heading, subtitle, badge = '') => `
<tr>
  <td class="hero" align="center" style="background:${color};padding:48px 40px 40px;">
    <div style="width:72px;height:72px;border-radius:36px;background:rgba(255,255,255,0.18);margin:0 auto 20px;font-size:32px;line-height:72px;text-align:center;">
      ${iconEmoji}
    </div>
    <h1 class="h1" style="margin:0 0 8px;font-size:28px;font-weight:700;color:#FFFFFF;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.2;">${heading}</h1>
    <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.82);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${subtitle}</p>
    ${badge ? `<div style="display:inline-block;margin-top:16px;padding:5px 14px;border-radius:20px;background:rgba(255,255,255,0.2);font-size:12px;font-weight:600;color:#FFFFFF;letter-spacing:1px;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${badge}</div>` : ''}
  </td>
</tr>`;

// Single detail row inside a card
const row = (label, value, isLast = false) => `
<tr>
  <td style="padding:13px 0;${isLast ? '' : 'border-bottom:1px solid #F1F5F9;'}">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td class="row-label" valign="top" style="width:130px;padding-right:16px;font-size:12px;font-weight:500;color:#94A3B8;text-transform:uppercase;letter-spacing:0.8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;white-space:nowrap;">${label}</td>
        <td class="row-value" style="font-size:14px;font-weight:600;color:#0F172A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${value}</td>
      </tr>
    </table>
  </td>
</tr>`;

// CTA button (table-based for Outlook compat)
const ctaButton = (label, color) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:32px auto 0;">
  <tr>
    <td align="center" bgcolor="${color}" style="border-radius:8px;background:${color};">
      <a href="#" class="btn" style="display:inline-block;padding:14px 40px;color:#FFFFFF;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;background:${color};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;letter-spacing:-0.1px;">
        ${label}
      </a>
    </td>
  </tr>
</table>`;

// Section card wrapper
const card = (sectionTitle, inner) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
  <tr>
    <td style="background:#F8FAFC;padding:12px 20px;border-bottom:1px solid #E2E8F0;">
      <span style="font-size:11px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:1.2px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${sectionTitle}</span>
    </td>
  </tr>
  <tr>
    <td style="padding:2px 20px 8px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${inner}
      </table>
    </td>
  </tr>
</table>`;

// Callout box (amber warning, green tip, etc.)
const callout = (bgColor, borderColor, textColor, html) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:24px;">
  <tr>
    <td style="background:${bgColor};border-left:3px solid ${borderColor};border-radius:6px;padding:14px 16px;">
      <p style="margin:0;font-size:13px;color:${textColor};line-height:1.65;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${html}</p>
    </td>
  </tr>
</table>`;

// Footer
const footer = (links) => `
<tr>
  <td class="footer-pad" align="center" style="background:#F8FAFC;padding:28px 40px;border-top:1px solid #E2E8F0;">
    <p style="margin:0 0 12px;font-size:13px;color:#94A3B8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      ${links}
    </p>
    <p style="margin:0;font-size:12px;color:#CBD5E1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
      © 2025 SPYNE Technologies. All rights reserved.
    </p>
  </td>
</tr>`;

// Base HTML document wrapper
const document = (title, bodyContent) => `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  ${css}
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F1F5F9;">
    <tr>
      <td class="outer" align="center" style="padding:40px 16px;">
        <table role="presentation" class="card" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
          ${bodyContent}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ─── 1. OTP Verification ──────────────────────────────────────────────────────

export const otpVerificationTemplate = (name, otp) => {
  const digits = otp.toString().split('').map(d =>
    `<td class="otp-cell" align="center" valign="middle"
         style="width:52px;height:64px;border:2px solid #E2E8F0;border-radius:10px;font-size:30px;font-weight:700;color:#0F172A;font-family:'Courier New',Courier,monospace;background:#FFFFFF;">${d}</td>
     <td class="otp-gap" style="width:8px;"></td>`
  ).join('');

  const body = `
    ${brandBar}
    ${hero('#4F46E5', '🔐', 'Verify your email', 'One quick step — then you\'re all set')}

    <!-- content -->
    <tr>
      <td class="body-pad" style="padding:40px 40px 36px;">

        <p style="margin:0 0 28px;font-size:16px;color:#475569;line-height:1.65;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
          Hi <strong style="color:#0F172A;">${name}</strong> — enter the code below to verify your email address and activate your SPYNE account.
        </p>

        <!-- OTP digits -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px;">
          <tr>
            <td align="center" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:32px 20px;">
              <p style="margin:0 0 20px;font-size:11px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:2px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Verification Code</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>${digits}</tr>
              </table>
              <p style="margin:20px 0 0;font-size:12px;color:#94A3B8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                Expires in <strong style="color:#64748B;">10 minutes</strong>
              </p>
            </td>
          </tr>
        </table>

        ${callout('#FFFBEB', '#F59E0B', '#92400E', '<strong>Security notice:</strong> SPYNE will never ask for this code over the phone or via email. If you didn\'t create an account, you can safely ignore this message.')}

        <p style="margin:0;font-size:13px;color:#94A3B8;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
          Having trouble? Reply to this email or contact <a href="mailto:support@spyne.com" style="color:#4F46E5;text-decoration:none;font-weight:500;">support@spyne.com</a>
        </p>

      </td>
    </tr>

    ${footer(`<a href="#" class="fl" style="color:#4F46E5;text-decoration:none;font-weight:500;margin:0 10px;">Help Center</a>
              <a href="#" class="fl" style="color:#4F46E5;text-decoration:none;font-weight:500;margin:0 10px;">Privacy Policy</a>
              <a href="#" class="fl" style="color:#94A3B8;text-decoration:none;margin:0 10px;">Unsubscribe</a>`)}
  `;

  return document('Verify Your Email – SPYNE', body);
};

// ─── 2. Booking Confirmation ──────────────────────────────────────────────────

export const bookingConfirmationTemplate = (user, car, booking) => {
  const bookingId = `#${booking._id.toString().slice(-8).toUpperCase()}`;
  const days = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000);

  const body = `
    ${brandBar}
    ${hero('#059669', '✅', 'Booking Confirmed!', 'Your rental is all set — see you on the road', bookingId)}

    <tr>
      <td class="body-pad" style="padding:40px 40px 36px;">

        <p style="margin:0 0 28px;font-size:16px;color:#475569;line-height:1.65;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
          Hi <strong style="color:#0F172A;">${user.fname}</strong> — your booking for the <strong style="color:#0F172A;">${car.title}</strong> is confirmed. Here's everything you need for your trip.
        </p>

        <!-- Ticket stub: pick-up / return -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
               style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
          <tr>
            <td class="ticket-l" valign="top" width="50%"
                style="padding:20px 24px;border-right:1px dashed #CBD5E1;background:#FFFFFF;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:1.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Pick-Up</p>
              <p style="margin:0 0 2px;font-size:26px;font-weight:700;color:#0F172A;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${fmtShort(booking.startDate)}</p>
              <p style="margin:0 0 10px;font-size:13px;color:#94A3B8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${fmtYear(booking.startDate)}</p>
              <p style="margin:0;font-size:13px;font-weight:500;color:#475569;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${booking.pickupLocation}</p>
            </td>
            <td class="ticket-r" valign="top" width="50%"
                style="padding:20px 24px;background:#FFFFFF;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:1.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Return</p>
              <p style="margin:0 0 2px;font-size:26px;font-weight:700;color:#0F172A;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${fmtShort(booking.endDate)}</p>
              <p style="margin:0 0 10px;font-size:13px;color:#94A3B8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${fmtYear(booking.endDate)}</p>
              <p style="margin:0;font-size:13px;font-weight:500;color:#475569;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${booking.dropoffLocation}</p>
            </td>
          </tr>
          <!-- Duration bar -->
          <tr>
            <td colspan="2" align="center"
                style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:10px 20px;">
              <span style="font-size:12px;font-weight:600;color:#64748B;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                ${days} day${days !== 1 ? 's' : ''} rental
              </span>
            </td>
          </tr>
        </table>

        <!-- Booking details -->
        ${card('Booking Details',
          row('Vehicle', `${car.title} &mdash; ${car.company}`) +
          row('Booking ID', `<span style="font-family:'Courier New',Courier,monospace;font-size:13px;color:#4F46E5;">${bookingId}</span>`) +
          row('Status', '<span style="display:inline-block;padding:3px 10px;border-radius:12px;background:#DCFCE7;color:#15803D;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">Confirmed</span>') +
          row('Total Paid', `<span style="font-size:18px;font-weight:700;color:#059669;">$${booking.price}</span>`, true)
        )}

        <!-- Reminders -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:24px;">
          <tr>
            <td style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:18px 20px;">
              <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:0.8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Before You Go</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                ${['Bring a valid driver\'s licence and a credit card',
                   'Arrive 15 minutes before your scheduled pick-up',
                   'A vehicle inspection is conducted at pick-up and return',
                   'Return with the same fuel level as at pick-up'].map(tip => `
                <tr>
                  <td valign="top" style="padding:3px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="top" style="padding-right:8px;font-size:13px;color:#92400E;line-height:1.5;">→</td>
                        <td style="font-size:13px;color:#92400E;line-height:1.5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${tip}</td>
                      </tr>
                    </table>
                  </td>
                </tr>`).join('')}
              </table>
            </td>
          </tr>
        </table>

        ${ctaButton('View Booking Details', '#059669')}

        <p style="margin:24px 0 0;font-size:13px;color:#94A3B8;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
          Questions? <a href="mailto:support@spyne.com" style="color:#4F46E5;text-decoration:none;font-weight:500;">support@spyne.com</a> · Available 24 / 7
        </p>

      </td>
    </tr>

    ${footer(`<a href="#" class="fl" style="color:#4F46E5;text-decoration:none;font-weight:500;margin:0 10px;">Manage Booking</a>
              <a href="#" class="fl" style="color:#4F46E5;text-decoration:none;font-weight:500;margin:0 10px;">Help Center</a>
              <a href="#" class="fl" style="color:#4F46E5;text-decoration:none;font-weight:500;margin:0 10px;">Contact Support</a>`)}
  `;

  return document('Booking Confirmed – SPYNE', body);
};

// ─── 3. Booking Cancellation ──────────────────────────────────────────────────

export const bookingCancellationTemplate = (user, car, booking) => {
  const bookingId = `#${booking._id.toString().slice(-8).toUpperCase()}`;

  const body = `
    ${brandBar}
    ${hero('#DC2626', '✕', 'Booking Cancelled', 'Your reservation has been removed', bookingId)}

    <tr>
      <td class="body-pad" style="padding:40px 40px 36px;">

        <p style="margin:0 0 28px;font-size:16px;color:#475569;line-height:1.65;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
          Hi <strong style="color:#0F172A;">${user.fname}</strong> — your booking for the <strong style="color:#0F172A;">${car.title}</strong> has been cancelled. No further action is needed on your part.
        </p>

        <!-- Cancelled booking card -->
        ${card('Cancelled Reservation',
          row('Vehicle', `${car.title} &mdash; ${car.company}`) +
          row('Was Scheduled', `${fmtFull(booking.startDate)} &rarr; ${fmtFull(booking.endDate)}`) +
          row('Booking ID', `<span style="font-family:'Courier New',Courier,monospace;font-size:13px;color:#DC2626;">${bookingId}</span>`) +
          row('Status', '<span style="display:inline-block;padding:3px 10px;border-radius:12px;background:#FEE2E2;color:#991B1B;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">Cancelled</span>', true)
        )}

        ${callout('#EFF6FF', '#3B82F6', '#1E40AF', '<strong>Looking for another car?</strong> Browse our full fleet and find something that works for your schedule. We\'d love to have you back on the road.')}

        ${ctaButton('Browse Available Cars', '#DC2626')}

        <p style="margin:24px 0 0;font-size:13px;color:#94A3B8;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
          Questions about this cancellation? <a href="mailto:support@spyne.com" style="color:#4F46E5;text-decoration:none;font-weight:500;">Contact us</a>
        </p>

      </td>
    </tr>

    ${footer(`<a href="#" class="fl" style="color:#4F46E5;text-decoration:none;font-weight:500;margin:0 10px;">Browse Cars</a>
              <a href="#" class="fl" style="color:#4F46E5;text-decoration:none;font-weight:500;margin:0 10px;">Help Center</a>
              <a href="#" class="fl" style="color:#94A3B8;text-decoration:none;margin:0 10px;">Unsubscribe</a>`)}
  `;

  return document('Booking Cancelled – SPYNE', body);
};

// ─── 4. Booking Completion ────────────────────────────────────────────────────

export const bookingCompletionTemplate = (user, car, booking) => {
  const bookingId = `#${booking._id.toString().slice(-8).toUpperCase()}`;
  const days = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000);

  const body = `
    ${brandBar}
    ${hero('#7C3AED', '🏁', 'Rental Complete!', `Thanks for choosing SPYNE, ${user.fname}`)}

    <tr>
      <td class="body-pad" style="padding:40px 40px 36px;">

        <p style="margin:0 0 28px;font-size:16px;color:#475569;line-height:1.65;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
          Your rental of the <strong style="color:#0F172A;">${car.title}</strong> is now complete. We hope you enjoyed the ride. Here's a summary of your trip.
        </p>

        <!-- Ticket stub: pick-up / return -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
               style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
          <tr>
            <td class="ticket-l" valign="top" width="50%"
                style="padding:20px 24px;border-right:1px dashed #CBD5E1;background:#FFFFFF;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:1.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Picked Up</p>
              <p style="margin:0 0 2px;font-size:26px;font-weight:700;color:#0F172A;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${fmtShort(booking.startDate)}</p>
              <p style="margin:0;font-size:13px;color:#94A3B8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${fmtYear(booking.startDate)}</p>
            </td>
            <td class="ticket-r" valign="top" width="50%"
                style="padding:20px 24px;background:#FFFFFF;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:1.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">Returned</p>
              <p style="margin:0 0 2px;font-size:26px;font-weight:700;color:#0F172A;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${fmtShort(booking.endDate)}</p>
              <p style="margin:0;font-size:13px;color:#94A3B8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">${fmtYear(booking.endDate)}</p>
            </td>
          </tr>
          <tr>
            <td colspan="2" align="center"
                style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:10px 20px;">
              <span style="font-size:12px;font-weight:600;color:#64748B;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                ${days} day${days !== 1 ? 's' : ''} · ${car.title}
              </span>
            </td>
          </tr>
        </table>

        <!-- Receipt summary -->
        ${card('Receipt',
          row('Vehicle', `${car.title} &mdash; ${car.company}`) +
          row('Booking ID', `<span style="font-family:'Courier New',Courier,monospace;font-size:13px;color:#7C3AED;">${bookingId}</span>`) +
          row('Duration', `${days} day${days !== 1 ? 's' : ''}`) +
          row('Status', '<span style="display:inline-block;padding:3px 10px;border-radius:12px;background:#EDE9FE;color:#5B21B6;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">Completed</span>') +
          row('Total Charged', `<span style="font-size:18px;font-weight:700;color:#059669;">$${booking.price}</span>`, true)
        )}

        ${callout('#F0FDF4', '#22C55E', '#15803D', '<strong>Enjoyed your ride?</strong> We\'d love to hear about your experience. Your feedback helps us serve you better on your next trip.')}

        ${ctaButton('Book Your Next Car', '#7C3AED')}

        <p style="margin:24px 0 0;font-size:13px;color:#94A3B8;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
          Concerns about your rental? <a href="mailto:support@spyne.com" style="color:#4F46E5;text-decoration:none;font-weight:500;">support@spyne.com</a>
        </p>

      </td>
    </tr>

    ${footer(`<a href="#" class="fl" style="color:#4F46E5;text-decoration:none;font-weight:500;margin:0 10px;">Book Again</a>
              <a href="#" class="fl" style="color:#4F46E5;text-decoration:none;font-weight:500;margin:0 10px;">Help Center</a>
              <a href="#" class="fl" style="color:#94A3B8;text-decoration:none;margin:0 10px;">Unsubscribe</a>`)}
  `;

  return document('Rental Complete – SPYNE', body);
};
