import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <>
      <div className="p-3 border-b border-black flex justify-between">
        <h1 className="text-3xl font-semibold">
          <Link href={"/"}>Confidently</Link>
        </h1>
        <div className="flex gap-4">
          <Button variant="outline" className="border border-black font-bold">
            <Link href={"/login"}>Log In</Link>
          </Button>
          <Button className="font-bold">
            <Link href={"/register"}>Sign Up</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
