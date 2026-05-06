"use client";

import { useSession } from "next-auth/react";
import { Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/patients?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between bg-white px-6 border-b border-slate-200">
      <div className="flex flex-1">
        <form className="flex w-full max-w-md items-center relative" onSubmit={handleSearch}>
          <Search className="absolute left-3 h-5 w-5 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            placeholder="Search patients..."
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
            <User className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-slate-700">
            {session?.user?.name || "Loading..."}
          </span>
        </div>
      </div>
    </header>
  );
}
