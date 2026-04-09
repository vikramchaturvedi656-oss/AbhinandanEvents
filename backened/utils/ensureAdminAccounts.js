import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import {
  allowedAdminAccounts,
  allowedAdminEmailSet,
  normalizeAdminEmail,
} from "./adminWhitelist.js";

async function ensureAdminAccounts() {
  const existingIndexes = await Admin.collection.indexes().catch(() => []);
  const hasLegacyUserIdIndex = existingIndexes.some(
    (index) => index.name === "userId_1"
  );

  if (hasLegacyUserIdIndex) {
    await Admin.collection.dropIndex("userId_1");
  }

  await Admin.updateMany(
    {},
    {
      $unset: { userId: "" },
    }
  );

  await User.deleteMany({
    email: { $in: Array.from(allowedAdminEmailSet) },
  });

  for (const adminAccount of allowedAdminAccounts) {
    const hashedPassword = await bcrypt.hash(adminAccount.password, 12);
    const email = normalizeAdminEmail(adminAccount.email);

    await Admin.findOneAndUpdate(
      { email },
      {
        name: adminAccount.name,
        email,
        phone: adminAccount.phone,
        password: hashedPassword,
        isActive: true,
        permissions: adminAccount.permissions,
      },
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
  }
}

export default ensureAdminAccounts;
