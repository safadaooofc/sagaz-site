# Arquitetura e Segurança 🛡️

Este documento aborda como o Sagaz Site foi estruturado para ser performático e seguro contra ataques comuns da Web.

## 🏛 Arquitetura do Sistema

O projeto adota uma arquitetura em **Três Camadas + Worker Assíncrono** (Bot):
1. **Frontend (App Router)**: Roteamento no lado do servidor (`Server Components`), melhorando o SEO e reduzindo o JS no cliente. Componentes de UI utilizam TailwindCSS.
2. **Backend (Server Actions & API Routes)**: As interações com o banco (compras, saldo, cadastro) não passam pelo cliente. Utilizam Server Actions para segurança adicional e proteção contra tampering. Webhooks (`/api`) recebem dados da CashinPay.
3. **Database (Prisma/PostgreSQL)**: Um schema centralizado que roda validações estritas (schema type-checking).
4. **Discord Worker**: Um processo secundário (o bot via `discord.js`) escuta eventos no servidor oficial e distribui recompensas automaticamente utilizando a API de upsert do Prisma.

## 🔐 Controle de Acesso (RBAC)

O sistema possui Roles (cargos) definidos no Prisma (`enum Role`):
- `USER`: Acesso padrão ao Dashboard, loja de contas, resgates, e recargas.
- `ADMIN`: Acesso ao painel administrativo (Criação de categorias, contas, gerência básica).
- `SUPERADMIN` & `OWNER`: Níveis superiores que permitem a desativação de funcionalidades do sistema (Mines) e alteração de rate limits avançados.

Middlewares do Next.js e verificações nas Server Actions interceptam o acesso a áreas sensíveis, como `/admin/*`. Se um `USER` tentar acessar, será bloqueado.

## 🛡 Proteções de Cibersegurança

### 1. Hash de Senhas e Salt
As senhas de contas locais são criptografadas via **BcryptJS** com `salt=10`. Nem os administradores têm acesso à senha bruta dos usuários.

### 2. Rate Limits e Anti-Spam
Para evitar *DDoS* (ataque de negação de serviço) na API de login e em resgates de recompensas, implementamos logs administrativos e verificações de frequência:
- **Rate Limit de Recompensas**: O Bot só envia recompensa uma vez e vincula o ID do Discord. Evita o abuso de contas fake.
- **Limites de Cadastro**: Para combater a criação em massa de contas com Nicks repetidos, a Server Action verifica instantaneamente se o `nome` e o `email` já existem.

### 3. Proteção contra Injeção de SQL
Ao invés de consultas SQL cruas (`raw queries`), o site usa exclusivamente o **Prisma ORM**. O Prisma sanitiza automaticamente e aplica escapes em todas as variáveis passadas pelo usuário, impedindo SQL Injections clássicas (`' OR 1=1;--`).

### 4. Segurança do Webhook de Pagamento
O recebimento de saldo via PIX (CashinPay) possui dupla checagem:
1. `CASHINPAY_WEBHOOK_SECRET`: A requisição deve conter o cabeçalho criptográfico que bate com a secret, impedindo requisições de servidores falsos.
2. A atualização do saldo é feita via uma `Transação Prisma (tx)`, o que garante atomicidade. Se a query falhar no meio, ela sofre rollback, impedindo dinheiro duplicado.

### 5. Auditoria Admin (`adminLogger`)
Toda e qualquer ação de um administrador (Criar card, gerar saldo falso, deletar conta) é salva em uma tabela de `AdminLog`. Isso garante **Accountability**. Além disso, há um webhook do Discord configurável para notificar o Dono em tempo real sobre quem fez o que.
