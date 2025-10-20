import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message } = body;

    // Validación básica
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Configuración de Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Server configuration incomplete' },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    // Enviar email usando Resend
    const emailResponse = await resend.emails.send({
      from: `Portfolio Contact <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: [process.env.CONTACT_EMAIL || 'tu@email.com'],
      replyTo: email,
      subject: `New contact message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3545d4; border-bottom: 2px solid #3545d4; padding-bottom: 10px;">
            New Contact Message
          </h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border-left: 4px solid #3545d4; border: 1px solid #e9ecef;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background-color: #e7f3ff; border-radius: 8px;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              <strong>To reply:</strong> You can reply directly to this email, 
              it will be sent to: <a href="mailto:${email}" style="color: #3545d4;">${email}</a>
            </p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px; text-align: center;">
            This message was sent from your portfolio website on ${new Date().toLocaleString('en-US')}
          </p>
        </div>
      `
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', emailResponse.data);

    return NextResponse.json(
      { 
        message: 'Message sent successfully',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}