import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export default function NotFound() {
  return (
    <Card className="flex justify-center text-center border-0 shadow-none">
      <CardHeader className="my-20 p-20">
        <CardTitle className="text-4xl" role="alert">
          404 | Not Found
        </CardTitle>
        <CardDescription>
          The page you requested does not exist.
        </CardDescription>
        <Link href="/user" className="mt-4 text-blue-600 hover:underline">
          Return to Home
        </Link>
      </CardHeader>
    </Card>
  );
}