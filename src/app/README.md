# App Router (`src/app`) 📂

Este diretório segue o padrão do Next.js App Router. Todo o frontend visual, bem como os layouts do sistema, estão contidos aqui.

## Estrutura de Diretórios e Grupos de Rotas

O Next.js usa parênteses `(folder)` para criar **Route Groups** que compartilham Layouts sem afetar a URL.

### 1. `(dashboard)`
Todas as páginas que o usuário logado acessa.
- **`layout.tsx`**: Contém o provider das notificações do evento Mines, Sidebar de navegação e a Topbar com o saldo. Ele também verifica se a Sessão (token) do usuário ainda é válida. Se o `tokenVersion` estiver defasado (usuário resetou a senha ou foi derrubado pelo admin), ele forçará o logout local.
- **/dashboard**: Página inicial com os anúncios fixados e cards de resumo.
- **/buy/cards & /buy/logins**: Lojas de produtos onde o usuário pode comprar cartões interativos (CCs) e contas, consumindo seu saldo R$.
- **/recharge**: Página de Adicionar Saldo via PIX via CashinPay.
- **/mines**: O mini-game "Mines", que aparece dependendo do admin.
- **/settings**: Configuração de segurança do usuário, troca de e-mail e ativação de 2FA.

### 2. `(admin)`
Páginas exclusivas para a equipe do Sagaz Site.
- Protegido por uma Server Action e Middleware que proíbe o acesso de usuários comuns.
- **/admin**: Resumo do faturamento (Analytics).
- **/admin/users**: Gerenciamento de clientes. O admin pode resetar senhas, bloquear e deslogar todos.
- **/admin/cards & /admin/logins**: Painéis para o Owner cadastrar ou deletar estoque de produtos digitais.

### 3. Rotas Públicas (`/login`, `/register`, `/forgot-password`)
Páginas sem proteção de layout, usando o design do Cartão Black Flutuante (estilo Amex).
- O `/login` suporta credenciais padrão (Nome + Senha) e OAuth2 (Discord).
