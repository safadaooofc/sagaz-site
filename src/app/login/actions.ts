"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rateLimit";
import { headers } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetOtp(email: string) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
  const rl = await checkRateLimit(`reset_${ip}`, 3, 60000);
  
  if (!rl.success) {
    return { error: "Muitas requisições. Tente novamente mais tarde." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Retorna sucesso fake para evitar enumeração de e-mails
    return { success: true };
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  await prisma.otpCode.deleteMany({ where: { email } });
  await prisma.otpCode.create({
    data: { email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
  });

  const emailHtml = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #0f1115; color: #ffffff; padding: 40px 20px; text-align: center; border-radius: 8px;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #181a20; padding: 40px; border-radius: 12px; border: 1px solid #262933;">
        <h1 style="color: #ffffff; font-size: 28px; margin-bottom: 8px; letter-spacing: -1px;">KNIGHT</h1>
        <p style="color: #9ca3af; font-size: 16px; margin-bottom: 32px;">Recuperação de Senha</p>
        
        <div style="background-color: #0f1115; border: 1px solid #262933; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
          <p style="color: #9ca3af; font-size: 14px; margin-bottom: 12px; margin-top: 0;">Seu código para redefinir a senha é:</p>
          <h2 style="color: #eab308; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h2>
        </div>
        
        <p style="color: #6b7280; font-size: 13px; margin-bottom: 8px;">Este código expira em 10 minutos.</p>
        <p style="color: #6b7280; font-size: 13px; margin-bottom: 0;">Se você não solicitou a troca de senha, sua conta está segura. Ignore este e-mail.</p>
      </div>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: 'KNIGHT <onboarding@resend.dev>',
    to: [email],
    subject: `Recuperação de Senha - ${code}`,
    html: emailHtml,
  });

  if (error) {
    return { error: "Erro ao enviar e-mail. Tente novamente." };
  }

  return { success: true };
}

export async function resetPasswordWithOtp(email: string, code: string, newPassword: string) {
  if (newPassword.length < 6) {
    return { error: "A nova senha deve ter no mínimo 6 caracteres." };
  }

  const otpRecord = await prisma.otpCode.findFirst({
    where: { email, code }
  });

  if (!otpRecord) {
    return { error: "Código inválido ou incorreto." };
  }

  if (otpRecord.expiresAt < new Date()) {
    return { error: "Este código expirou. Solicite um novo." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });

  await prisma.otpCode.deleteMany({ where: { email } });

  return { success: true };
}
