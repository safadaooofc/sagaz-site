# Deploy do Sagaz Site na Discloud ☁️

A Discloud é uma excelente provedora de hospedagem para projetos em Node.js (como bots de Discord e APIs web). 
Este documento guia como colocar o **Sagaz Site (Next.js)** e o **Sagaz Bot (Discord.js)** online.

## 📌 Requisitos de Hardware (RAM)

O Next.js v16 (com Turbopack e App Router), atrelado à engine do Prisma (PostgreSQL) e ao Bot do Discord rodando paralelamente no mesmo container consome uma quantia considerável de memória.
- **Mínimo Absoluto:** `512MB RAM` (Pode sofrer Out-Of-Memory "OOM" caso haja picos de tráfego).
- **Recomendado:** `1024MB RAM` (1GB) para garantir estabilidade do servidor web e do bot simultaneamente sem crashar.

## 📄 Arquivo `discloud.config`

Você precisará de um arquivo na raiz do seu projeto chamado `discloud.config`. (Um já foi gerado na raiz para você).
O conteúdo oficial deve ser:
```ini
NAME=SagazSite
TYPE=site
MAIN=npm start
RAM=1024
AUTORESTART=true
VERSION=latest
APT=
```
*Atenção:* O `TYPE=site` diz para a Discloud liberar a porta 80/443 e linkar com um subdomínio (`.discloud.app`) ou seu domínio customizado, rodando o que estiver definido no `MAIN`.

## ⚙️ Variáveis de Ambiente (`.env`)

Antes de fazer o upload, você precisa colocar suas variáveis no Painel da Discloud (seção "Configurações" ou "Env Vars" do app), ou subir o arquivo `.env` junto com o projeto.
Não se esqueça de adicionar as credenciais:
```ini
DATABASE_URL="sua url pooler do postgres"
DIRECT_URL="sua url session do postgres"
AUTH_SECRET="sua secret do nextauth"
DISCORD_CLIENT_ID="seu client id"
DISCORD_CLIENT_SECRET="seu client secret"
DISCORD_BOT_TOKEN="token do seu bot de discord"
DISCORD_GUILD_ID="id do servidor do sagaz"
RESEND_API_KEY="api key do resend"
CASHINPAY_API_URL="..."
CASHINPAY_API_KEY="..."
CASHINPAY_WEBHOOK_SECRET="..."
```

## 📦 Como Empacotar o Projeto para a Discloud

Como a Discloud vai rodar o comando `npm start`, o Next.js precisa que o site já tenha sido construído (`build`) ANTES de iniciar, caso contrário dará erro no servidor.
Siga os passos:

1. **Construa o Projeto Localmente** na sua máquina antes de enviar.
   ```bash
   npm run build
   ```
2. **Compacte os Arquivos (.zip)**
   Após o `build`, selecione todos os arquivos essenciais e a pasta `.next` gerada, e compacte em um arquivo `.zip`.
   *O que DEVE estar no zip:*
   - Pasta `.next` (Fundamental!)
   - Pasta `src` e `public`
   - Pasta `prisma`
   - Arquivo `package.json`
   - Arquivo `discloud.config`
   - Arquivo `.env` (Ou configure via painel web da Discloud)
   - *IMPORTANTE: NÃO envie a pasta `node_modules`. A Discloud instala automaticamente.*

3. **Faça o Upload**
   No painel ou extensão do VSCode da Discloud, envie o arquivo zip que você acabou de criar.

## 🛠 Script de Início Híbrido (Server + Bot)

O arquivo `package.json` possui os seguintes scripts:
```json
"scripts": {
  "build": "next build",
  "start": "next start"
}
```
Atualmente, se você usar `next start`, o site Next.js iniciará. No entanto, dependendo de como o bot está configurado, ele deve ser inicializado pelo Next.js (por exemplo, na conexão do banco de dados global) ou precisaremos de um `server.js` manual se o Next.js não puxar o bot sozinho no ambiente de produção.
*Como implementado:* O site invoca instâncias necessárias ou um script adicional (ex: "start": "next start & node dist/bot/index.js" - caso esteja buildado via tsc separado). Como você usa App Router, certifique-se de iniciar o bot no startup global.

## 🌐 Domínio Customizado
Dentro do painel da Discloud, você pode adicionar seu próprio domínio apontando os nameservers ou os registros A / CNAME para o IP que a Discloud fornece ao seu aplicativo `TYPE=site`.
