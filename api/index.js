var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Review {\n  id      String  @id @default(uuid())\n  rating  Int // 1-5\n  comment String?\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n\n  // one review per user per medicine\n  @@unique([userId, medicineId])\n}\n\nmodel Medicine {\n  id           String @id @default(uuid())\n  name         String\n  description  String\n  price        Float\n  stock        Int\n  manufacturer String\n  imageUrl     String\n\n  //   Relations\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  sellerId String\n  seller   User   @relation("SellerMedicines", fields: [sellerId], references: [id], onDelete: Cascade)\n\n  reviews    Review[]\n  orderItems OrderItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nenum OrderStatus {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel Order {\n  id String @id @default(uuid())\n\n  customerId String\n  customer   User   @relation("CustomerOrders", fields: [customerId], references: [id], onDelete: Cascade)\n\n  status          OrderStatus @default(PLACED)\n  shippingAddress String\n  totalAmount     Float\n\n  createdAT DateTime    @default(now())\n  updatedAt DateTime    @updatedAt\n  items     OrderItem[]\n}\n\nmodel OrderItem {\n  id String @id @default(uuid())\n\n  orderId String\n  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n\n  quantity Int\n  price    Float\n\n  createdAt DateTime @default(now())\n}\n\nmodel Category {\n  id   String @id @default(uuid())\n  name String @unique\n\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n  medicines Medicine[]\n\n  @@index([name])\n}\n\nenum Role {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nmodel User {\n  id            String     @id\n  name          String\n  email         String\n  emailVerified Boolean    @default(false)\n  image         String?\n  createdAt     DateTime   @default(now())\n  updatedAt     DateTime   @updatedAt\n  role          Role       @default(CUSTOMER)\n  status        UserStatus @default(ACTIVE)\n\n  phone   String?\n  address String?\n\n  // relations\n  sessions  Session[]\n  accounts  Account[]\n  medicines Medicine[] @relation("SellerMedicines")\n  orders    Order[]    @relation("CustomerOrders")\n  reviews   Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"SellerMedicines"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"createdAT","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"SellerMedicines"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MedicineScalarFieldEnum: () => MedicineScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Review: "Review",
  Medicine: "Medicine",
  Order: "Order",
  OrderItem: "OrderItem",
  Category: "Category",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  userId: "userId",
  medicineId: "medicineId",
  createdAt: "createdAt"
};
var MedicineScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  stock: "stock",
  manufacturer: "manufacturer",
  imageUrl: "imageUrl",
  categoryId: "categoryId",
  sellerId: "sellerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  status: "status",
  shippingAddress: "shippingAddress",
  totalAmount: "totalAmount",
  createdAT: "createdAT",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  medicineId: "medicineId",
  quantity: "quantity",
  price: "price",
  createdAt: "createdAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  status: "status",
  phone: "phone",
  address: "address"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  CUSTOMER: "CUSTOMER",
  SELLER: "SELLER",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BANNED: "BANNED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");
    const allowedOrigins2 = [
      process.env.APP_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:4000",
      "http://localhost:5000",
      "https://medi-store-client-three.vercel.app",
      "https://medi-store-server-rust.vercel.app"
    ].filter(Boolean);
    if (!origin || allowedOrigins2.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return [origin];
    }
    return [];
  },
  basePath: "/api/auth",
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: Role.CUSTOMER,
        required: true,
        allowedValues: [Role.CUSTOMER, Role.SELLER, Role.ADMIN]
      },
      phone: {
        type: "string",
        required: false
      },
      address: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: UserStatus.ACTIVE,
        required: true,
        allowedValues: [UserStatus.ACTIVE, UserStatus.BANNED]
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  socialProviders: {
    google: {
      accessType: "offline",
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    },
    disableCSRFCheck: true
    // Allow requests without Origin header (Postman, mobile apps, etc.)
  }
});

// src/modules/medicine/medicine.route.ts
import { Router } from "express";

// src/middleware/appError.ts
var AppError = class extends Error {
  statusCode;
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
};

