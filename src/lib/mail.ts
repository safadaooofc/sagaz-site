import nodemailer from "nodemailer";

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendResetCodeEmail(email: string, code: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials not configured. Code is:", code);
    // Para fins de teste enquanto as credenciais não estiverem configuradas
    return { success: true, simulated: true };
  }

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
      <div style="padding: 30px; text-align: center; background-color: #1e1b4b; border-bottom: 2px solid #3b82f6;">
        <h1 style="margin: 0; color: #60a5fa; font-size: 24px;">Recuperação de Senha</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; line-height: 1.5; color: #94a3b8;">
          Você solicitou a recuperação da sua senha. Utilize o código de 6 dígitos abaixo para redefinir o seu acesso.
        </p>
        <div style="margin: 30px 0; padding: 20px; background-color: #1e293b; border-radius: 8px; text-align: center;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #eab308; font-family: monospace;">
            ${code}
          </span>
        </div>
        <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
          * Este código expira em 15 minutos. Se você não solicitou esta alteração, ignore este e-mail.
        </p>
      </div>
      <div style="padding: 20px; text-align: center; background-color: #020617; font-size: 12px; color: #475569;">
        © ${new Date().getFullYear()} SAGAZzz. Todos os direitos reservados.
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"SAGAZzz Suporte" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Seu código de recuperação de senha - SAGAZzz",
      html: htmlTemplate,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: "Falha ao enviar e-mail." };
  }
}
