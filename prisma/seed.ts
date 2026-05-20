import { PrismaClient, Role, Status } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing database...');
  await prisma.readLog.deleteMany();
  await prisma.dailyAnalytics.deleteMany();
  await prisma.article.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating users...');
  // The requirement says Name must contain only alphabets and spaces. No numbers!
  const passwordHash = await bcrypt.hash('Password1!', 10);
  
  const authors = [];
  const readers = [];

  for (let i = 1; i <= 10; i++) {
    // Generate letter suffix (A, B, C...) to avoid digits in name
    const suffix = String.fromCharCode(64 + i); 
    
    const author = await prisma.user.create({
      data: {
        name: `Author ${suffix}`,
        email: `author${suffix.toLowerCase()}@test.com`,
        password: passwordHash,
        role: Role.AUTHOR,
      }
    });
    authors.push(author);

    const reader = await prisma.user.create({
      data: {
        name: `Reader ${suffix}`,
        email: `reader${suffix.toLowerCase()}@test.com`,
        password: passwordHash,
        role: Role.READER,
      }
    });
    readers.push(reader);
  }

  console.log('Creating articles...');
  const categories = ['Tech', 'Politics', 'Sports', 'Health', 'Entertainment'];
  let articleCount = 0;

  for (const author of authors) {
    // Each author writes 5 articles
    for (let j = 0; j < 5; j++) {
      const isDraft = j === 4; // 1 draft, 4 published per author
      const category = categories[j % categories.length];
      const letterSuffix = String.fromCharCode(65 + j); // A, B, C...

      await prisma.article.create({
        data: {
          title: `Exploring the fascinating world of ${category} part ${letterSuffix} by ${author.name}`,
          content: `This is a comprehensive and detailed article about ${category}. It covers all the essential aspects you need to know about the current trends. `.repeat(3), // ensures min 50 characters
          category: category,
          status: isDraft ? Status.DRAFT : Status.PUBLISHED,
          authorId: author.id,
        }
      });
      articleCount++;
    }
  }

  console.log(`✅ Seed successful! Created 10 Authors, 10 Readers, and ${articleCount} Articles.`);
  console.log(`Test login example: Email: authora@test.com / Password: Password1!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
