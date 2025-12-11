import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  user_id?: string | null;
}

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

Deno.serve(async (req: Request) => {
  console.log('=== send_contact_email Edge Function called ===');
  
  try {
    // Parse request body
    const submission: ContactSubmission = await req.json();
    console.log('Received submission:', JSON.stringify(submission, null, 2));

    // Validate required fields
    if (!submission.name || !submission.email || !submission.subject || !submission.message) {
      console.error('Validation failed: Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Email configuration
    const ADMIN_EMAIL = 'vinod826870@gmail.com';
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    console.log('Admin email:', ADMIN_EMAIL);
    console.log('API key configured:', RESEND_API_KEY ? 'YES' : 'NO');
    console.log('API key length:', RESEND_API_KEY?.length || 0);

    // Create email HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #2E86DE 0%, #1e5fa8 100%);
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border: 1px solid #e0e0e0;
              border-top: none;
              border-radius: 0 0 8px 8px;
            }
            .field {
              margin-bottom: 20px;
            }
            .label {
              font-weight: bold;
              color: #2E86DE;
              margin-bottom: 5px;
            }
            .value {
              background: white;
              padding: 10px;
              border-radius: 4px;
              border: 1px solid #e0e0e0;
            }
            .message-box {
              background: white;
              padding: 15px;
              border-radius: 4px;
              border: 1px solid #e0e0e0;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">🏥 MediCare Contact Form</h1>
            <p style="margin: 5px 0 0 0;">New Contact Submission</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Name:</div>
              <div class="value">${submission.name}</div>
            </div>
            
            <div class="field">
              <div class="label">📧 Email:</div>
              <div class="value"><a href="mailto:${submission.email}">${submission.email}</a></div>
            </div>
            
            <div class="field">
              <div class="label">📝 Subject:</div>
              <div class="value">${submission.subject}</div>
            </div>
            
            <div class="field">
              <div class="label">💬 Message:</div>
              <div class="message-box">${submission.message}</div>
            </div>
            
            ${submission.user_id ? `
            <div class="field">
              <div class="label">🔑 User ID:</div>
              <div class="value">${submission.user_id}</div>
            </div>
            ` : ''}
            
            <div class="footer">
              <p>This email was sent from the MediCare Online Pharmacy contact form.</p>
              <p>Submitted on ${new Date().toLocaleString('en-US', { 
                dateStyle: 'full', 
                timeStyle: 'long' 
              })}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // If Resend API key is available, send email via Resend
    if (RESEND_API_KEY) {
      console.log('Attempting to send email via Resend API...');
      
      const emailRequest: EmailRequest = {
        to: ADMIN_EMAIL,
        subject: `[MediCare Contact] ${submission.subject}`,
        html: emailHtml
      };

      const resendPayload = {
        from: 'MediCare <onboarding@resend.dev>',
        to: emailRequest.to,
        subject: emailRequest.subject,
        html: emailRequest.html,
        reply_to: submission.email
      };
      
      console.log('Resend payload:', JSON.stringify({
        from: resendPayload.from,
        to: resendPayload.to,
        subject: resendPayload.subject,
        reply_to: resendPayload.reply_to
      }));

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resendPayload)
      });

      console.log('Resend API response status:', resendResponse.status);

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        console.error('Resend API error response:', errorText);
        throw new Error(`Failed to send email: ${errorText}`);
      }

      const resendData = await resendResponse.json();
      console.log('Email sent successfully via Resend:', resendData);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email sent successfully',
          emailId: resendData.id
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // If no API key, log the email content (for development/testing)
      console.warn('⚠️ RESEND_API_KEY not configured - email will not be sent');
      console.log('=== EMAIL NOTIFICATION (NOT SENT) ===');
      console.log('To:', ADMIN_EMAIL);
      console.log('Subject:', `[MediCare Contact] ${submission.subject}`);
      console.log('From:', submission.email);
      console.log('Name:', submission.name);
      console.log('Message:', submission.message);
      console.log('====================================');

      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Email logged (no API key configured)',
          note: 'Configure RESEND_API_KEY to send actual emails'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in send_contact_email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
