import db from "../db.server";
export async function getUpsellItems() {
  return db.upsellItem.findMany({
    orderBy: {
      updatedAt: "desc" // optional, order by updatedAt
    }
  });
}
