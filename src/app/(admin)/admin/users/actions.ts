"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { logAdminAction } from "@/lib/adminLogger";

export async function createAdminLogin(adminUserId: string, name: string) {
  try {
    const password = Math.random().toString(36).slice(-8); // generate random password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if name exists
    const existing = await prisma.user.findFirst({ where: { name } });
    if (existing) return { success: false, error: "Nome de usuário já existe" };

    const newUser = await prisma.user.create({
      data: {
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '')}@admin.local`,
        password: hashedPassword,
        role: "ADMIN",
        adminStatus: "OFFLINE"
      }
    });

    await logAdminAction(adminUserId, "Criou novo Admin", `Admin: ${name}`);
    revalidatePath("/admin/users");
    
    return { success: true, password };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(adminUserId: string, targetUserId: string, newRole: string) {
  try {
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) return { success: false, error: "Usuário não encontrado" };

    await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole }
    });

    await logAdminAction(adminUserId, "Alterou cargo de usuário", `Usuário: ${targetUser.name || targetUser.email} -> ${newRole}`);
    revalidatePath("/admin/users");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
