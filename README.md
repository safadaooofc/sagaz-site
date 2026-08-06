# Sagaz Site 🚀

Bem-vindo ao **Sagaz Site**, a plataforma completa de vendas de cartões digitais, logins, recargas de saldo via PIX, e recompensas interativas. O sistema é construído sobre as fundações modernas da Web e conta com um Bot de Discord integrado para recompensas automatizadas e administração.

## 🛠 Tech Stack

- **Framework Web**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Linguagem Principal**: TypeScript
- **Estilização**: Tailwind CSS v4 & Tailwind UI (Design system customizado)
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma (v7 / Prisma Client)
- **Autenticação**: NextAuth.js (v5) + JWT + Discord OAuth2
- **Criptografia**: BcryptJS
- **Integração Bot**: discord.js (v14)
- **Email/Notificações**: Resend

## 📁 Estrutura de Documentação Interna

A documentação detalhada foi dividida por diretórios para facilitar a navegação. Acesse cada link para entender a arquitetura a fundo:

1. **[Segurança e Arquitetura](./docs/SECURITY_AND_ARCHITECTURE.md)**: Rate limits, níveis de acesso (RBAC), e protocolos de cibersegurança do site.
2. **[Deploy na Discloud](./docs/DISCLOUD_DEPLOY.md)**: Como fazer o host do Next.js e Bot do Discord.
3. **[Frontend e Rotas (`/src/app`)](./src/app/README.md)**: Organização do layout, páginas públicas, dashboard de usuários e painel administrativo.
4. **[Backend e API (`/src/app/api`)](./src/app/api/README.md)**: Contrato das rotas REST e Webhooks.
5. **[Bot do Discord (`/src/bot`)](./src/bot/README.md)**: Comandos, eventos e integração com o banco de dados.
6. **[Utilitários e Logs (`/src/lib`)](./src/lib/README.md)**: Funções de importação, exportação e logger administrativo.
7. **[Database Schema (`/prisma`)](./prisma/README.md)**: Estrutura do PostgreSQL e modelos do Prisma.

## 🚀 Como Rodar Localmente (Desenvolvimento)

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` baseando-se no `.env.example` (Você precisará de chaves do Discord, Resend e Postgres).
4. Sincronize o banco de dados:
   ```bash
   npx prisma db push
   ```
5. Inicie o servidor de desenvolvimento e o Bot (se configurado) em paralelo ou usando o script nativo:
   ```bash
   npm run dev
   ```

Acesse o sistema em [http://localhost:3000](http://localhost:3000).
