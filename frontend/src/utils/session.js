export const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("ae_user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

export const clearStoredUser = () => {
  localStorage.removeItem("ae_user");
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("userLogin"));
};

export const getDashboardPath = (role) => {
  switch (role) {
    case "Admin":
      return "/admin-dashboard";
    case "Vendor":
      return "/planner-dashboard";
    default:
      return "/client-dashboard";
  }
};
