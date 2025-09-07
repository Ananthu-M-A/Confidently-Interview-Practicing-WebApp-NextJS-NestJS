"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-6 text-center mt-8 shadow-inner border-t border-gray-300">
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <span className="font-semibold">
          &copy; 2025 Confidently Interview Practice App
        </span>
        <span className="hidden md:inline">|</span>
        <Link
          href="https://ananthuma.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold hover:text-black hover:underline"
        >
          Ananthu M A
        </Link>
      </div>
    </footer>
  );
}
