import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResetCodeEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-mail ou Usuário obrigatório" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ 
      where: { 
        OR: [
          { email: email },
          { name: email }
        ]
      } 
    });

    if (!user) {
      // Por segurança, não indicamos se o e-mail existe ou não
      return NextResponse.json({ success: true });
    }

    // Generate a 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: code,
        resetPasswordExpires: expires,
      },
    });

    if (!user.email) {
      return NextResponse.json({ error: "Usuário sem e-mail cadastrado" }, { status: 400 });
    }
    
    const emailRes = await sendResetCodeEmail(user.email, code);

    if (!emailRes.success) {
      console.error(emailRes.error);
      return NextResponse.json({ error: "Falha ao enviar e-mail. Tente novamente." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