// src/modules/medicine/medicine.service.ts
var getAllMedicines = async ({
  search,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}) => {
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: {
          contains: search,
          mode: "insensitive"
        } },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          category: {
            name: {
              contains: search,
              mode: "insensitive"
            }
          }
        }
      ]
    });
  }
  const result = await prisma.medicine.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      category: {
        select: { id: true, name: true }
      },
      seller: true,
      reviews: {
        select: {
          rating: true,
          comment: true
        }
      }
    }
  });
  const total = await prisma.medicine.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getMedicineById = async (id) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true }
      },
      seller: true,
      reviews: {
        include: { user: true }
      }
    }
  });
  return medicine;
};
var createMedicine = async (payload) => {
  const {
    name,
    description,
    price,
    stock,
    manufacturer,
    imageUrl,
    categoryId,
    sellerId
  } = payload;
  const seller = await prisma.user.findUnique({
    where: { id: sellerId }
  });
  if (!seller) {
    throw new AppError("Seller not found", 404);
  }
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  });
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  const medicine = await prisma.medicine.create({
    data: {
      name,
      description,
      price,
      stock,
      manufacturer,
      imageUrl,
      categoryId,
      sellerId
    }
  });
  return medicine;
};
var deleteMedicineById = async (id) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id }
  });
  if (!medicine) {
    throw new AppError("Medicine not found", 404);
  }
  await prisma.medicine.delete({
    where: { id }
  });
};
var updateMedicineId = async (medicineId, payload) => {
  const allowedFields = {
    name: payload?.name,
    description: payload?.price,
    price: payload?.price,
    stock: payload?.stock,
    manufacturer: payload?.manufacturer,
    imageUrl: payload?.imageUrl
  };
  const dataToUpdate = Object.fromEntries(
    Object.entries(allowedFields).filter(([_, v]) => v !== void 0)
  );
  const result = await prisma.medicine.update({
    where: { id: medicineId },
    data: dataToUpdate
  });
};
var medicineService = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  deleteMedicineById,
  updateMedicineId
};

// src/helper/pagination_sorting.helper.ts
var paginationAndSorting = (options) => {
  const page = Number(options.page ?? 1);
  const limit = Number(options.limit ?? 12);
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy ?? "createdAt";
  const sortOrder = options.sortOrder ?? "desc";
  return { page, limit, skip, sortBy, sortOrder };
};
var pagination_sorting_helper_default = paginationAndSorting;

// src/modules/medicine/medicine.controller.ts
var getAllMedicines2 = async (req, res, next) => {
  try {
    const search = req.query.search;
    const { page, limit, skip, sortBy, sortOrder } = pagination_sorting_helper_default(req.query);
    const medicines = await medicineService.getAllMedicines({
      search,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });
    res.status(200).json({
      success: true,
      message: "Medicines retrieved successfully",
      data: medicines
    });
  } catch (error) {
    next(error);
  }
};
var getMedicineById2 = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await medicineService.getMedicineById(id);
    res.status(200).json({
      success: true,
      message: "Medicine retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var createMedicine2 = async (req, res, next) => {
  try {
    const medicineData = req.body;
    const result = await medicineService.createMedicine(medicineData);
    res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteMedicineById2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    await medicineService.deleteMedicineById(id);
    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
var updateMedicineId2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicineData = req.body;
    const result = await medicineService.updateMedicineId(id, medicineData);
  } catch (error) {
    next(error);
  }
};
var medicineController = {
  createMedicine: createMedicine2,
  getAllMedicines: getAllMedicines2,
  getMedicineById: getMedicineById2,
  deleteMedicineById: deleteMedicineById2,
  updateMedicineId: updateMedicineId2
};

// src/middleware/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access!"
        });
      }
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user?.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden Access!"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth2;

// src/modules/medicine/medicine.route.ts
var router = Router();
router.get("/", medicineController.getAllMedicines);
router.get("/:id", medicineController.getMedicineById);
router.post("/", auth_default(Role.SELLER, Role.ADMIN), medicineController.createMedicine);
router.delete("/:id", auth_default(Role.SELLER, Role.ADMIN), medicineController.deleteMedicineById);
router.patch("/:id", auth_default(Role.SELLER, Role.ADMIN), medicineController.updateMedicineId);
var medicineRoutes = router;

