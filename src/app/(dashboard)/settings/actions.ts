"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function generateReferralCode() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  const code = "KNIGHT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  await prisma.user.update({
    where: { id: session.user.id },
    data: { referralCode: code }
  });

  revalidatePath("/settings");
  return { success: true, code };
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  
  if (!user?.password) return { error: "Você logou com Discord. Não possui senha." };

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return { error: "Senha atual incorreta." };

  const hashed = await bcrypt.hash(newPassword, 10);
  
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed }
  });

  return { success: true };
}

export async function logoutOtherDevices() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Não autorizado" };

  // Incrementa a versão do token. O layout vai ler isso e deslogar os tokens antigos.
  await prisma.user.update({
    where: { id: session.user.id },
    data: { tokenVersion: { increment: 1 } }
  });

  // Apaga o histórico local do DB (limpa a lista visual)
  await prisma.deviceSession.deleteMany({
    where: { userId: session.user.id }
  });

  return { success: true };
}

export async function linkDiscord() {
  await auth(); 
  const { signIn } = await import("@/auth");
  await signIn("discord");
}

export async function sendDiscordVerificationCode(discordId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  // Mock implementation for Discord DM sending
  console.log(`[Mock] Sending verification code to Discord ID: ${discordId}`);
  return { success: true };
}

export async function verifyDiscordCode(discordId: string, code: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  // Mock implementation: Accept any code length 6 or more
  if (code.length < 6) return { success: false, error: "Código inválido" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { discordId }
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function checkBooster() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { discordId: true } });
  if (!user?.discordId) return { success: false, error: "Discord não vinculado" };

  // Mock implementation: randomly assign booster status or just succeed
  return { success: true };
}
