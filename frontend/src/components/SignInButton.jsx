import { signIn } from "@/auth";
import Image from "next/image";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-3 bg-red-400 rounded-lg p-3 text-white hover:bg-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          width={20}
          height={20}
        />
        Sign in with Google
      </button>
    </form>
  );
}