// src/middleware/globalErrorHandler.ts
function globalErrorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = "Internal server Error";
  let error = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Duplicate key error";
        break;
      case "P2003":
        statusCode = 400;
        message = "Foreign key constraint failed";
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found.";
        break;
      default:
        statusCode = 400;
        message = "Database request error";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      message = "Database authentication failed";
    } else if (err.errorCode === "P1001") {
      statusCode = 503;
      message = "Database server unreachable";
    }
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }
  console.log(error);
  res.status(statusCode).json({
    success: false,
    message,
    error
  });
}
var globalErrorHandler_default = globalErrorHandler;

// src/modules/category/category.route.ts
import { Router as Router2 } from "express";

// src/modules/category/category.service.ts
var getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      medicines: true
    }
  });
};
var createCategory = async (category) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: category
    }
  });
  if (existingCategory) {
    throw new AppError("Category already exists", 409);
  }
  return await prisma.category.create({
    data: {
      name: category
    }
  });
};
var deleteCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  const result = await prisma.category.delete({
    where: { id }
  });
  return result;
};
var updateCategoryById = async (id, name) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  const result = await prisma.category.update({
    where: { id },
    data: { name }
  });
  return result;
};
var categoryService = {
  createCategory,
  getAllCategories,
  deleteCategoryById,
  updateCategoryById
};

