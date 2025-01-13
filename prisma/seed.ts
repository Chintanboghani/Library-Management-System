import { PrismaClient } from '@prisma/client';

import { books } from './data';
import { users } from './data';
const prisma = new PrismaClient();
const seedBooks = async () => {
  for (const element of books) {
    if (
      !(await prisma.book.findFirst({
        where: {
          title: element.title,
        },
      }))
    ) {
      await prisma.book.create({ data: element });
    } else {
      console.log('book already seeded');
    }
  }
};

seedBooks()
  .then(async () => {
    console.log('Books seeding complete');
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const seedUsers = async () => {
  for (const element of users) {
    if (
      !(await prisma.user.findFirst({
        where: {
          email: element.email,
        },
      }))
    ) {
      await prisma.user.create({ data: element });
    } else {
      console.log('User already seeded');
    }
  }
};

seedUsers()
  .then(async () => {
    console.log('User seeding complete');
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
