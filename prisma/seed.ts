import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Menjalankan seeding data...");

    // === 1. Seed Permissions ===
    await prisma.permission.createMany({
        data: [
            // === USER MANAGEMENT ===
            { name: "Lihat Pengguna", group: "Manajemen Pengguna", description: "Melihat daftar pengguna" },
            { name: "Lihat Detail Pengguna", group: "Manajemen Pengguna", description: "Melihat data pengguna tertentu" },
            { name: "Buat Pengguna", group: "Manajemen Pengguna", description: "Membuat pengguna baru" },
            { name: "Ubah Pengguna", group: "Manajemen Pengguna", description: "Mengubah data pengguna" },
            { name: "Hapus Pengguna", group: "Manajemen Pengguna", description: "Menghapus pengguna" },

            // === USER PROFILE MANAGEMENT ===
            { name: "Buat Profil Pengguna", group: "Manajemen Profil Pengguna", description: "Membuat profil pengguna baru" },
            { name: "Ubah Profil Pengguna", group: "Manajemen Profil Pengguna", description: "Mengubah data profil pengguna" },

            // === ROLE MANAGEMENT ===
            { name: "Lihat Peran", group: "Manajemen Peran", description: "Melihat daftar peran" },
            { name: "Lihat Detail Peran", group: "Manajemen Peran", description: "Melihat data peran tertentu" },
            { name: "Buat Peran", group: "Manajemen Peran", description: "Menambahkan peran baru" },
            { name: "Ubah Peran", group: "Manajemen Peran", description: "Mengubah data peran" },
            { name: "Hapus Peran", group: "Manajemen Peran", description: "Menghapus peran" },

            // === ROLE PERMISSION MANAGEMENT ===
            { name: "Lihat Hak Akses Peran", group: "Manajemen Hak Akses Peran", description: "Melihat daftar hak akses per peran" },
            { name: "Tambah Hak Akses Peran", group: "Manajemen Hak Akses Peran", description: "Menambahkan hak akses ke peran" },
            { name: "Tambah Banyak Hak Akses Peran", group: "Manajemen Hak Akses Peran", description: "Menambahkan beberapa hak akses ke peran sekaligus" },
            { name: "Hapus Hak Akses Peran", group: "Manajemen Hak Akses Peran", description: "Menghapus hak akses dari peran" },

            // === PERMISSION MANAGEMENT ===
            { name: "Lihat Hak Akses", group: "Manajemen Hak Akses", description: "Melihat daftar seluruh hak akses" },

            // === AREA MANAGEMENT ===
            { name: "Lihat Area", group: "Manajemen Area", description: "Melihat daftar area" },
            { name: "Lihat Detail Area", group: "Manajemen Area", description: "Melihat data area tertentu" },
            { name: "Buat Area", group: "Manajemen Area", description: "Menambahkan area baru" },
            { name: "Ubah Area", group: "Manajemen Area", description: "Mengubah data area" },
            { name: "Hapus Area", group: "Manajemen Area", description: "Menghapus area" },

            // === FRACTION MANAGEMENT ===
            { name: "Lihat Fraksi", group: "Manajemen Fraksi", description: "Melihat daftar fraksi" },
            { name: "Lihat Detail Fraksi", group: "Manajemen Fraksi", description: "Melihat data fraksi tertentu" },
            { name: "Buat Fraksi", group: "Manajemen Fraksi", description: "Menambahkan fraksi baru" },
            { name: "Ubah Fraksi", group: "Manajemen Fraksi", description: "Mengubah data fraksi" },
            { name: "Hapus Fraksi", group: "Manajemen Fraksi", description: "Menghapus fraksi" },

            // === USER ACCESS MANAGEMENT ===
            { name: "Lihat Akses Pengguna", group: "Manajemen Akses Pengguna", description: "Melihat daftar akses pengguna" },
            { name: "Lihat Detail Akses Pengguna", group: "Manajemen Akses Pengguna", description: "Melihat detail akses pengguna" },
            { name: "Buat Akses Pengguna", group: "Manajemen Akses Pengguna", description: "Menambahkan akses pengguna baru" },
            { name: "Ubah Akses Pengguna", group: "Manajemen Akses Pengguna", description: "Mengubah data akses pengguna" },
            { name: "Hapus Akses Pengguna", group: "Manajemen Akses Pengguna", description: "Menghapus akses pengguna" },

            // === CATEGORY MANAGEMENT ===
            { name: "Lihat Kategori", group: "Manajemen Kategori", description: "Melihat daftar kategori" },
            { name: "Lihat Detail Kategori", group: "Manajemen Kategori", description: "Melihat detail kategori" },
            { name: "Buat Kategori", group: "Manajemen Kategori", description: "Menambahkan kategori baru" },
            { name: "Ubah Kategori", group: "Manajemen Kategori", description: "Mengubah data kategori" },
            { name: "Hapus Kategori", group: "Manajemen Kategori", description: "Menghapus kategori" },

            // === PROPOSAL MANAGEMENT ===
            { name: "Lihat Proposal", group: "Manajemen Proposal", description: "Melihat daftar proposal" },
            { name: "Lihat Detail Proposal", group: "Manajemen Proposal", description: "Melihat data proposal tertentu" },
            { name: "Buat Proposal", group: "Manajemen Proposal", description: "Menambahkan proposal baru" },
            { name: "Ubah Proposal", group: "Manajemen Proposal", description: "Mengubah data proposal" },
            { name: "Hapus Proposal", group: "Manajemen Proposal", description: "Menghapus proposal" },
            { name: "Disposisi Proposal", group: "Manajemen Proposal", description: "Mendisposisi proposal" },
            { name: "Selesaikan Disposisi Proposal", group: "Manajemen Proposal", description: "Menyelesaikan disposisi proposal" },
        ],
        skipDuplicates: true,
    });

    console.log("✅ Permissions berhasil di-seed");

    // === 2. Seed Role Admin ===
    const adminRole = await prisma.role.upsert({
        where: { name: "Admin" },
        update: {},
        create: {
            name: "Admin",
            description: "Role dengan semua hak akses",
        },
    });

    console.log("✅ Role Admin berhasil dibuat");

    // === 3. Assign Semua Permission ke Role Admin ===
    const allPermissions = await prisma.permission.findMany();
    const existingRolePermissions = await prisma.rolePermission.findMany({
        where: { roleId: adminRole.id },
    });

    const existingPermissionIds = new Set(
        existingRolePermissions.map((rp) => rp.permissionId)
    );

    const newRolePermissions = allPermissions
        .filter((p) => !existingPermissionIds.has(p.id))
        .map((p) => ({
            roleId: adminRole.id,
            permissionId: p.id,
        }));

    if (newRolePermissions.length > 0) {
        await prisma.rolePermission.createMany({ data: newRolePermissions });
        console.log(`✅ Menambahkan ${newRolePermissions.length} permission ke Admin`);
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