// src/modules/category/category.controller.ts
var getAllCategories2 = async (req, res, next) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var createCategory2 = async (req, res, next) => {
  try {
    const { name: category } = req.body;
    if (!category) {
      throw new Error("Category is required");
    }
    const result = await categoryService.createCategory(category);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteCategoryById2 = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategoryById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateCategoryById2 = async (req, res, next) => {
  try {
    const result = await categoryService.updateCategoryById(req.params.id, req.body.name);
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  deleteCategoryById: deleteCategoryById2,
  updateCategoryById: updateCategoryById2
};

// src/modules/category/category.route.ts
var router2 = Router2();
router2.get("/", categoryController.getAllCategories);
router2.post(
  "/",
  auth_default(Role.ADMIN, Role.SELLER),
  categoryController.createCategory
);
router2.delete(
  "/:id",
  auth_default(Role.ADMIN, Role.SELLER),
  categoryController.deleteCategoryById
);
router2.patch(
  "/:id",
  auth_default(Role.ADMIN, Role.SELLER),
  categoryController.updateCategoryById
);
var categoryRoutes = router2;

// src/modules/user/user.route.ts
import { Router as Router3 } from "express";

// src/modules/user/user.service.ts
var getCurrentUser = async (req) => {
  const userId = req.user?.id;
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  return user;
};
var getAllUsers = async () => {
  const result = await prisma.user.findMany();
  return result;
};
var adminStatus = async () => {
  const [
    totalCount,
    customerCount,
    sellerCount,
    adminCount,
    totalCategories,
    totalMedicines,
    totalReviews
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.count({ where: { role: Role.CUSTOMER } }),
    prisma.user.count({ where: { role: Role.SELLER } }),
    prisma.user.count({ where: { role: Role.ADMIN } }),
    prisma.category.count(),
    prisma.medicine.count(),
    prisma.review.count()
  ]);
  const orderStatus = await prisma.order.groupBy({
    by: ["status"],
    _count: { status: true },
    _sum: { totalAmount: true }
  });
  const orderData = {
    total: 0,
    placed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    placedAmount: 0,
    processingAmount: 0,
    shippedAmount: 0,
    deliveredAmount: 0,
    cancelledAmount: 0
  };
  let totalOrders = 0;
  for (const s of orderStatus) {
    const status = s.status.toLowerCase();
    orderData[status] = s._count.status;
    orderData[`${status}Amount`] = s._sum.totalAmount || 0;
    totalOrders += s._count.status;
  }
  orderData.total = totalOrders;
  return {
    user: {
      total: totalCount,
      customer: customerCount,
      seller: sellerCount,
      admin: adminCount
    },
    category: {
      total: totalCategories
    },
    medicine: {
      total: totalMedicines
    },
    order: orderData,
    review: {
      total: totalReviews
    }
  };
};
var sellerStatus = async () => {
  const [totalCategories, totalMedicines, totalReviews] = await prisma.$transaction([
    prisma.category.count(),
    prisma.medicine.count(),
    prisma.review.count()
  ]);
  const orderStatus = await prisma.order.groupBy({
    by: ["status"],
    _count: { status: true },
    _sum: { totalAmount: true }
  });
  const orderData = {
    total: 0,
    placed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    placedAmount: 0,
    processingAmount: 0,
    shippedAmount: 0,
    deliveredAmount: 0,
    cancelledAmount: 0
  };
  let totalOrders = 0;
  for (const s of orderStatus) {
    const status = s.status.toLowerCase();
    orderData[status] = s._count.status;
    orderData[`${status}Amount`] = s._sum.totalAmount || 0;
    totalOrders += s._count.status;
  }
  orderData.total = totalOrders;
  return {
    category: {
      total: totalCategories
    },
    medicine: {
      total: totalMedicines
    },
    order: orderData,
    review: {
      total: totalReviews
    }
  };
};
var customerStatus = async (user) => {
  if (user.role !== Role.CUSTOMER) {
    throw new AppError("User is not a customer", 400);
  }
  if (!user.id) {
    throw new AppError("User ID is required", 400);
  }
  const [ordersCount, reviewsCount, amountGroup, countGroup] = await Promise.all([
    prisma.order.count({
      where: { customerId: user.id }
      //MUST match model
    }),
    prisma.review.count({
      where: { userId: user.id }
    }),
    prisma.order.groupBy({
      by: ["status"],
      where: { customerId: user.id },
      _sum: { totalAmount: true }
    }),
    prisma.order.groupBy({
      by: ["status"],
      where: { customerId: user.id },
      _count: { _all: true }
    })
  ]);
  const statuses = [
    "PLACED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED"
  ];
  const orderAmountByStatus = Object.fromEntries(
    statuses.map((status) => [
      status,
      amountGroup.find((o) => o.status === status)?._sum.totalAmount ?? 0
    ])
  );
  const orderCountByStatus = Object.fromEntries(
    statuses.map((status) => [
      status,
      countGroup.find((o) => o.status === status)?._count._all ?? 0
    ])
  );
  return {
    ordersCount,
    reviewsCount,
    orderCountByStatus,
    orderAmountByStatus
  };
};
var updateUser = async (actor, targetUserId, payload) => {
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true }
  });
  if (!targetUser) {
    throw new AppError("User not found", 404);
  }
  const isSelf = actor.id === targetUserId;
  let updateData = {};
  if (actor.role === Role.ADMIN) {
    if (payload.name !== void 0) updateData.name = payload.name;
    if (payload.image !== void 0) updateData.image = payload.image;
    if (payload.role !== void 0) updateData.role = payload.role;
    if (payload.status !== void 0) updateData.status = payload.status;
  } else {
    if (!isSelf) {
      throw new AppError(
        "You are not allowed to update role or status",
        403
      );
    }
    if (payload.name !== void 0) updateData.name = payload.name;
    if (payload.image !== void 0) updateData.image = payload.image;
  }
  if (Object.keys(updateData).length === 0) {
    throw new AppError("No valid fields to update", 400);
  }
  return prisma.user.update({
    where: { id: targetUserId },
    data: updateData
  });
};
var userService = {
  getCurrentUser,
  getAllUsers,
  adminStatus,
  sellerStatus,
  updateUser,
  customerStatus
};

