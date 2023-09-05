import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex justify-center items-center h-[100vh] w-full bg-gradient-to-r from-white via-emerald-400 to-white" ><SignUp signInUrl="/sign-in" /></div>);
}