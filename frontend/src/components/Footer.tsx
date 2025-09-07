"use client"

export default function Footer() {
  return (
    <footer className="w-full py-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-center text-gray-700 mt-8 shadow-inner border-t border-gray-300">
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <span className="font-semibold">&copy; 2025 Confidently Interview</span>
        <span className="hidden md:inline">|</span>
        <a href="https://github.com/Ananthu-M-A" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-blue-600 transition-colors">
          Github
        </a>
        <a href="https://linkedin.com/in/ananthu-m-a" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-blue-600 transition-colors">
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
