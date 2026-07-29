import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Rate limit: 3 requests per minute per IP
    const rl = await checkRateLimit(`otp_req_${ip}`, 3, 60000);
    if (!rl.success) {
      return NextResponse.json({ error: "Muitas requisições. Tente novamente mais tarde." }, { status: 429 });
    }

    const body = await req.json();
    const { email, password, isRegister } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "E-mail e senha são obrigatórios" }, { status: 400 });
    }

    if (isRegister) {
      // Check if user already exists
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "Este e-mail já está em uso" }, { status: 400 });
      }
    } else {
      // Login mode
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) {
        return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
      }
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Clear old codes for this email
    await prisma.otpCode.deleteMany({ where: { email } });

    // Save new code (valid for 10 minutes)
    await prisma.otpCode.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      }
    });

    // MOCK EMAIL SENDING
    console.log(`\n\n=========================================`);
    console.log(`📧 E-MAIL ENVIADO PARA: ${email}`);
    console.log(`🔑 CÓDIGO OTP: ${code}`);
    console.log(`=========================================\n\n`);

    return NextResponse.json({ success: true, message: "Código enviado" });

  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
