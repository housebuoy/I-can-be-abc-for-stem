import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === 'development') {
  if (global.prisma) {
    prisma = global.prisma;
  } else {
    prisma = new PrismaClient();
    global.prisma = prisma;  
  }
} else {
  
  prisma = new PrismaClient();
}

export { prisma };
