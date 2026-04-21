import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP, admin } from "better-auth/plugins";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  socialProviders: {
    github: {
      clientId: env.Auth_Github_Client_Id!,
      clientSecret: env.Auth_Github_Secret!,
    },
    google: {
      clientId: env.Auth_GOOGLE_CLIENT_ID!,
      clientSecret: env.Auth_GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
     await resend.emails.send({
      from: 'BitLearn <onboarding@resend.dev>',
      to: [email],
      subject: 'BitLearn - Verify Code',
    html:`<p>Your verification code is: <strong>${otp}</strong></p>`

    });
      },
    }),
  ],
});