// src/modules/user/user.controller.ts
var getCurrentUser2 = async (req, res, next) => {
  try {
    const result = await userService.getCurrentUser(req);
    res.status(200).json({
      success: true,
      message: "Current user fetched successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getAllUsers2 = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "All users fetched successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var adminStatus2 = async (req, res, next) => {
  try {
    const result = await userService.adminStatus();
    res.status(200).json({
      success: true,
      message: "Admin stats fetched successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var sellerStatus2 = async (req, res, next) => {
  try {
    const result = await userService.sellerStatus();
    res.status(200).json({
      success: true,
      message: "Seller stats fetched successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var customerStatus2 = async (req, res, next) => {
  try {
    const user = req.user;
    const result = await userService.customerStatus(user);
    res.status(200).json({
      success: true,
      message: "customer stats fetched successfully!",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateUser2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    await userService.updateUser(
      user,
      // actor
      id,
      //target user id
      req.body
      // update payload
    );
  } catch (error) {
    next(error);
  }
};
var userController = {
  getCurrentUser: getCurrentUser2,
  getAllUsers: getAllUsers2,
  adminStatus: adminStatus2,
  sellerStatus: sellerStatus2,
  customerStatus: customerStatus2,
  updateUser: updateUser2
};

// src/modules/user/user.route.ts
var router3 = Router3();
router3.get(
  "/me",
  auth_default(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
  userController.getCurrentUser
);
router3.get("/", auth_default(Role.ADMIN), userController.getAllUsers);
router3.get("/admin/status", auth_default(Role.ADMIN), userController.adminStatus);
router3.get("/seller/status", auth_default(Role.SELLER), userController.sellerStatus);
router3.get(
  "/customer/status",
  auth_default(Role.CUSTOMER),
  userController.customerStatus
);
router3.patch(
  "/:id",
  auth_default(Role.ADMIN, Role.SELLER, Role.CUSTOMER),
  userController.updateUser
);
var userRoutes = router3;

// src/modules/order/order.routes.ts
import { Router as Router4 } from "express";

// src/modules/order/order.service.ts
var getAllOrders = async (status) => {
  const whereClause = status ? { status } : {};
  const result = await prisma.order.findMany({
    where: whereClause,
    include: {
      customer: true,
      items: {
        include: {
          medicine: true
        }
      }
    },
    orderBy: { createdAT: "desc" }
  });
  return result;
};
var getOrderById = async (id) => {
  const result = await prisma.order.findMany({
    where: { customerId: id },
    include: {
      customer: true,
      items: {
        include: {
          medicine: true
        }
      }
    }
  });
  return result;
};
var createOrder = async (orderData) => {
  const totalAmount = orderData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  orderData.totalAmount = totalAmount;
  const result = await prisma.order.create({
    data: {
      customerId: orderData.customerId,
      shippingAddress: orderData.shippingAddress,
      totalAmount,
      items: {
        create: orderData.items.map((item) => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    },
    include: {
      customer: true,
      items: {
        include: {
          medicine: true
        }
      }
    }
  });
  return result;
};
var deleteOrderById = async (id) => {
  const order = await prisma.order.findUnique({
    where: { id }
  });
  if (!order) {
    throw new AppError("Order not  found", 404);
  }
  const result = await prisma.order.delete({
    where: { id }
  });
  return result;
};
var updateOrderById = async (id, orderData) => {
  const order = await prisma.order.findUnique({
    where: { id }
  });
  if (!order) {
    throw new AppError("Order not found", 404);
  }
  const status = orderData.status;
  return await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      customer: true,
      items: {
        include: {
          medicine: true
        }
      }
    }
  });
};
var orderService = {
  getAllOrders,
  getOrderById,
  createOrder,
  deleteOrderById,
  updateOrderById
};

// src/modules/order/order.controller.ts
var getAllOrders2 = async (req, res, next) => {
  try {
    const { status } = req.query;
    const result = await orderService.getAllOrders(status);
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getOrderById2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await orderService.getOrderById(id);
    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var createOrder2 = async (req, res, next) => {
  try {
    const orderData = req.body;
    const result = await orderService.createOrder(orderData);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteOrderById2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await orderService.deleteOrderById(id);
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateOrderById2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orderData = req.body;
    const result = await orderService.updateOrderById(
      id,
      orderData
    );
  } catch (error) {
    next(error);
  }
};
var orderController = {
  getAllOrders: getAllOrders2,
  getOrderById: getOrderById2,
  createOrder: createOrder2,
  deleteOrderById: deleteOrderById2,
  updateOrderById: updateOrderById2
};

// src/modules/order/order.routes.ts
var router4 = Router4();
router4.get("/", auth_default(Role.SELLER, Role.ADMIN), orderController.getAllOrders);
router4.get("/:id", auth_default(Role.CUSTOMER, Role.SELLER, Role.ADMIN), orderController.getOrderById);
router4.post("/", auth_default(Role.CUSTOMER, Role.SELLER, Role.ADMIN), orderController.createOrder);
router4.delete("/:id", auth_default(Role.ADMIN, Role.SELLER), orderController.deleteOrderById);
router4.patch("/:id", auth_default(Role.ADMIN, Role.SELLER), orderController.updateOrderById);
var orderRoutes = router4;

// src/modules/review/review.route.ts
import { Router as Router5 } from "express";

// src/modules/review/review.service.ts
var getAllReviews = async () => {
  return await prisma.review.findMany();
};
var getReviewByUserId = async (userId) => {
  return await prisma.review.findMany({
    where: {
      userId
    }
  });
};
var createReview = async (payload) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: payload.userId
    }
  });
  if (!userExists) {
    throw new AppError("User does not exist", 404);
  }
  const medicineExists = await prisma.medicine.findUnique({
    where: {
      id: payload.medicineId
    }
  });
  if (!medicineExists) {
    throw new AppError("Medicine does not exist", 404);
  }
  if (payload.rating < 1 || payload.rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }
  return await prisma.review.create({
    data: payload
  });
};
var deleteReviewById = async (id) => {
  const review = await prisma.review.findUnique({
    where: { id }
  });
  if (!review) {
    throw new AppError("Review not found", 404);
  }
  await prisma.review.delete({
    where: { id }
  });
};
var updateReviewById = async (reviewId, payload) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review) {
    throw new AppError("Review not found", 404);
  }
  if (payload.rating < 1 || payload.rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }
  return await prisma.review.update({
    where: { id: reviewId },
    data: payload
  });
};
var reviewService = {
  getAllReviews,
  getReviewByUserId,
  createReview,
  deleteReviewById,
  updateReviewById
};

// src/modules/review/review.controller.ts
var getAllReviews2 = async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviews();
    res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getReviewByUserId2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await reviewService.getReviewByUserId(id);
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var createReview2 = async (req, res, next) => {
  try {
    const result = await reviewService.createReview(req.body);
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var deleteReviewById2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    await reviewService.deleteReviewById(id);
    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
var updateReviewById2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    await reviewService.updateReviewById(id, req.body);
    res.status(200).json({
      success: true,
      message: "Review update successfully"
    });
  } catch (error) {
    next(error);
  }
};
var reviewController = {
  getAllReviews: getAllReviews2,
  getReviewByUserId: getReviewByUserId2,
  createReview: createReview2,
  deleteReviewById: deleteReviewById2,
  updateReviewById: updateReviewById2
};

// src/modules/review/review.route.ts
var router5 = Router5();
router5.get(
  "/",
  auth_default(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
  reviewController.getAllReviews
);
router5.get(
  "/",
  auth_default(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
  reviewController.getAllReviews
);
router5.post(
  "/",
  auth_default(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
  reviewController.createReview
);
router5.delete(
  "/:id",
  auth_default(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
  reviewController.deleteReviewById
);
router5.patch(
  "/:id",
  auth_default(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
  reviewController.updateReviewById
);
var reviewRoutes = router5;

// src/utils/logger.ts
function log(level, message, meta) {
  const timestamp = (/* @__PURE__ */ new Date()).toISOString();
  const payload = {
    timestamp,
    level,
    message,
    ...meta && { meta }
  };
  switch (level) {
    case "error":
      console.log(payload);
      break;
    case "warn":
      console.warn(payload);
      break;
    default:
      console.log(payload);
  }
}

// src/middleware/requestLogger.ts
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    log("info", "HTTP request", {
      method: req.method,
      path: req.originalUrl,
      statusCode: req.statusCode,
      durationMs: duration
    });
  });
  next();
}

// src/app.ts
var app = express();
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL
  // Production frontend URL
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.all("/api/auth/*split", toNodeHandler(auth));
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/medicine", medicineRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/review", reviewRoutes);
app.get("/", (req, res) => {
  res.send("<h1>Medi Store server...</h1>");
});
app.use((req, res) => {
  res.status(404).json({
    path: req.url,
    success: false,
    message: "Not Found!"
  });
});
app.use(globalErrorHandler_default);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
