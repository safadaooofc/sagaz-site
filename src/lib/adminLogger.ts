import { prisma } from "./prisma";

export async function logAdminAction(userId: string, action: string, details?: string, ip?: string) {
  try {
    // 1. Salvar no banco
    const log = await prisma.adminLog.create({
      data: {
        userId,
        action,
        details,
        ip
      },
      include: {
        user: { select: { name: true, email: true, discordId: true, role: true } }
      }
    });

    // 2. Enviar pro Discord Webhook (Se configurado)
    const webhookUrl = process.env.DISCORD_LOG_WEBHOOK_URL;
    if (webhookUrl) {
      const embed = {
        title: "🛡️ Novo Log Administrativo",
        color: 0x00ff00, // verde
        fields: [
          { name: "Admin", value: `${log.user.name} (${log.user.email})`, inline: true },
          { name: "Cargo", value: log.user.role, inline: true },
          { name: "Ação", value: action, inline: false },
        ],
        timestamp: new Date().toISOString(),
      };

      if (details) {
        embed.fields.push({ name: "Detalhes", value: details, inline: false });
      }

      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] })
      }).catch(err => console.error("Erro ao enviar webhook do admin:", err));
    }

    return log;
  } catch (error) {
    console.error("Falha ao registrar log admin:", error);
  }
}
