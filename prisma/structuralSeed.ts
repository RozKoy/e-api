import "dotenv/config";
import { PrismaClient, PositionCategory, PosisionLevel } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding data...');

  // Seed Commission
  const commissionA = await prisma.commission.create({
    data: {
      name: 'Komisi A',
    },
  });

  const commissionB = await prisma.commission.create({
    data: {
      name: 'Komisi B',
    },
  });

  // Seed Positions - Pimpinan
  const pimpinanKetua = await prisma.position.create({
    data: { name: 'Ketua DPRD', category: PositionCategory.pimpinan, level: PosisionLevel.ketua }
  });

  const pimpinanWakil = await prisma.position.create({
    data: { name: 'Wakil Ketua DPRD', category: PositionCategory.pimpinan, level: PosisionLevel.wakil }
  });

  const pimpinanSekretaris = await prisma.position.create({
    data: { name: 'Sekretaris DPRD', category: PositionCategory.pimpinan, level: PosisionLevel.sekretaris }
  });

  const pimpinanAnggota = await prisma.position.create({
    data: { name: 'Anggota DPRD', category: PositionCategory.pimpinan, level: PosisionLevel.anggota }
  });

  // Seed Positions - Komisi A
  const komisiAKetua = await prisma.position.create({
    data: { name: 'Ketua Komisi A', category: PositionCategory.komisi, level: PosisionLevel.ketua, commissionId: commissionA.id }
  });

  const komisiAWakil = await prisma.position.create({
    data: { name: 'Wakil Ketua Komisi A', category: PositionCategory.komisi, level: PosisionLevel.wakil, commissionId: commissionA.id }
  });

  const komisiASekretaris = await prisma.position.create({
    data: { name: 'Sekretaris Komisi A', category: PositionCategory.komisi, level: PosisionLevel.sekretaris, commissionId: commissionA.id }
  });

  const komisiAAnggota = await prisma.position.create({
    data: { name: 'Anggota Komisi A', category: PositionCategory.komisi, level: PosisionLevel.anggota, commissionId: commissionA.id }
  });

  // Seed Positions - Komisi B
  const komisiBKetua = await prisma.position.create({
    data: { name: 'Ketua Komisi B', category: PositionCategory.komisi, level: PosisionLevel.ketua, commissionId: commissionB.id }
  });

  const komisiBWakil = await prisma.position.create({
    data: { name: 'Wakil Ketua Komisi B', category: PositionCategory.komisi, level: PosisionLevel.wakil, commissionId: commissionB.id }
  });

  const komisiBSekretaris = await prisma.position.create({
    data: { name: 'Sekretaris Komisi B', category: PositionCategory.komisi, level: PosisionLevel.sekretaris, commissionId: commissionB.id }
  });

  const komisiBAnggota = await prisma.position.create({
    data: { name: 'Anggota Komisi B', category: PositionCategory.komisi, level: PosisionLevel.anggota, commissionId: commissionB.id }
  });

  // Seed Users dummy untuk setiap posisi
  const positions = [
    pimpinanKetua, pimpinanWakil, pimpinanSekretaris, pimpinanAnggota,
    komisiAKetua, komisiAWakil, komisiASekretaris, komisiAAnggota,
    komisiBKetua, komisiBWakil, komisiBSekretaris, komisiBAnggota,
  ];

  for (const pos of positions) {
    await prisma.user.create({
      data: {
        email: `${pos.name.toLowerCase().replace(/\s+/g, '')}@dprd.go.id`,
        password: 'hashed_password_dummy',
        positionId: pos.id,
        profile: {
          create: {
            name: pos.name,
            phoneNumber: '081234567890',
          },
        },
      },
    });
  }

  console.log('Seeding finished 🚀');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
