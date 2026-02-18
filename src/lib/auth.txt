import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import config from "../config";
import { Role, Status } from "../constants/enum";
// import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    baseURL:config.better_auth.url || "http://localhost:5000",
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: async (request) => {
       const origin = request?.headers.get('origin');

       const allowedOrigins = [
        config.better_auth.app_url,
        config.better_auth.url,
        "http://localhost:3000",
        "http://localhost:4000",
        "http://localhost:5000",
        "https://medi-store-server-rust.vercel.app"
       ].filter(Boolean)

       // Check if origin matches allowed origins or vercel pattern
       if (!origin) return allowedOrigins; // ✅ safer
        if (allowedOrigins.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
            return [origin];
        }
       return []
    },
    basePath: '/api/auth',
    user: {
        additionalFields: {
            role:{
                type:'string',
                defaultValue: Role.CUSTOMER,
                required:true,
                allowedValues:[Role.CUSTOMER, Role.SELLER, Role.ADMIN],
            },
            status:{
                type:"string",
                defaultValue:Status.ACTIVE,
                required:true,
                allowedValues:[Status.ACTIVE, Status.BANNED],
            }
        }
    },
    emailAndPassword:{
        enabled:true,
        requireEmailVerification:false
    },
    socialProviders: {
        google: { 
            clientId: config.google.client_id as string, 
            clientSecret: config.google.client_secret as string, 
        }, 
    },
    session:{
        cookieCache:{
            enabled:true,
             maxAge: 60 * 60 * 24 // 1 day
        }
    },
    advanced:{
         cookiePrefix:'batter-auth',
        useSecureCookies:process.env.NODE_ENV === 'production',
        crossSubDomainCookies:{
            enabled:false,
        },
        disableCSRFCheck:true // Allow requests without Origin header (postman, mobile app, etc)
    }
});