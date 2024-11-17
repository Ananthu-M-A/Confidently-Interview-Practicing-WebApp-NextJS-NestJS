import { Button } from "./ui/button";

export default function Header() {
  return (
    <>
      <div className="p-3 border-b border-black flex justify-between">
        <h1 className="text-3xl font-semibold">Confidently</h1>
        <div className="flex gap-4">
          <Button variant="outline" className="border border-black font-bold">Log In</Button>
          <Button className="font-bold">Sign Up</Button>
        </div>
      </div>
    </>
  );
}
