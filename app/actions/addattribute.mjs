import { prisma } from "@/lib/prisma"


async function updateRecords() {
  const updatedRecords = await prisma.kiosk.updateMany({
    where: {
      kioskMatricule: null, // or any condition to filter records
    },
    data: {
        kioskMatricule: "K-000-0000-000", // Set your default value here
    },
  });

  console.log(`Updated ${updatedRecords.count} records.`);
}

updateRecords()
  .catch(e => console.error(e))