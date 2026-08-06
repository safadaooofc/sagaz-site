import { Client, GatewayIntentBits, Collection, Invite, AttachmentBuilder } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Armazena cache de invites: Map<GuildID, Map<InviteCode, InviteInfo>>
const invitesCache = new Collection<string, Collection<string, { uses: number, inviterId: string | null }>>();

const REWARD_AMOUNT = 0.05; // 5 centavos
const GUILD_ID = process.env.DISCORD_GUILD_ID || "1531958396826288158";

client.once('ready', async () => {
  console.log(`Bot logado como ${client.user?.tag}`);

  // Faz cache inicial dos invites do servidor configurado
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const invites = await guild.invites.fetch();
    const guildInvites = new Collection<string, { uses: number, inviterId: string | null }>();
    
    invites.forEach(invite => {
      guildInvites.set(invite.code, { uses: invite.uses || 0, inviterId: invite.inviterId });
    });
    
    invitesCache.set(guild.id, guildInvites);
    console.log(`Cache criado: ${guildInvites.size} invites armazenados para o servidor ${guild.name}`);
  } catch (err) {
    console.error("Erro ao fazer cache dos invites:", err);
  }
});

// Atualiza o cache quando um invite for criado
client.on('inviteCreate', invite => {
  if (!invite.guild) return;
  const guildInvites = invitesCache.get(invite.guild.id);
  if (guildInvites) {
    guildInvites.set(invite.code, { uses: invite.uses || 0, inviterId: invite.inviterId });
  }
});

// Atualiza o cache quando um invite for deletado
client.on('inviteDelete', invite => {
  if (!invite.guild) return;
  const guildInvites = invitesCache.get(invite.guild.id);
  if (guildInvites) {
    guildInvites.delete(invite.code);
  }
});

client.on('guildMemberAdd', async member => {
  if (member.guild.id !== GUILD_ID) return;

  const cachedInvites = invitesCache.get(member.guild.id);
  if (!cachedInvites) return;

  try {
    // Busca os invites atuais para comparar
    const newInvites = await member.guild.invites.fetch();
    let usedInviteCode: string | null = null;
    let inviterId: string | null = null;

    // Encontra qual invite teve o número de usos incrementado
    newInvites.forEach(invite => {
      const cachedInvite = cachedInvites.get(invite.code);
      if (cachedInvite && (invite.uses || 0) > cachedInvite.uses) {
        usedInviteCode = invite.code;
        inviterId = invite.inviterId;
      }
      // Atualiza o cache com o novo valor
      cachedInvites.set(invite.code, { uses: invite.uses || 0, inviterId: invite.inviterId });
    });

    if (inviterId) {
      console.log(`Usuário ${member.user.tag} entrou usando o invite de ${inviterId}`);
      await handleReward(inviterId);
    } else {
      console.log(`Usuário ${member.user.tag} entrou, mas não foi possível determinar o invite.`);
    }
  } catch (err) {
    console.error("Erro ao processar guildMemberAdd:", err);
  }
});

