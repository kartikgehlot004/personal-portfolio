import { AdminContext } from "@/components/AdminProvider";
import { useContext } from "react";

export { AdminContext };
export function useAdmin() {
  return useContext(AdminContext);
}
