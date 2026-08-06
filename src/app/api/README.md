# API Routes do Sagaz Site 🌐

Este diretório contém os Endpoints (RESTful APIs) e Webhooks usados tanto por clientes externos (processadores de pagamento) quanto pelo Frontend via Fetch para checagens em tempo real.

O Sagaz Site usa amplamente Server Actions do Next.js para formulários (evitando a necessidade de APIs convencionais), então os arquivos neste diretório servem a propósitos muito específicos, lidando com chamadas externas ou lógicas onde Server Actions não se aplicam.

## 🗂 Estrutura de Endpoints

### 1. Auth (`/api/auth/[...nextauth]/route.ts`)
Essa é a rota principal de autenticação gerada pelo NextAuth.js.
- Gerencia Sessões, cookies e decodificação JWT.
- É responsável pelo redirecionamento OAuth2 para o Discord.
- Contém lógica para verificar se o usuário está banido antes de permitir o login.
- Contém lógica para sincronizar o saldo de recompensa gerado pelo Bot caso a conta ainda não estivesse linkada.

### 2. Force Logout (`/api/auth/force-logout/route.ts`)
- Limpa o cookie local de sessão do usuário imediatamente e redireciona para `/login`. É invocado automaticamente no Layout Principal caso o banco de dados mude a `tokenVersion` de segurança.

### 3. Reset Password (`/api/auth/reset-password/route.ts`)
- Rota para validar e criar uma nova senha enviada pelo email de recuperação.
- Valida o token gerado pelo `crypto.randomBytes(32)` que foi guardado no banco.

### 4. Mines Status (`/api/mines/status/route.ts`)
- Rota `force-dynamic` que retorna o estado booleano se o evento "Mines" está ativo no banco de dados (`mines_active`).
- É usada em uma verificação Polling de 10 em 10 segundos pelo Frontend, usando `useEffect`, para exibir notificações de início ou término do evento na tela para os usuários conectados em tempo real.

### 5. Webhooks de Pagamento (CashinPay)
*(Rotas de callback para receber a notificação de um PIX pago)*
- Recebe requisições POST do processador de pagamento.
- Verifica o `CASHINPAY_WEBHOOK_SECRET` para atestar a autenticidade da requisição.
- Localiza a transação, marca como `PAID` e via uma `Prisma Transaction`, credita o saldo no balanço da carteira do usuário.
