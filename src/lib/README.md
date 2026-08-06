# Lib Utilities (`src/lib`) 🛠️

Este diretório armazena scripts, funções globais, clientes instanciados e ferramentas de formatação que são reutilizadas em diversos lugares da aplicação para evitar a repetição de código (DRY - *Don't Repeat Yourself*).

## Funções e Importações Disponíveis

### 1. `prisma.ts`
- É a porta de entrada principal para a conexão com o banco de dados. 
- Ele instancia o objeto `PrismaClient` usando uma checagem de ambiente (`NODE_ENV !== 'production'`). 
- Isso serve para impedir que no ambiente de desenvolvimento o *Hot Reload* do Next.js abra múltiplas e infinitas conexões simultâneas com o PostgreSQL, sobrecarregando e crashando o banco (criando o objeto `globalThis.prisma`).

### 2. `adminLogger.ts`
- Contém a função `logAdminAction`, de extrema importância para a auditoria de segurança da plataforma.
- Sempre que um administrador faz uma mudança que afeta um usuário ou o sistema (ex: adicionar fundos, banir contas, cadastrar produtos), a função captura quem fez, qual ação fez (tipo da action) e o IP.
- Além de escrever na tabela `AdminLog`, ela pode acionar um webhook configurado do Discord para reportar as ações do staff em tempo real para o Owner.

### 3. Funções de Utils (`utils.ts` / Formatação)
- Funções estéticas, tais como concatenação de classes Tailwind (`clsx` + `tailwind-merge`), conversores de data (`date-fns`) e moedas (formatação de BRL R$).
- Geradores de chaves pseudo-aleatórias.

### 4. Integrações Extras (Email, etc)
- Utilitários vinculados à inicialização da dependência do Resend (disparo transacional de e-mails de recuperação de senha).
