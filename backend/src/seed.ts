import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const hashed = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@court.local' },
    update: { password: hashed },
    create: { email: 'admin@court.local', password: hashed, role: 'ADMIN' }
  });

  const types = ['Ухвала','Клопотання','Повідомлення','Лист','Справа','Протокол'];
  for (const name of types) {
    await prisma.documentType.upsert({ where: { name }, update: {}, create: { name } });
  }

  console.log('Seed finished. Admin:', admin.email, 'password:', adminPassword);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
