"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkRateLimit } from "@/lib/rateLimit";
import { headers } from "next/headers";
import { sendResetCodeEmail } from "@/lib/mail";

export async function sendPasswordResetOtp(email: string) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
    const rl = await checkRateLimit(`reset_${ip}`, 3, 60000);
    
    if (!rl.success) {
      return { error: "Muitas requisições. Tente novamente mais tarde." };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`\n\n[AVISO] Tentativa de recuperação de senha para e-mail inexistente: ${email}. Retornando sucesso falso por segurança.\n\n`);
      // Retorna sucesso fake para evitar enumeração de e-mails
      return { success: true };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    await prisma.otpCode.deleteMany({ where: { email } });
    await prisma.otpCode.create({
      data: { email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
    });

    console.log(`\n\n[RECOVERY CODE GERADO] Email: ${email} | Código: ${code}\n\n`);

    const emailRes = await sendResetCodeEmail(email, code);
    if (!emailRes.success) {
      console.error(emailRes.error);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in sendPasswordResetOtp:", error);
    return { error: "Erro interno ao processar sua solicitação." };
  }
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
