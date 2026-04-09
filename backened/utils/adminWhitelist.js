export const allowedAdminAccounts = [
  {
    name: "Altamash Malik",
    email: "altamashmalik369@gmail.com",
    password: "611812655",
    phone: "9999000001",
    permissions: ["MANAGE_USERS", "MANAGE_VENDORS", "MANAGE_ADMINS"],
  },
  {
    name: "Vikram Kumar Chaturvedi",
    email: "vkc@gmail.com",
    password: "!@#$%^&*()",
    phone: "9999000002",
    permissions: ["MANAGE_USERS", "MANAGE_VENDORS", "MANAGE_ADMINS"],
  },
];

export const normalizeAdminEmail = (email = "") =>
  String(email).trim().toLowerCase();

export const allowedAdminEmailSet = new Set(
  allowedAdminAccounts.map((account) => normalizeAdminEmail(account.email))
);

export const isAllowedAdminEmail = (email = "") =>
  allowedAdminEmailSet.has(normalizeAdminEmail(email));

export const getAllowedAdminByEmail = (email = "") =>
  allowedAdminAccounts.find(
    (account) => normalizeAdminEmail(account.email) === normalizeAdminEmail(email)
  );
