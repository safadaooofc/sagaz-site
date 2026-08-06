"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateSecret, generateURI, verifySync } from "otplib";
import qrcode from "qrcode";
import bcrypt from "bcryptjs";

export async function generate2FASecret() {
  const session = await auth();
  if (!session?.user?.email) return { error: "Não autorizado" };

  const secret = generateSecret();
  const otpauth = generateURI({ secret, issuer: "SAGAZzz", label: session.user.email });
  
  const qrCodeDataUrl = await qrcode.toDataURL(otpauth);
  
  return { success: true, secret, qrCodeDataUrl };
}

export async function verifyAndEnableApp2FA(secret: string, code: string, passwordConfirm: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.password) return { error: "Usuário inválido" };

  // Verifica a senha para confirmar a ação de segurança
  const isValidPass = await bcrypt.compare(passwordConfirm, user.password);
  if (!isValidPass) return { error: "Senha atual incorreta." };

  const { valid } = verifySync({ token: code, secret });
  if (!valid) return { error: "Código Authenticator inválido." };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      twoFactorMethod: "APP",
      twoFactorSecret: secret
    }
  });

  return { success: true };
}

export async function change2FAMethod(method: "NONE" | "EMAIL", passwordConfirm: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.password) return { error: "Usuário inválido" };

  const isValidPass = await bcrypt.compare(passwordConfirm, user.password);
  if (!isValidPass) return { error: "Senha atual incorreta." };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      twoFactorMethod: method,
      twoFactorSecret: null // Se não é APP, apaga o secret
    }
  });

  return { success: true };
}
