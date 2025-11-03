import prisma from "../src/libs/prisma";

async function main() {
    await prisma.permission.createMany({
        data: [
            {
                name: "CREATE_USER",
                group: "USER_MANAGEMENT",
                description: "Permission untuk membuat user baru",
            },
            {
                name: "UPDATE_USER",
                group: "USER_MANAGEMENT",
                description: "Permission untuk mengubah data user",
            },
            {
                name: "DELETE_USER",
                group: "USER_MANAGEMENT",
                description: "Permission untuk menghapus user",
            },
            {
                name: "VIEW_USER",
                group: "USER_MANAGEMENT",
                description: "Permission untuk melihat daftar user",
            },
            {
                name: "CREATE_PROPOSAL",
                group: "PROPOSAL_MANAGEMENT",
                description: "Permission untuk membuat proposal baru",
            },
            {
                name: "APPROVE_PROPOSAL",
                group: "PROPOSAL_MANAGEMENT",
                description: "Permission untuk menyetujui proposal",
            },
            {
                name: "REJECT_PROPOSAL",
                group: "PROPOSAL_MANAGEMENT",
                description: "Permission untuk menolak proposal",
            },
        ],
        skipDuplicates: true, // agar tidak error kalau sudah ada
    });

    console.log("✅ Dummy permissions berhasil di-seed");
}

main()
    .catch((e) => {
        console.error("❌ Error saat seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