async function handleReward(discordId: string) {
  try {
    // Verifica se o usuário tem conta no site
    const user = await prisma.user.findFirst({
      where: { discordId }
    });

    if (user) {
      // Tem conta: adiciona o saldo, balance log e notificação
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: { balance: { increment: REWARD_AMOUNT } }
        });

        await tx.balanceMovement.create({
          data: {
            userId: user.id,
            amount: REWARD_AMOUNT,
            type: "DISCORD_INVITE_REWARD",
            description: "Bônus por convidar um novo membro ao servidor do Discord."
          }
        });

        await tx.notification.create({
          data: {
            userId: user.id,
            title: "Recompensa de Convite do Discord",
            message: `Você ganhou R$ ${REWARD_AMOUNT.toFixed(2).replace('.', ',')} por convidar um novo membro no servidor do Discord! O saldo já foi adicionado à sua carteira.`,
            type: "INVITE_REWARD"
          }
        });
      });
      console.log(`Recompensa de R$ ${REWARD_AMOUNT} enviada para o usuário logado ${user.email}`);

    } else {
      // Não tem conta: salva no pending e avisa na DM
      const pending = await prisma.pendingDiscordReward.upsert({
        where: { discordId },
        update: {
          pendingBalance: { increment: REWARD_AMOUNT },
          invitesCount: { increment: 1 }
        },
        create: {
          discordId,
          pendingBalance: REWARD_AMOUNT,
          invitesCount: 1
        }
      });

      console.log(`Recompensa pendente para ${discordId}: R$ ${pending.pendingBalance}`);

      // Tenta mandar DM
      try {
        const discordUser = await client.users.fetch(discordId);
        if (discordUser) {
          await discordUser.send(
            `🎉 Olá! Você acaba de convidar uma pessoa para o nosso servidor!\n\n` +
            `💸 **Você gerou R$ ${REWARD_AMOUNT.toFixed(2).replace('.', ',')} de saldo!**\n` +
            `Porém, sua conta do Discord não está vinculada no nosso site, então você está perdendo esse dinheiro.\n\n` +
            `💰 **Seu saldo pendente acumulado é de R$ ${pending.pendingBalance.toFixed(2).replace('.', ',')} (${pending.invitesCount} invites)**.\n` +
            `Acesse o site, faça login com o Discord e o saldo será creditado automaticamente na sua carteira!`
          );
        }
      } catch (dmErr) {
        console.error(`Não foi possível enviar DM para ${discordId}. Eles podem ter DMs bloqueadas.`);
      }
    }
  } catch (err) {
    console.error("Erro no handleReward:", err);
  }
}

// Comandos de Administração (!logs, !backup)
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (command === 'logs' || command === 'backup') {
    try {
      // Verificar se o usuário do Discord tem conta e qual é a role dele no site
      const user = await prisma.user.findFirst({
        where: { discordId: message.author.id }
      });

      if (!user || (user.role !== 'OWNER' && user.role !== 'SUPERADMIN')) {
        await message.reply("❌ Você não tem permissão de Administrador no site para executar este comando.");
        return;
      }

      if (command === 'logs') {
        const logsMessage = await message.reply("⏳ Buscando logs...");
        const logs = await prisma.adminLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: 20,
          include: { admin: { select: { name: true } } }
        });

        if (logs.length === 0) {
          await logsMessage.edit("Nenhum log encontrado na plataforma.");
          return;
        }

        let logsText = "**Últimos 20 Logs de Administração**\n```\n";
        logs.forEach(log => {
          const date = log.createdAt.toLocaleString('pt-BR');
          logsText += `[${date}] ${log.admin.name} (${log.action}): ${log.details}\n`;
        });
        logsText += "```";

        try {
          await message.author.send(logsText);
          await logsMessage.edit("✅ Logs enviados para a sua DM com segurança!");
        } catch (e) {
          await logsMessage.edit("❌ Não consegui enviar na sua DM. Você a bloqueou?\n" + logsText);
        }
      }

      if (command === 'backup') {
        const backupMessage = await message.reply("📦 Gerando dump da base de dados. Aguarde...");
        
        // Puxa as tabelas vitais
        const [users, transactions, ccProducts, loginProducts, adminLogs] = await Promise.all([
          prisma.user.findMany(),
          prisma.transaction.findMany(),
          prisma.cCProduct.findMany(),
          prisma.loginProduct.findMany(),
          prisma.adminLog.findMany()
        ]);

        const backupData = {
          date: new Date().toISOString(),
          users,
          transactions,
          ccProducts,
          loginProducts,
          adminLogs
        };

        const jsonBuffer = Buffer.from(JSON.stringify(backupData, null, 2), 'utf-8');
        const attachment = new AttachmentBuilder(jsonBuffer, { name: `sagaz_backup_${Date.now()}.json` });

        try {
          await message.author.send({
            content: "⚠️ **BACKUP DO BANCO DE DADOS**\nEste arquivo contém dados sensíveis. Mantenha em segurança.",
            files: [attachment]
          });
          await backupMessage.edit("✅ Backup gerado e enviado na sua DM com sucesso!");
        } catch (e) {
          await backupMessage.edit("❌ Não consegui enviar na sua DM. Por segurança, o backup não será enviado aqui no canal aberto.");
        }
      }

    } catch (err) {
      console.error(err);
      await message.reply("Ocorreu um erro ao executar o comando.");
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
