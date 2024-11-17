import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="p-5 flex justify-center h-screen">
      <div className="w-1/3 border border-black rounded p-5">
        <LoginForm />
      </div>
    </div>
  );
}
