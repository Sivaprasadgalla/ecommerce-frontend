import { v4 as uuidv4 } from "uuid";

export const getGuestSessionId = () => {
  if (typeof window === "undefined") return null;

  let guestId = localStorage.getItem("guestSessionId");

  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem("guestSessionId", guestId);
  }

  return guestId;
};

export const clearGuestSessionId = () => {
  localStorage.removeItem("guestSessionId");
};
