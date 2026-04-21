"use client"
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSignout = () => {
    const router = useRouter();
 const handleSignout = async function signOut() {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        router.push("/"); // redirect to login page
        toast.success("Signed out SuccessFully")
      },
      onError: () => {
        toast.error("Signed out Failed")
      }
    },
  });
}

return {handleSignout}
}