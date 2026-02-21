import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from "better-auth";
import { prisma } from './prisma';
import { Role, UserStatus } from '../../generated/prisma/enums';



export const auth = betterAuth({
     baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");

    const allowedOrigins = [
      process.env.APP_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:4000",
      "http://localhost:5000",
      "https://medi-store-client-three.vercel.app",
      "https://medi-store-server-rust.vercel.app",
    ].filter(Boolean);

    // Check if origin matches allowed origins or Vercel pattern
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      return [origin];
    }

    return [];
  },
  basePath: "/api/auth",
    user: {
        additionalFields:{
            role: {
                type:'string',
                defaultValue: Role.CUSTOMER,
                required:true,
                allowedValues:[Role.CUSTOMER, Role.SELLER, Role.ADMIN],
            },
            phone: {
                type:'string',
                required:false,
            },
            address:{
                type:'string',
                required:false
            },
             status:{
                type:"string",
                defaultValue:UserStatus.ACTIVE,
                required:true,
                allowedValues:[UserStatus.ACTIVE, UserStatus.BANNED],
            }
        }
    },
    emailAndPassword:{
        enabled:true,
        requireEmailVerification:false
    },
    socialProviders:{
        google:{
            accessType:'offline',
            prompt:'select_account consent',
            clientId:process.env.GOOGLE_CLIENT_ID as string,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
        }
    },

     session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
  },


})