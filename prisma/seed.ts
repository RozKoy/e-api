import {
    PrismaClient,
    // ProposalStatusEnum,
} from "../src/generated/prisma/client";
import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🚀 Menjalankan seeding data...");

    // === 1. Seed Permissions ===
    await prisma.permission.createMany({
        data: [
            // === USER MANAGEMENT ===
            {
                name: "Lihat Pengguna",
                group: "Manajemen Pengguna",
                description: "Melihat daftar pengguna",
            },
            {
                name: "Buat Pengguna",
                group: "Manajemen Pengguna",
                description: "Membuat pengguna baru",
            },
            {
                name: "Ubah Pengguna",
                group: "Manajemen Pengguna",
                description: "Mengubah data pengguna",
            },
            {
                name: "Hapus Pengguna",
                group: "Manajemen Pengguna",
                description: "Menghapus pengguna",
            },

            // === USER PROFILE MANAGEMENT ===
            {
                name: "Buat Profil Pengguna",
                group: "Manajemen Profil Pengguna",
                description: "Membuat profil pengguna baru",
            },
            {
                name: "Ubah Profil Pengguna",
                group: "Manajemen Profil Pengguna",
                description: "Mengubah data profil pengguna",
            },

            // === ROLE MANAGEMENT ===
            {
                name: "Lihat Peran",
                group: "Manajemen Peran",
                description: "Melihat daftar peran",
            },
            {
                name: "Buat Peran",
                group: "Manajemen Peran",
                description: "Menambahkan peran baru",
            },
            {
                name: "Ubah Peran",
                group: "Manajemen Peran",
                description: "Mengubah data peran",
            },
            {
                name: "Hapus Peran",
                group: "Manajemen Peran",
                description: "Menghapus peran",
            },

            // === ROLE PERMISSION MANAGEMENT ===
            {
                name: "Lihat Hak Akses Peran",
                group: "Manajemen Hak Akses Peran",
                description: "Melihat daftar hak akses per peran",
            },
            {
                name: "Tambah Hak Akses Peran",
                group: "Manajemen Hak Akses Peran",
                description: "Menambahkan hak akses ke peran",
            },
            {
                name: "Hapus Hak Akses Peran",
                group: "Manajemen Hak Akses Peran",
                description: "Menghapus hak akses dari peran",
            },

            // === PERMISSION MANAGEMENT ===
            {
                name: "Lihat Hak Akses",
                group: "Manajemen Hak Akses",
                description: "Melihat daftar seluruh hak akses",
            },

            // === AREA MANAGEMENT ===
            {
                name: "Lihat Area",
                group: "Manajemen Area",
                description: "Melihat daftar area",
            },
            {
                name: "Buat Area",
                group: "Manajemen Area",
                description: "Menambahkan area baru",
            },
            {
                name: "Ubah Area",
                group: "Manajemen Area",
                description: "Mengubah data area",
            },
            {
                name: "Hapus Area",
                group: "Manajemen Area",
                description: "Menghapus area",
            },

            // === FRACTION MANAGEMENT ===
            {
                name: "Lihat Fraksi",
                group: "Manajemen Fraksi",
                description: "Melihat daftar fraksi",
            },
            {
                name: "Buat Fraksi",
                group: "Manajemen Fraksi",
                description: "Menambahkan fraksi baru",
            },
            {
                name: "Ubah Fraksi",
                group: "Manajemen Fraksi",
                description: "Mengubah data fraksi",
            },
            {
                name: "Hapus Fraksi",
                group: "Manajemen Fraksi",
                description: "Menghapus fraksi",
            },

            // === USER ACCESS MANAGEMENT ===
            {
                name: "Lihat Akses Pengguna",
                group: "Manajemen Akses Pengguna",
                description: "Melihat daftar akses pengguna",
            },
            {
                name: "Buat Akses Pengguna",
                group: "Manajemen Akses Pengguna",
                description: "Menambahkan akses pengguna baru",
            },
            {
                name: "Ubah Akses Pengguna",
                group: "Manajemen Akses Pengguna",
                description: "Mengubah data akses pengguna",
            },
            {
                name: "Hapus Akses Pengguna",
                group: "Manajemen Akses Pengguna",
                description: "Menghapus akses pengguna",
            },

            // === CATEGORY MANAGEMENT ===
            {
                name: "Lihat Kategori",
                group: "Manajemen Kategori",
                description: "Melihat daftar kategori",
            },
            {
                name: "Buat Kategori",
                group: "Manajemen Kategori",
                description: "Menambahkan kategori baru",
            },
            {
                name: "Ubah Kategori",
                group: "Manajemen Kategori",
                description: "Mengubah data kategori",
            },
            {
                name: "Hapus Kategori",
                group: "Manajemen Kategori",
                description: "Menghapus kategori",
            },

            // === PROPOSAL MANAGEMENT ===
            {
                name: "Hapus Proposal",
                group: "Manajemen Proposal",
                description: "Menghapus proposal",
            },
            {
                name: "Disposisi Proposal",
                group: "Manajemen Proposal",
                description: "Mendisposisi proposal",
            },
            {
                name: "Lihat Disposisi Proposal",
                group: "Manajemen Proposal",
                description: "Melihat disposisi proposal",
            },
            {
                name: "Impor Proposal",
                group: "Manajemen Proposal",
                description: "Mengimpor proposal baru",
            },
            {
                name: "Ekspor Proposal",
                group: "Manajemen Proposal",
                description: "Mengekspor proposal",
            },

            // === NEWS MANAGEMENT ===
            {
                name: "Buat Berita",
                group: "Manajemen Berita",
                description: "Menambahkan berita baru",
            },
            {
                name: "Ubah Berita",
                group: "Manajemen Berita",
                description: "Mengubah data berita",
            },
            {
                name: "Hapus Berita",
                group: "Manajemen Berita",
                description: "Menghapus berita",
            },

            // === COMMISSION MANAGEMENT ===
            {
                name: "Lihat Komisi",
                group: "Manajemen komisi",
                description: "Melihat daftar komisi",
            },
            {
                name: "Buat Komisi",
                group: "Manajemen komisi",
                description: "Menambahkan komisi baru",
            },
            {
                name: "Ubah Komisi",
                group: "Manajemen komisi",
                description: "Mengubah data komisi",
            },
            {
                name: "Hapus Komisi",
                group: "Manajemen komisi",
                description: "Menghapus area",
            },

            // === POSITION MANAGEMENT ===
            {
                name: "Lihat Posisi",
                group: "Manajemen posisi",
                description: "Melihat daftar posisi",
            },
            {
                name: "Buat Posisi",
                group: "Manajemen posisi",
                description: "Menambahkan posisi baru",
            },
            {
                name: "Ubah Posisi",
                group: "Manajemen posisi",
                description: "Mengubah data posisi",
            },
            {
                name: "Hapus Posisi",
                group: "Manajemen posisi",
                description: "Menghapus area",
            },
        ],
        skipDuplicates: true,
    });

    console.log("✅ Permissions berhasil di-seed");

    // === 2. Seed Roles ===
    const adminRole = await prisma.role.upsert({
        where: { name: "Admin Sistem" },
        update: {},
        create: {
            name: "Admin Sistem",
            description: "Role dengan semua hak akses",
        },
    });

    console.log("✅ Role Admin Sistem berhasil dibuat");

    const rolesToCreate = [
        {
            name: "OPD",
            description: "Role OPD dengan akses penuh",
        },
        {
            name: "Sekretariat",
            description: "Role Sekretariat dengan akses penuh",
        },
        {
            name: "Anggota",
            description: "Role Anggota dengan akses penuh",
        },
    ];

    const createdRoles = [];
    for (const role of rolesToCreate) {
        const createdRole = await prisma.role.upsert({
            where: { name: role.name },
            update: {},
            create: role,
        });

        createdRoles.push(createdRole);
        console.log(`✅ Role ${role.name} berhasil dibuat`);
    }

    const allRoles = [adminRole, ...createdRoles];

    // === 3. Seed Role Permissions ===
    const allPermissions = await prisma.permission.findMany();

    for (const role of allRoles) {
        const existingRolePermissions = await prisma.rolePermission.findMany({
            where: { roleId: role.id },
        });

        const existingPermissionIds = new Set(
            existingRolePermissions.map((rp) => rp.permissionId)
        );

        const newRolePermissions = allPermissions
            .filter((p) => !existingPermissionIds.has(p.id))
            .map((p) => ({
                roleId: role.id,
                permissionId: p.id,
            }));

        if (newRolePermissions.length > 0) {
            await prisma.rolePermission.createMany({
                data: newRolePermissions,
                skipDuplicates: true,
            });

            console.log(
                `✅ Menambahkan ${newRolePermissions.length} permission ke role ${role.name}`
            );
        }
    }

    // === 4. Seed User Admin ===
    const adminEmail = "admin@mail.com";
    const hashedPassword = await bcrypt.hash("Password123!", 10);

    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            roleId: adminRole.id,
        },
    });

    await prisma.userProfile.upsert({
        where: { userId: adminUser.id },
        update: {},
        create: {
            userId: adminUser.id,
            name: "Administrator",
            phoneNumber: "081234567890",
        },
    });

    console.log("✅ User admin berhasil dibuat dengan email:", adminEmail);
    console.log("🔑 Password: Password123!");

    // === 5. Seed Area (Dapil) ===
    await prisma.area.createMany({
        data: [
            {
                code: 1,
                name: "Dapil 1 - Kota Bandar Lampung",
            },
            {
                code: 2,
                name: "Dapil 2 - Kabupaten Lampung Selatan",
            },
            {
                code: 3,
                name: "Dapil 3 - Kabupaten Pesawaran, Kabupaten Pringsewu, Kota Metro",
            },
            {
                code: 4,
                name: "Dapil 4 - Kabupaten Tanggamus, Kabupaten Lampung Barat, Kabupaten Pesisir Barat",
            },
            {
                code: 5,
                name: "Dapil 5 - Kabupaten Way Kanan, Kabupaten Lampung Utara",
            },
            {
                code: 6,
                name: "Dapil 6 - Kabupaten Mesuji, Kabupaten Tulang Bawang, Kabupaten Tulang Bawang Barat",
            },
            {
                code: 7,
                name: "Dapil 7 - Kabupaten Lampung Tengah",
            },
            {
                code: 8,
                name: "Dapil 8 - Kabupaten Lampung Timur",
            },
        ],
        skipDuplicates: true,
    });

    console.log("✅ Area (Dapil) berhasil di-seed");

    // === 6. Seed Kategori ===

    await prisma.category.createMany({
        data: [
            { name: "Infrastruktur" },
            { name: "Pendidikan" },
            { name: "Kesehatan" },
            { name: "Ekonomi/UMKM" },
            { name: "Pertanian/Perikanan" },
            { name: "Sosial & Keagamaan" },
            { name: "Lingkungan" },
            { name: "Lainnya (custom)" },
        ],
        skipDuplicates: true,
    });

    console.log("✅ Kategori berhasil di-seed");

    // === 7. Seed Komisi ===

    await prisma.commission.createMany({
        data: [
            { name: "Komisi I (Pemerintahan, Hukum, & Perizinan)" },
            { name: "Komisi II (Perekonomian)" },
            { name: "Komisi III (Keuangan)" },
            { name: "Komisi IV (Pembangunan)" },
            { name: "Komisi V (Kesejahteraan Rakyat)" },
        ],
        skipDuplicates: true,
    });

    console.log("✅ Komisi berhasil di-seed");

    // === 8. Seed General Users ===
    let users: any[] = [
        {
            name: "Budi Santoso",
            email: "budisantoso@gmail.com",
            password: "Budi2025",
        },
        {
            name: "Siti Aminah",
            email: "sitiaminah@gmail.com",
            password: "Siti2025",
        },
        {
            name: "Andi Pratama",
            email: "andipratama@gmail.com",
            password: "Andi2025",
        },
        {
            name: "Dewi Lestari",
            email: "dewilestari@gmail.com",
            password: "Dewi2025",
        },
        {
            name: "Agus Saputra",
            email: "agussaputra@gmail.com",
            password: "Agus2025",
        },
        {
            name: "Rina Marlina",
            email: "rinamarlina@gmail.com",
            password: "Rina2025",
        },
        {
            name: "Eko Wijaya",
            email: "ekowijaya@gmail.com",
            password: "Eko2025",
        },
        {
            name: "Sri Handayani",
            email: "srihandayani@gmail.com",
            password: "Sri2025",
        },
        {
            name: "Dedi Kurniawan",
            email: "dedikurniawan@gmail.com",
            password: "Dedi2025",
        },
        {
            name: "Fitri Ramadhani",
            email: "fitriramadhani@gmail.com",
            password: "Fitri2025",
        },
    ];

    for (const user of users) {
        const password = await bcrypt.hash(user.password, 10);

        const newUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                password: password,
            },
        });

        await prisma.userProfile.upsert({
            where: { userId: newUser.id },
            update: {},
            create: {
                userId: newUser.id,
                name: user.name,
            },
        });
    }

    // === 9. Seed OPD Users ===

    users = [
        {
            name: "Inspektorat Lampung",
            email: "insplpg@gmail.com",
            password: "insplpg2025",
        },
        {
            name: "Badan Perencanaan Daerah",
            email: "bappeda@gmail.com",
            password: "bappeda2025",
        },
        {
            name: "Sekretariat DPRD Lampung",
            email: "setdprd@gmail.com",
            password: "setdprd2025",
        },
        {
            name: "Badan Pengelolaan Keuangan dan Aset Daerah",
            email: "bpkad@gmail.com",
            password: "bpkad2025",
        },
        {
            name: "Badan Pendapatan Daerah Lampung",
            email: "bapenda@gmail.com",
            password: "bapenda2025",
        },
        {
            name: "Badan Kepegawaian Daerah Lampung",
            email: "bkd@gmail.com",
            password: "bkd2025",
        },
        {
            name: "Badan Pengembangan SDM Daerah",
            email: "bpsdm@gmail.com",
            password: "bpsdm2025",
        },
        {
            name: "Badan Penanggulangan Bencana Daerah",
            email: "bpbd@gmail.com",
            password: "bpbd2025",
        },
        {
            name: "Dinas Pendidikan dan Kebudayaan Lampung",
            email: "disdik@gmail.com",
            password: "disdik2025",
        },
        {
            name: "Dinas Pemuda dan Olahraga",
            email: "dispora@gmail.com",
            password: "dispora2025",
        },
        {
            name: "Dinas Kesehatan",
            email: "dinkes@gmail.com",
            password: "dinkes2025",
        },
        {
            name: "Dinas Sosial",
            email: "dinsos@gmail.com",
            password: "dinsos2025",
        },
        {
            name: "Dinas Perhubungan",
            email: "dishub@gmail.com",
            password: "dishub2025",
        },
        {
            name: "Dinas Perkebunan",
            email: "disbun@gmail.com",
            password: "disbun2025",
        },
        {
            name: "Dinas Kehutanan",
            email: "dishut@gmail.com",
            password: "dishut2025",
        },
        {
            name: "Dinas Bina Marga dan Bina Konstruksi",
            email: "dbmbk@gmail.com",
            password: "dbmbk2025",
        },
        {
            name: "Dinas Perindustrian dan Perdagangan",
            email: "disperindag@gmail.com",
            password: "disperindag2025",
        },
        {
            name: "Dinas Pemberdayaan Perempuan dan Perlindungan Anak",
            email: "dpppa@gmail.com",
            password: "dpppa2025",
        },
        {
            name: "Dinas Ketahanan Pangan, Tanaman Pangan dan Hortikultura",
            email: "dktph@gmail.com",
            password: "dktph2025",
        },
        {
            name: "Dinas Tenaga Kerja",
            email: "disnaker@gmail.com",
            password: "disnaker2025",
        },
        {
            name: "Dinas Energi dan Sumber Daya Mineral",
            email: "esdm@gmail.com",
            password: "esdm2025",
        },
        {
            name: "Dinas Kelautan dan Perikanan",
            email: "dkp@gmail.com",
            password: "dkp2025",
        },
        {
            name: "Dinas Pariwisata dan Ekonomi Kreatif",
            email: "dispar@gmail.com",
            password: "dispar2025",
        },
        {
            name: "Dinas Pengelolaan Sumber Daya Air",
            email: "dpsda@gmail.com",
            password: "dpsda2025",
        },
        {
            name: "Rumah Sakit Daerah Abdoel Moeloek",
            email: "rsam@gmail.com",
            password: "rsam2025",
        },
        {
            name: "Dinas Koperasi, Usaha Kecil dan Menengah Provinsi Lampung",
            email: "diskopukm@gmail.com",
            password: "diskopukm2025",
        },
        {
            name: "Dinas Komunikasi, Informasi dan Statistik",
            email: "diskominfotik@gmail.com",
            password: "diskominfotik2025",
        },
        {
            name: "Dinas Pemberdayaan Masyarakat Desa dan Transmigrasi",
            email: "dpmdt@gmail.com",
            password: "dpmdt2025",
        },
        {
            name: "PKK Provinsi Lampung",
            email: "pkk@gmail.com",
            password: "pkk2025",
        },
        {
            name: "Dinas Kependudukan dan Pencatatan Sipil",
            email: "dukcapil@gmail.com",
            password: "dukcapil2025",
        },
        {
            name: "Biro Pemerintahan dan Otonomi Daerah",
            email: "biro-pod@gmail.com",
            password: "biropod2025",
        },
        {
            name: "Biro Kesejahteraan Rakyat",
            email: "birokesra@gmail.com",
            password: "birokesra2025",
        },
        {
            name: "Biro Hukum",
            email: "birohukum@gmail.com",
            password: "birohukum2025",
        },
        {
            name: "Biro Ekonomi",
            email: "biroeko@gmail.com",
            password: "biroeko2025",
        },
        {
            name: "Biro Pengadaan Barang dan Jasa",
            email: "bpbj@gmail.com",
            password: "bpbj2025",
        },
        {
            name: "Biro Administrasi Pembangunan",
            email: "biroap@gmail.com",
            password: "BiroAP2025",
        },
        {
            name: "Biro Organisasi",
            email: "biroorg@gmail.com",
            password: "BiroOrg2025",
        },
        {
            name: "Biro Umum",
            email: "biroumum@gmail.com",
            password: "BiroUmum2025",
        },
        {
            name: "Biro Administrasi Pimpinan",
            email: "biroapim@gmail.com",
            password: "BiroAPim2025",
        },
        {
            name: "Dinas Perumahan, Kawasan Permukiman dan Cipta Karya",
            email: "dinaspkpck@gmail.com",
            password: "DinasPKPCK2025",
        },
        {
            name: "Satuan Polisi Pamong Praja",
            email: "satpolpp@gmail.com",
            password: "SatpolPP2025",
        },
        {
            name: "Dinas Lingkungan Hidup",
            email: "dlh@gmail.com",
            password: "DLH2025",
        },
        {
            name: "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu",
            email: "dpmptsp@gmail.com",
            password: "DPMPTSP2025",
        },
        {
            name: "Dinas Perpustakaan dan Kearsipan",
            email: "disarpus@gmail.com",
            password: "Disarpus2025",
        },
        {
            name: "Dinas Peternakan dan Kesehatan Hewan",
            email: "disnakkes@gmail.com",
            password: "Disnakkes2025",
        },
        {
            name: "Dinas Kehutanan",
            email: "dishut@gmail.com",
            password: "Dishut2025",
        },
        {
            name: "Badan Penelitian dan Pengembangan Daerah",
            email: "balitbangda@gmail.com",
            password: "Balitbangda2025",
        },
        {
            name: "Badan Kesatuan Bangsa dan Politik Daerah",
            email: "kesbangpol@gmail.com",
            password: "Kesbangpol2025",
        },
        {
            name: "Badan Penghubung Provinsi Lampung di Jakarta",
            email: "bapenglampung@gmail.com",
            password: "Bapeng2025",
        },
        {
            name: "Rumah Sakit Jiwa",
            email: "rsj@gmail.com",
            password: "RSJ2025",
        },
    ];

    const opdRole = await prisma.role.findFirst({ where: { name: "OPD" } });

    for (const user of users) {
        const password = await bcrypt.hash(user.password, 10);

        const newUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                password: password,
                roleId: opdRole?.id,
            },
        });

        await prisma.userProfile.upsert({
            where: { userId: newUser.id },
            update: {},
            create: {
                userId: newUser.id,
                name: user.name,
            },
        });
    }

    // === 10. Seed Fractions ===

    let fractions: { name: string; object: any }[] = [
        {
            name: "PARTAI DEMOKRAT",
            object: null,
        },
        {
            name: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
            object: null,
        },
        {
            name: "PARTAI KEBANGKITAN BANGSA (PKB)",
            object: null,
        },
        {
            name: "PARTAI KEADILAN SEJAHTERA (PKS)",
            object: null,
        },
        {
            name: "PARTAI AMANAT NASIONAL (PAN)",
            object: null,
        },
        {
            name: "PARTAI GOLKAR",
            object: null,
        },
        {
            name: "PARTAI NASDEM",
            object: null,
        },
        {
            name: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
            object: null,
        },
    ];

    for (let index = 0; index < fractions.length; index++) {
        const fraction = fractions[index];
        fractions[index].object = await prisma.fraction.upsert({
            where: { name: fraction.name },
            update: {},
            create: {
                name: fraction.name,
            },
        });
    }

    // === 11. Seed DPRD Users ===

    users = [
        {
            name: "YOZI RIZAL, S.H.",
            email: "yozi.rizal@gmail.com",
            password: "yozi.rizalangka2025",
            fraction: "PARTAI DEMOKRAT",
        },
        {
            name: "MUHAMMAD JUNAIDI",
            email: "muhammad.junaidi@gmail.com",
            password: "muhammad.junaidiangka2025",
            fraction: "PARTAI DEMOKRAT",
        },
        {
            name: "ANGGA SATRIA PRATAMA, S.I.KOM., M.B.A.",
            email: "angga.satria.pratama@gmail.com",
            password: "angga.satria.pratamaangka2025",
            fraction: "PARTAI DEMOKRAT",
        },
        {
            name: "HI. BUDIMAN AS",
            email: "budiman.as@gmail.com",
            password: "budiman.asangka2025",
            fraction: "PARTAI DEMOKRAT",
        },
        {
            name: "HI. AMALUDDIN, S.H.",
            email: "amaluddin@gmail.com",
            password: "amaluddinangka2025",
            fraction: "PARTAI DEMOKRAT",
        },
        {
            name: "DENI RIBOWO, S.E.",
            email: "deni.ribowo@gmail.com",
            password: "deni.ribowoangka2025",
            fraction: "PARTAI DEMOKRAT",
        },
        {
            name: "HANIFAL, S.P.",
            email: "hanifal@gmail.com",
            password: "hanifalangka2025",
            fraction: "PARTAI DEMOKRAT",
        },
        {
            name: "H. SINGA ERSA AWANGGA",
            email: "singa.ersa.awangga@gmail.com",
            password: "singa.ersa.awanggaangka2025",
            fraction: "PARTAI DEMOKRAT",
        },
        {
            name: "MUHAMMAD KHADAFI AZWAR",
            email: "muhammad.khadafi.azwar@gmail.com",
            password: "muhammad.khadafi.azwarangka2025",
            fraction: "PARTAI DEMOKRAT",
        },
        {
            name: "H. FAHRORROZI, S.T., M.M.",
            email: "fahrorrozi@gmail.com",
            password: "fahrorroziangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "DRS. H. MIKDAR ILYAS, M.M.",
            email: "mikdar.ilyas@gmail.com",
            password: "mikdar.ilyasangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "IKHWAN FADIL IBRAHIM, S.H.",
            email: "ikhwan.fadil.ibrahim@gmail.com",
            password: "ikhwan.fadil.ibrahimangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "INTAN REHANA, S.KED.",
            email: "intan.rehana@gmail.com",
            password: "intan.rehanaangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "AHMAD GIRI AKBAR, S.E., M.B.A.",
            email: "ahmad.giri.akbar@gmail.com",
            password: "ahmad.giri.akbarangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "MOHAMMAD REZA",
            email: "mohammad.reza@gmail.com",
            password: "mohammad.rezaangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "HJ. ELLY WAHYUNI, S.E., M.M.",
            email: "elly.wahyuni@gmail.com",
            password: "elly.wahyuniangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "DRS. MUKHLIS BASRI, M.SI.",
            email: "mukhlis.basri@gmail.com",
            password: "mukhlis.basriangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "DR. MIRZALIE, S.S., S.H., M.KN.",
            email: "mirzalie@gmail.com",
            password: "mirzalieangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "I MADE SUARJAYA, S.H.",
            email: "imade.suarjaya@gmail.com",
            password: "imade.suarjayaangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "VERI AGUSLI HTB, S.E.",
            email: "veri.agusli@gmail.com",
            password: "veri.agusliangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "ANDIKA WIBAWA SEPULAU RAYA, S.E.",
            email: "andika.wibawa@gmail.com",
            password: "andika.wibawaangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "WAHRUL FAUZI SILALAHI, S.H.",
            email: "wahrul.fauzi@gmail.com",
            password: "wahrul.fauziangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "H. FAUZI HERI, S.T., S.H., M.H.",
            email: "fauzi.heri@gmail.com",
            password: "fauzi.heriangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "GALANG PUTRA RAHMAN",
            email: "galang.putra@gmail.com",
            password: "galang.putraangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "RAHMAT VISA RIDI ARIFIN",
            email: "rahmat.visa@gmail.com",
            password: "rahmat.visaangka2025",
            fraction: "PARTAI GERAKAN INDONESIA RAYA (GERINDRA)",
        },
        {
            name: "FATIKHÁTUL KHOIRIYAH, S.H.I., M.H.",
            email: "fatikhatul.khoiriyah@gmail.com",
            password: "fatikhatul.khoiriyahangka2025",
            fraction: "PARTAI KEBANGKITAN BANGSA (PKB)",
        },
        {
            name: "DR. SASA CHALIM, M.M.",
            email: "sasa.chalim@gmail.com",
            password: "sasa.chalimangka2025",
            fraction: "PARTAI KEBANGKITAN BANGSA (PKB)",
        },
        {
            name: "H. AHMAD BASUKI, M.PD.",
            email: "ahmad.basuki@gmail.com",
            password: "ahmad.basukiangka2025",
            fraction: "PARTAI KEBANGKITAN BANGSA (PKB)",
        },
        {
            name: "NAJIULLAH SYARIF, S.T., M.T.",
            email: "najiullah.syarif@gmail.com",
            password: "najiullah.syarifangka2025",
            fraction: "PARTAI KEBANGKITAN BANGSA (PKB)",
        },
        {
            name: "H. TAUFIK RAHMAN, S.AG.",
            email: "taufik.rahman@gmail.com",
            password: "taufik.rahmanangka2025",
            fraction: "PARTAI KEBANGKITAN BANGSA (PKB)",
        },
        {
            name: "MAULIDAH ZAUROH, M.A.PD.",
            email: "maulidah.zauroh@gmail.com",
            password: "maulidah.zaurohangka2025",
            fraction: "PARTAI KEBANGKITAN BANGSA (PKB)",
        },
        {
            name: "BUDI HADI YUNANTO",
            email: "budi.hadi@gmail.com",
            password: "budi.hadiangka2025",
            fraction: "PARTAI KEBANGKITAN BANGSA (PKB)",
        },
        {
            name: "HANIFAH, S.E.",
            email: "hanifah@gmail.com",
            password: "hanifahangka2025",
            fraction: "PARTAI KEBANGKITAN BANGSA (PKB)",
        },
        {
            name: "MUNIR ABDUL HARIS, S.SOS.I",
            email: "munir.haris@gmail.com",
            password: "munir.harisangka2025",
            fraction: "PARTAI KEBANGKITAN BANGSA (PKB)",
        },
        {
            name: "ABDUL AZIZ",
            email: "abdul.aziz@gmail.com",
            password: "abdul.azizangka2025",
            fraction: "PARTAI KEBANGKITAN BANGSA (PKB)",
        },
        {
            name: "SEH AJEMAN, S.AG.",
            email: "seh.ajeman@gmail.com",
            password: "seh.ajemanangka2025",
            fraction: "PARTAI KEBANGKITAN BANGSA (PKB)",
        },
        {
            name: "H. ADE UTAMI IBNU, S.E.",
            email: "ade.utami@gmail.com",
            password: "ade.utamiangka2025",
            fraction: "PARTAI KEADILAN SEJAHTERA (PKS)",
        },
        {
            name: "H. YUSNADI, S.T.",
            email: "yusnadi@gmail.com",
            password: "yusnadiangka2025",
            fraction: "PARTAI KEADILAN SEJAHTERA (PKS)",
        },
        {
            name: "M. SYUKRON MUCHTAR, LC., M.AG.",
            email: "syukron.muchtar@gmail.com",
            password: "syukron.muchtarangka2025",
            fraction: "PARTAI KEADILAN SEJAHTERA (PKS)",
        },
        {
            name: "MUHAMMAD GHOFUR, S.SI.",
            email: "muhammad.ghofur@gmail.com",
            password: "muhammad.ghofurangka2025",
            fraction: "PARTAI KEADILAN SEJAHTERA (PKS)",
        },
        {
            name: "H. AMRULLAH BS",
            email: "amrullah.bs@gmail.com",
            password: "amrullah.bsangka2025",
            fraction: "PARTAI KEADILAN SEJAHTERA (PKS)",
        },
        {
            name: "H. HENI SUSILO, S.PD., M.PD.",
            email: "heni.susilo@gmail.com",
            password: "heni.susiloangka2025",
            fraction: "PARTAI KEADILAN SEJAHTERA (PKS)",
        },
        {
            name: "H. PUJI SARTONO, S.H., S.KEP.",
            email: "puji.sartono@gmail.com",
            password: "puji.sartonoangka2025",
            fraction: "PARTAI KEADILAN SEJAHTERA (PKS)",
        },
        {
            name: "H. M. HAZIZI, S.E.",
            email: "hazizi@gmail.com",
            password: "haziziangka2025",
            fraction: "PARTAI AMANAT NASIONAL (PAN)",
        },
        {
            name: "H. ABDULLAH SURA JAYA, S.H., M.H.",
            email: "abdullah.sura@gmail.com",
            password: "abdullah.suraangka2025",
            fraction: "PARTAI AMANAT NASIONAL (PAN)",
        },
        {
            name: "H. AKHMAD ISWAN HENDI CAYA, S.H., M.H.",
            email: "iswan.hendi@gmail.com",
            password: "iswan.hendiangka2025",
            fraction: "PARTAI AMANAT NASIONAL (PAN)",
        },
        {
            name: "ANDRIANO DWIKI AGUSTA, S.SN.",
            email: "andriano.dwiki@gmail.com",
            password: "andriano.dwikiangka2025",
            fraction: "PARTAI AMANAT NASIONAL (PAN)",
        },
        {
            name: "H. YUSIRWAN, S.E., M.H.",
            email: "yusirwan@gmail.com",
            password: "yusirwanangka2025",
            fraction: "PARTAI AMANAT NASIONAL (PAN)",
        },
        {
            name: "IMELDA, S.H.",
            email: "imelda@gmail.com",
            password: "imeldaangka2025",
            fraction: "PARTAI AMANAT NASIONAL (PAN)",
        },
        {
            name: "H. MORISWAN, S.T.",
            email: "moriswan@gmail.com",
            password: "moriswanangka2025",
            fraction: "PARTAI AMANAT NASIONAL (PAN)",
        },
        {
            name: "HJ. DIAH DHARMA YANTI, S.H.",
            email: "diah.dharma@gmail.com",
            password: "diah.dharmaangka2025",
            fraction: "PARTAI AMANAT NASIONAL (PAN)",
        },
        {
            name: "HI. SUPRIADI HAMZAH, S.H.",
            email: "supriadi.hamzah@gmail.com",
            password: "supriadi.hamzahangka2025",
            fraction: "PARTAI GOLKAR",
        },
        {
            name: "AGUS SUTANTO, S.T.",
            email: "agus.sutanto@gmail.com",
            password: "agus.sutantoangka2025",
            fraction: "PARTAI GOLKAR",
        },
        {
            name: "H. ISMET RONI, S.H., M.H.",
            email: "ismet.roni@gmail.com",
            password: "ismet.roniangka2025",
            fraction: "PARTAI GOLKAR",
        },
        {
            name: "H. ARNOL, S.H.",
            email: "arnol@gmail.com",
            password: "arnolangka2025",
            fraction: "PARTAI GOLKAR",
        },
        {
            name: "H. PUTRA JAYA UMAR",
            email: "putra.jaya@gmail.com",
            password: "putra.jayaangka2025",
            fraction: "PARTAI GOLKAR",
        },
        {
            name: "H. HANDITYA NARAPATI SZP, S.H.",
            email: "handitya.narapati@gmail.com",
            password: "handitya.narapatiangka2025",
            fraction: "PARTAI GOLKAR",
        },
        {
            name: "TONDI MUAMMAR GADDAFI NASUTION, S.T.",
            email: "tondi.muammar@gmail.com",
            password: "tondi.muammarangka2025",
            fraction: "PARTAI GOLKAR",
        },
        {
            name: "ELSAN TOMI SAGITA",
            email: "elsan.tomi@gmail.com",
            password: "elsan.tomiangka2025",
            fraction: "PARTAI GOLKAR",
        },
        {
            name: "MARSHA DHITA PYTALOKA, S.I.P.",
            email: "marsha.dhita@gmail.com",
            password: "marsha.dhitaangka2025",
            fraction: "PARTAI GOLKAR",
        },
        {
            name: "ADHITIA PRATAMA, S.H., M.H.",
            email: "adhitia.pratama@gmail.com",
            password: "adhitia.pratamaangka2025",
            fraction: "PARTAI GOLKAR",
        },
        {
            name: "MUSTIKA BAHRUM, S.E., M.M.",
            email: "mustika.bahrum@gmail.com",
            password: "mustika.bahrumangka2025",
            fraction: "PARTAI GOLKAR",
        },
        {
            name: "H. FAUZAN SIBRÓN, S.E., A.KT.",
            email: "fauzan.sibron@gmail.com",
            password: "fauzan.sibronangka2025",
            fraction: "PARTAI NASDEM",
        },
        {
            name: "H. GARINCA REZA PAHLÉVI, S.I.KOM., M.M.",
            email: "garinca.reza@gmail.com",
            password: "garinca.rezaangka2025",
            fraction: "PARTAI NASDEM",
        },
        {
            name: "MARDIANA, S.T., M.T.",
            email: "mardiana@gmail.com",
            password: "mardianaangka2025",
            fraction: "PARTAI NASDEM",
        },
        {
            name: "NURIL ANWAR, S.SOS.",
            email: "nuril.anwar@gmail.com",
            password: "nuril.anwarangka2025",
            fraction: "PARTAI NASDEM",
        },
        {
            name: "BUDI YUHANDA, S.H., M.KN.",
            email: "budi.yuhanda@gmail.com",
            password: "budi.yuhandaangka2025",
            fraction: "PARTAI NASDEM",
        },
        {
            name: "YUDHA AL HADJID",
            email: "yudha.hadjid@gmail.com",
            password: "yudha.hadjidangka2025",
            fraction: "PARTAI NASDEM",
        },
        {
            name: "DRS. H. JASRONI, M.M.",
            email: "jasroni@gmail.com",
            password: "jasroniangka2025",
            fraction: "PARTAI NASDEM",
        },
        {
            name: "H. MISWAN RODY, S.IP.",
            email: "miswan.rody@gmail.com",
            password: "miswan.rodyangka2025",
            fraction: "PARTAI NASDEM",
        },
        {
            name: "NALDI RINARA S. RIZAL, S.E., M.M.",
            email: "naldi.rinara@gmail.com",
            password: "naldi.rinaraangka2025",
            fraction: "PARTAI NASDEM",
        },
        {
            name: "YUSEE, S.H.",
            email: "yusee@gmail.com",
            password: "yuseeangka2025",
            fraction: "PARTAI NASDEM",
        },
        {
            name: "LESTY PUTRI UTAMI, S.H., M.KN.",
            email: "lesty.putri@gmail.com",
            password: "lesty.putriangka2025",
            fraction: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
        },
        {
            name: "BUDHI CONNDROWATI, S.E.",
            email: "budhi.condrowati@gmail.com",
            password: "budhi.condrowatiangka2025",
            fraction: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
        },
        {
            name: "KETUT RAMEO",
            email: "ketut.rameo@gmail.com",
            password: "ketut.rameoangka2025",
            fraction: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
        },
        {
            name: "FERLISKA RAMADHITA JOHAN, S.H.",
            email: "ferliska.ramadhita@gmail.com",
            password: "ferliska.ramadhitaangka2025",
            fraction: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
        },
        {
            name: "NI KETUT DEWI NADI, S.T.",
            email: "dewi.nadi@gmail.com",
            password: "dewi.nadiangka2025",
            fraction: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
        },
        {
            name: "KOSTIANA, S.E., M.H.",
            email: "kostiana@gmail.com",
            password: "kostianaangka2025",
            fraction: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
        },
        {
            name: "DR. H. YANUAR IRAWAN, S.E., M.M.",
            email: "yanuar.irawan@gmail.com",
            password: "yanuar.irawanangka2025",
            fraction: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
        },
        {
            name: "ARIBUN SAYUNIS, S.SOS., M.M.",
            email: "aribun.sayunis@gmail.com",
            password: "aribun.sayunisangka2025",
            fraction: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
        },
        {
            name: "SHOLIHIN, S.PD., M.H.",
            email: "sholihin@gmail.com",
            password: "sholihinangka2025",
            fraction: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
        },
        {
            name: "ANDY ROBY, S.H.",
            email: "andy.roby@gmail.com",
            password: "andy.robyangka2025",
            fraction: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
        },
        {
            name: "H. AM. SYAFI’I, S.AG.",
            email: "am.syafii@gmail.com",
            password: "am.syafiiangka2025",
            fraction: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
        },
        {
            name: "SAHDANA, S.PD.",
            email: "sahdana@gmail.com",
            password: "sahdanaangka2025",
            fraction: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
        },
        {
            name: "H. EDWARD RASYID, S.E.",
            email: "edward.rasyid@gmail.com",
            password: "edward.rasyidangka2025",
            fraction: "PARTAI DEMOKRASI INDONESIA PERJUANGAN (PDI PERJUANGAN)",
        },
    ];

    const memberRole = await prisma.role.findFirst({
        where: { name: "Anggota" },
    });

    for (const user of users) {
        const password = await bcrypt.hash(user.password, 10);

        const newUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                password: password,
                roleId: memberRole?.id,
            },
        });

        await prisma.userProfile.upsert({
            where: { userId: newUser.id },
            update: {},
            create: {
                userId: newUser.id,
                name: user.name,
            },
        });
    }

    // === 12. Seed Dummy Proposal untuk Tahun Ini & Tahun Lalu ===

    // Ambil data pendukung
    // const admin = await prisma.user.findFirst({ where: { email: adminEmail } });
    // const areas = await prisma.area.findMany();
    // const categories = await prisma.category.findMany();

    // if (!admin || areas.length === 0) {
    //     console.log("❌ Gagal seeding proposal: user/area/category tidak lengkap");
    // } else {
    //     const statuses = [
    //         ProposalStatusEnum.baru,
    //         ProposalStatusEnum.diproses,
    //         ProposalStatusEnum.selesai,
    //     ];

    //     const currentYear = new Date().getFullYear();
    //     const yearsToSeed = [currentYear, currentYear - 1];

    //     const proposalsToInsert: any[] = [];

    //     for (const year of yearsToSeed) {
    //         for (let i = 1; i <= 20; i++) {
    //             const randomArea = areas[Math.floor(Math.random() * areas.length)];
    //             const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    //             const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    //             // buat tanggal random per tahun
    //             const randomMonth = Math.floor(Math.random() * 12); // 0–11
    //             const randomDay = Math.floor(Math.random() * 28) + 1;
    //             const createdAt = new Date(year, randomMonth, randomDay);

    //             proposalsToInsert.push({
    //                 userId: admin.id,
    //                 areaId: randomArea.id,
    //                 categoryId: randomCategory.id,
    //                 status: randomStatus,
    //                 title: `Proposal Dummy ${i} - Tahun ${year}`,
    //                 description: `Deskripsi dummy untuk proposal nomor ${i} di tahun ${year}.`,
    //                 createdAt,
    //                 updatedAt: createdAt,
    //             });
    //         }
    //     }

    //     await prisma.proposal.createMany({
    //         data: proposalsToInsert,
    //     });

    //     console.log(`✅ Dummy Proposal berhasil dibuat untuk tahun ${currentYear} dan ${currentYear - 1} (total ${proposalsToInsert.length})`);
    // }
}

main()
    .then(() => console.log("🎉 Seeding selesai"))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
