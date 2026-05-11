import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 py-6 px-6 mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-zinc-500 font-medium">
          © 2026 Butterscribe Inc. All rights reserved.
        </div>
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <Link className="hover:text-zinc-900 transition-colors" href="#">Privacy Policy</Link>
          <Link className="hover:text-zinc-900 transition-colors" href="#">Terms of Service</Link>
          <Link className="hover:text-zinc-900 transition-colors" href="#">Support</Link>
        </div>
      </div>
    </footer>
  );
}
