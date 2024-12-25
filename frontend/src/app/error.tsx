"use client"
import { useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Errors } from "@/interfaces/error.interface";

export default function ErrorBoundary({ error }: Errors) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <Card className="flex justify-center text-center border-0 shadow-none">
      <CardHeader className="my-20 p-20">
        <CardTitle className="text-4xl" role="alert">
          {error.name}
        </CardTitle>
        <CardDescription>
          {error.message}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}