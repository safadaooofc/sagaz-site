import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { checkRateLimit } from '@/lib/rateLimit';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Rate limit: 3 requests per minute per IP
    const rl = await checkRateLimit(`otp_req_${ip}`, 3, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: "Muitas requisições. Tente novamente mais tarde." }, { status: 429 });
    }

    const body = await req.json();
    const { name, email, password, isRegister } = body;

    // Backend Validations
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: "E-mail ou Usuário é obrigatório" }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (isRegister && !emailRegex.test(email)) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: "Senha é obrigatória" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 });
    }

    let actualEmail = email;

    if (isRegister) {
      if (name) {
        const nameExists = await prisma.user.findFirst({ where: { name } });
        if (nameExists) {
          return NextResponse.json({ error: "Este nome de usuário já está em uso" }, { status: 400 });
        }
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "Este e-mail já está em uso" }, { status: 400 });
      }
    } else {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email },
            { name: email }
          ]
        }
      });
      if (!user || !user.password || !user.email) {
        return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
      }
      actualEmail = user.email; // Use the real email for sending OTP
      if (!user || !user.password) {
        return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
      }

      if (user.twoFactorMethod === "NONE") {
        return NextResponse.json({ success: true, requires2FA: false });
      }

      if (user.twoFactorMethod === "APP") {
        return NextResponse.json({ success: true, requires2FA: true, method: "APP" });
      }
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Clear old codes and save new one
    await prisma.otpCode.deleteMany({ where: { email: actualEmail } });
    await prisma.otpCode.create({
      data: { email: actualEmail, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
    });

    // Send email using Resend with a premium dark-mode HTML template
    const emailHtml = `
      <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #0f1115; color: #ffffff; padding: 40px 20px; text-align: center; border-radius: 8px;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #181a20; padding: 40px; border-radius: 12px; border: 1px solid #262933;">
          <h1 style="color: #ffffff; font-size: 28px; margin-bottom: 8px; letter-spacing: -1px;">KNIGHT</h1>
          <p style="color: #9ca3af; font-size: 16px; margin-bottom: 32px;">Código de Verificação de Segurança</p>
          
          <div style="background-color: #0f1115; border: 1px solid #262933; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
            <p style="color: #9ca3af; font-size: 14px; margin-bottom: 12px; margin-top: 0;">Seu código de acesso é:</p>
            <h2 style="color: #eab308; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h2>
          </div>
          
          <p style="color: #6b7280; font-size: 13px; margin-bottom: 8px;">Este código expira em 10 minutos.</p>
          <p style="color: #6b7280; font-size: 13px; margin-bottom: 0;">Se você não solicitou este acesso, por favor ignore este e-mail.</p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'KNIGHT <onboarding@resend.dev>', // Change onboarding@resend.dev to your verified domain later
      to: [actualEmail],
      subject: `Seu código de verificação é ${code}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error: "Erro ao enviar e-mail" }, { status: 500 });
    }

    return NextResponse.json({ success: true, requires2FA: true, method: "EMAIL", message: "Código enviado" });

  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
