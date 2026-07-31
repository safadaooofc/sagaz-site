"use server";

import { prisma } from "@/lib/prisma";

export async function getAnalyticsData() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: 'desc' },
    take: 100,
    include: { product: true }
  });

  const recharges = await prisma.recharge.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Agrupando Vendas Diárias (Últimos 7 dias)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const salesData = last7Days.map(date => {
    const daySales = transactions.filter(t => t.date.toISOString().startsWith(date));
    return {
      name: date.split('-').slice(1).join('/'),
      vendas: daySales.length,
      receita: daySales.reduce((acc, curr) => acc + curr.total, 0)
    };
  });

  // Top Produtos
  const productCount: Record<string, number> = {};
  transactions.forEach(t => {
    if (t.product) {
      productCount[t.product.name] = (productCount[t.product.name] || 0) + 1;
    }
  });
  const topProducts = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, value: count }));

  // Discord Mock (Bot token requires external fetch)
  let discordMembers = 0;
  let discordTickets = 0;
  try {
    if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_GUILD_ID) {
      const res = await fetch(`https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}?with_counts=true`, {
        headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
        next: { revalidate: 300 }
      });
      if (res.ok) {
        const data = await res.json();
        discordMembers = data.approximate_member_count || 0;
      }
    }
  } catch (e) {
    console.error("Discord API fetch error", e);
  }

  return {
    salesData,
    topProducts,
    totalRevenue: transactions.reduce((acc, curr) => acc + curr.total, 0),
    totalUsers: users.length,
    discordMembers,
    discordTickets: Math.floor(Math.random() * 10), // Mock for tickets
    activeSessions: await prisma.deviceSession.count()
  };
}
