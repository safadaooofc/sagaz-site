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
  session: { strategy: "jwt" }
})
