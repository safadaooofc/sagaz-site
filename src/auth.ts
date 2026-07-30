import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import DiscordProvider from "next-auth/providers/discord"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "mock-id",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "mock-secret",
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds.join",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
        code: { label: "Código OTP", type: "text" },
        isRegister: { label: "isRegister", type: "text" },
        name: { label: "Name", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) {
          throw new Error("Dados incompletos");
        }

        const { email, password, code, isRegister, name } = credentials;

        // Verify OTP
        const otpRecord = await prisma.otpCode.findFirst({
          where: { email: email as string, code: code as string }
        });

        if (!otpRecord) {
          throw new Error("Código inválido");
        }

        if (otpRecord.expiresAt < new Date()) {
          throw new Error("Código expirado");
        }

        // OTP is valid! Delete it.
        await prisma.otpCode.delete({ where: { id: otpRecord.id } });

        // Handle Registration
        if (isRegister === "true") {
          const hashedPassword = await bcrypt.hash(password as string, 10);
          const newUser = await prisma.user.create({
            data: {
              email: email as string,
              password: hashedPassword,
              name: (name as string) || "Novo Usuário",
            }
          });
          return newUser;
        }

        // Handle Login
        const user = await prisma.user.findUnique({
          where: { email: email as string }
        });

        if (!user) {
          throw new Error("Usuário não encontrado");
        }

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.tokenVersion = (user as any).tokenVersion || 1;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).tokenVersion = token.tokenVersion;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Sincroniza a foto do Discord no banco de dados
      if (account?.provider === "discord" && user?.id && user?.image) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { image: user.image }
          });
        } catch (e) {
          console.error("Falha ao sincronizar avatar:", e);
        }
      }

      // Auto-join Discord Server via Bot Token
      if (account?.provider === "discord" && account.access_token) {
        try {
          const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
          const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

          if (DISCORD_GUILD_ID && DISCORD_BOT_TOKEN && profile?.id) {
            await fetch(`https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${profile.id}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                access_token: account.access_token,
              }),
            });
          }
        } catch (error) {
          console.error("Erro ao adicionar usuário no Discord:", error);
        }
      }
      return true;
    }
  },
  session: { strategy: "jwt" }
})
