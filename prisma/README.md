# Prisma & Database Schema 🗄️

O banco de dados inteiro do **Sagaz Site** é gerido pelo ORM `Prisma` em conjunto com um banco de dados relacional **PostgreSQL** (Hospedado via Supabase / Pooler). O Prisma age como a ponte entre o Typescript estritamente tipado (Type-safety) e as tabelas SQL, eliminando problemas comuns de erro de sintaxe e queries perigosas.

## Tabela de Conteúdos (Entidades Principais)

### 1. Sistema de Usuários e Autenticação
- **`User`**: A tabela raiz do sistema. Armazena e-mail, nome de usuário, saldo na carteira R$, token de recuperação de senha e link com o ID do Discord. Contém a propriedade `role` (Cargo: USER, ADMIN, OWNER) e `tokenVersion` (Para derrubar a sessão web caso a senha mude).
- **`DeviceSession`**: Usado para rastrear quais navegadores e IPs acessaram a conta do usuário (sistema de auditoria individual de conta).
- **`Account` & `Session`**: Tabelas padrão do *NextAuth* para suportar provedores OAuth (Discord) de forma limpa.

### 2. Estoque e Produtos Digitais
- **`Category`**: As divisões de itens no frontend (Ex: Cartão Amex, Cartão Inter, Logins Netflix).
- **`CCProduct`** (Cartões) & **`LoginProduct`** (Contas de Acesso): Armazenam os "itens" que um usuário comprou ou que estão disponíveis à venda. Eles vinculam ao dono atual (se comprados).
- **`Review`**: Sistema de avaliação integrado, onde os usuários podem atribuir estrelas aos produtos comprados.

### 3. Integração PIX e Recompensas
- **`Transaction`**: Todo depósito PIX na plataforma é transformado nesta model. Contém o status (`PENDING`, `PAID`, `EXPIRED`) e o ID de referência do Webhook da CashinPay.
- **`PendingDiscordReward`**: Uma fila de segurança. Quando o Bot de Discord atribui um prêmio para um Discord ID que AINDA NÃO logou no site, o saldo fica salvo aqui temporariamente até ser resgatado.

### 4. Configuração e Logging
- **`SystemConfig`**: Tabela simples de chave e valor (`key`, `value`) usada para salvar definições em tempo real pelos Administradores, como `mines_active` (ligar/desligar evento) ou limite de apostas. (Isso evita a necessidade de reiniciar o sistema e usar `.env` para dados mutáveis).
- **`AdminLog`**: Arquivo imutável de log de auditoria. Todo evento destrutivo gerado por um staff (banir, alterar saldo manualmente) é escrito aqui para prestação de contas.

## 🔄 Como Aplicar Migrações

Se você alterar o `schema.prisma`, deve atualizar o Banco de Dados de produção de maneira síncrona.
- Localmente, rodar: `npx prisma db push`
- Em produção contínua (Migrations formais): `npx prisma migrate dev --name <nome_da_migration>` seguido de `npx prisma migrate deploy` no servidor oficial.
- Sempre gere a nova tipagem (`npx prisma generate`) antes de rodar o `next build`.
