import { prismaAdapter } from 'better-auth/adapters/prisma';
import { betterAuth } from "better-auth";
import { prisma } from './prisma';
import { Role, UserStatus } from '../../generated/prisma/enums';



export const auth = betterAuth({
    database:prismaAdapter(prisma, {
        provider:'postgresql',
    }),
    trustedOrigins:[process.env.APP_URL!],
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
    }
})