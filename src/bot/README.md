# Sagaz Discord Bot 🤖

O Sagaz Site possui um "Trabalhador Assíncrono" focado no ecossistema do Discord.
Este bot é escrito usando `discord.js (v14)` e é inicializado paralelamente à API web principal.

## Como Funciona

### 1. Convites e Recompensas
O bot implementa uma mecânica completa de recompensa de indicações que ocorrem exclusivamente pelo Discord, e as espelha para o Banco de Dados do site (o saldo cai em Reais R$ para o usuário sacar ou usar na loja):

- O Bot escuta o evento `guildMemberAdd` (alguém entrou no Discord).
- O Bot varre o evento para descobrir através de qual código de convite a pessoa entrou.
- Encontra o dono daquele convite e pesquisa o ID dele no banco de dados Prisma (tabela `User.discordId`).
- Se o usuário do Discord já estiver vinculado no Site (logou pelo Discord no site), ele gera uma notificação e injeta o saldo diretamente nele.
- Se o usuário do Discord *ainda não vinculou* sua conta no site, o bot insere esse saldo pendente em uma tabela secundária `PendingDiscordReward`.
- Quando o usuário final fizer o login pelo site pela primeira vez usando o Discord OAuth2 (ver `/src/app/api`), o NextAuth fará uma varredura nas recompensas pendentes e as creditará automaticamente (Recompensa Retroativa).

### 2. Contato por Mensagem Privada (DM)
Quando o saldo é creditado ou fica pendente, o Bot tenta enviar uma mensagem privada com detalhes do sucesso. Se o usuário tiver as DMs bloqueadas nas opções de privacidade, o bot apenas loga a falha sem quebrar o código principal.

### 3. Integração com Banco de Dados
Diferente de sistemas legados de bot onde existe um banco sqlite separado, este bot compartilha o MESMO prisma client (`@/lib/prisma`) que o Next.js, escrevendo no mesmo banco PostgreSQL. Qualquer alteração em `schema.prisma` beneficia imediatamente o bot e o site simultaneamente.

## Como Iniciar Manualmente

Em desenvolvimento (local), você pode rodar um script independente para testar apenas o bot sem levantar o site web:
```bash
npx ts-node src/bot/index.ts
```
*(Não se esqueça de preencher as variáveis do `.env` referentes ao `DISCORD_BOT_TOKEN`, caso contrário a inicialização falhará).*
