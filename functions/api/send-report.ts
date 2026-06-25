export async function onRequestPost(context: any) {
  const { request, env } = context;

  try {
    const { answers, score, pdfUrl } = await request.json();

    if (!answers || !answers.email) {
      return new Response(JSON.stringify({ error: 'Missing required report or recipient details.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }

    const brevoApiKey = env.BREVO_API_KEY;
    const brevoListId = parseInt(env.BREVO_LIST_ID || '2', 10);
    const senderEmail = env.BREVO_SENDER_EMAIL || 'olayemisegunsolomon@gmail.com';
    const senderName = env.BREVO_SENDER_NAME || 'Olayemi (Page Profit)';
    
    const siteUrl = env.APP_URL || 'https://pageprofitaccelerator.com';
    const finalPdfUrl = pdfUrl ? `${siteUrl}${pdfUrl}` : `${siteUrl}/checklist.pdf`;
    const bookingUrl = env.VITE_CAL_COM_LINK || `${siteUrl}?book=true`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your Page Profit Scorecard</title>
        <style>
          body {
            background-color: #08080a;
            color: #e4e4e7;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #0b0b0c;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            overflow: hidden;
            margin-top: 40px;
            margin-bottom: 40px;
          }
          .header {
            background-color: #000000;
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }
          .badge {
            display: inline-block;
            font-family: monospace;
            font-size: 10px;
            color: #00ff66;
            border: 1px solid rgba(0, 255, 102, 0.2);
            background-color: rgba(0, 255, 102, 0.05);
            padding: 4px 10px;
            border-radius: 4px;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 14px;
          }
          .title {
            font-size: 26px;
            color: #ffffff;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin: 0;
            text-transform: uppercase;
          }
          .score-box {
            text-align: center;
            background: linear-gradient(180deg, #101012 0%, #000000 100%);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 30px;
            margin: 30px;
          }
          .score-number {
            font-size: 64px;
            font-weight: 900;
            color: #00ff66;
            margin: 0;
            line-height: 1;
          }
          .score-label {
            font-size: 12px;
            color: #a1a1aa;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 10px;
          }
          .body-content {
            padding: 30px;
            font-size: 14px;
            line-height: 1.6;
            color: #a1a1aa;
          }
          .body-content h3 {
            color: #ffffff;
            font-size: 16px;
            margin-top: 24px;
            margin-bottom: 12px;
          }
          .info-grid {
            background-color: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
            font-size: 13px;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-key {
            color: #71717a;
          }
          .info-val {
            color: #ffffff;
            font-weight: bold;
          }
          .btn-wrapper {
            text-align: center;
            margin-top: 30px;
            margin-bottom: 30px;
          }
          .btn-primary {
            display: inline-block;
            background-color: #00ff66;
            color: #09090b !important;
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
            padding: 14px 28px;
            border-radius: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 15px rgba(0, 255, 102, 0.2);
          }
          .btn-secondary {
            display: inline-block;
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
            padding: 12px 24px;
            border-radius: 8px;
            margin-top: 10px;
            text-transform: uppercase;
          }
          .footer {
            background-color: #000000;
            padding: 20px;
            text-align: center;
            font-size: 11px;
            color: #52525b;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }
        </style>
      </head>
      <body>
        <!-- Preheader (Inbox Preview Text) -->
        <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
          Here is your custom conversion scorecard and your Master Checklist PDF guide. Open to review your findings.
        </div>

        <div class="container">
          <div class="header">
            <div class="badge">Diagnostic Complete</div>
            <div style="margin-top: 10px;">
              <img src="https://48129849.fs1.hubspotusercontent-na1.net/hubfs/48129849/Page%20Profit%20Accelerator/logo.webp" alt="Page Profit Accelerator" style="max-height: 40px; border: none; display: inline-block;">
            </div>
          </div>

          <div class="score-box">
            <p class="score-number">${score}/100</p>
            <p class="score-label">Your Conversion Optimization Score</p>
          </div>

          <div class="body-content">
            <p>Hi <strong>${answers.fullName}</strong>,</p>
            <p>Thank you for completing your <strong>Page Profit Diagnostic Assessment</strong>. Based on the 42 custom performance metrics we analyzed for your store, your conversion setup has been scored.</p>
            
            <p>We've compiled your responses and potential leaks. You can instantly download your Master Checklist PDF and review your benchmark insights:</p>

            <div class="info-grid">
              <div class="info-row">
                <span class="info-key">Full Name:</span>
                <span class="info-val">${answers.fullName}</span>
              </div>
              <div class="info-row">
                <span class="info-key">Work Email:</span>
                <span class="info-val">${answers.email}</span>
              </div>
              <div class="info-row">
                <span class="info-key">WhatsApp Number:</span>
                <span class="info-val">${answers.whatsapp}</span>
              </div>
              <div class="info-row">
                <span class="info-key">Declared Monthly Revenue:</span>
                <span class="info-val">${answers.monthlyRevenue}</span>
              </div>
            </div>

            <h3>Your Dynamic Leak Report Findings:</h3>
            <ul>
              <li>Mobile Load Speed Corrected: <strong>${answers.mobileLoadSpeed}</strong></li>
              <li>Guest Checkout Bypass Enabled: <strong>${answers.guestCheckout}</strong></li>
              <li>Omnichannel Purchase Flow Enabled: <strong>${answers.postPurchaseFlow}</strong></li>
              <li>Dynamic Customer Heatmaps Tracked: <strong>${answers.heatmapsUsed}</strong></li>
            </ul>

            <div class="btn-wrapper">
              <div style="text-align: center; margin-bottom: 24px;">
                <img src="https://48129849.fs1.hubspotusercontent-na1.net/hubfs/48129849/Page%20Profit%20Accelerator/checklist-cover.png.webp" alt="Page Profit Accelerator Book Cover" style="max-width: 160px; border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); border: none;">
              </div>
              <a href="${finalPdfUrl}" class="btn-primary" target="_blank">Download Master Checklist PDF</a>
              <br/>
              <p style="font-size: 12px; margin-top: 24px; color: #71717a;">Ready to plug the leaks and boost conversions? Schedule your 1-on-1 walkthrough.</p>
              <a href="${bookingUrl}" class="btn-secondary" target="_blank">Access Live Booking Calendar</a>
            </div>

            <p>Best regards,<br/><strong>Olayemi Segun Solomon</strong><br/><span style="font-size: 12px; color: #71717a;">Page Profit Acceleration Team</span></p>
          </div>

          <div class="footer">
            <p>© 2026 Page Profit Accelerator. All Rights Reserved.</p>
            <p>This report contains private digital assessment details prepared exclusively for ${answers.email}.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Fallback if Brevo API key is not configured
    if (!brevoApiKey || brevoApiKey === 'MY_BREVO_API_KEY') {
      return new Response(JSON.stringify({ 
        success: true, 
        simulated: true, 
        message: 'Lead processed successfully in simulation (Brevo API key not set).' 
      }), {
        headers: { 'content-type': 'application/json' }
      });
    }

    let listAdditionSuccess = false;
    let listAdditionError = null;

    // 1. Sync Contact in Brevo
    try {
      let contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          email: answers.email,
          attributes: {
            FIRSTNAME: answers.fullName,
            SMS: answers.whatsapp,
            WHATSAPP: answers.whatsapp,
            SCORE: score,
            REVENUE: answers.monthlyRevenue
          },
          listIds: [brevoListId],
          updateEnabled: true
        })
      });

      if (!contactResponse.ok) {
        // Fallback with standard attributes only
        contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': brevoApiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email: answers.email,
            attributes: {
              FIRSTNAME: answers.fullName,
              SMS: answers.whatsapp
            },
            listIds: [brevoListId],
            updateEnabled: true
          })
        });
      }

      if (contactResponse.ok) {
        listAdditionSuccess = true;
      } else {
        listAdditionError = await contactResponse.text();
      }
    } catch (err: any) {
      listAdditionError = err.message;
    }

    // 2. Send email via Brevo SMTP API
    let emailSentSuccess = false;
    let emailSentError = null;
    let messageId = null;

    try {
      const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail
          },
          to: [
            {
              email: answers.email,
              name: answers.fullName
            }
          ],
          subject: `[SCORE: ${score}/100] Your Page Profit Accelerator Report + Checklist Guide`,
          htmlContent: emailHtml
        })
      });

      if (emailResponse.ok) {
        const data: any = await emailResponse.json();
        emailSentSuccess = true;
        messageId = data.messageId;
      } else {
        emailSentError = await emailResponse.text();
      }
    } catch (err: any) {
      emailSentError = err.message;
    }

    if (listAdditionSuccess || emailSentSuccess) {
      return new Response(JSON.stringify({
        success: true,
        listAdded: listAdditionSuccess,
        emailSent: emailSentSuccess,
        messageId,
        warnings: emailSentError ? { emailError: emailSentError } : undefined
      }), {
        headers: { 'content-type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        error: 'Failed to process lead in Brevo.',
        details: {
          listError: listAdditionError,
          emailError: emailSentError
        }
      }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}
