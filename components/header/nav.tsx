"use client";

import { removeToken } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const NavHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);

  // Run on client after mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    queueMicrotask(() => setToken(savedToken));
  }, []);

  const handleLogout = () => {
    router.push("/login");
    removeToken();
    setToken(null); // update state
  };

  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className={`sticky bg-[#0070f3] absolute inset-x-0 top-0 z-50 ${isAdmin ? "hidden" : ""}`}>
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" 
              alt="" 
              className="h-8 w-auto" 
              height={32}
              width={100}
              />
            </a>
          </div>
          <div className="flex lg:hidden">
        <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200">
          <span className="sr-only">Open main menu</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" data-slot="icon" aria-hidden="true" className="size-6">
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="hidden lg:flex lg:gap-x-12">
        <Link href="/products" className="text-sm/6 font-semibold text-white">Product</Link>
        <Link href="/" className="text-sm/6 font-semibold text-white">Features</Link>
        <Link href="/" className="text-sm/6 font-semibold text-white">Marketplace</Link>
        <Link href="/" className="text-sm/6 font-semibold text-white">Company</Link>
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        {
          token ? (
            <Link href="#" onClick={handleLogout} className="text-sm/6 font-semibold text-white">Logout <span aria-hidden="true">&rarr;</span></Link>
          ) : (
            <Link href="/login" className="text-sm/6 font-semibold text-white">Log in <span aria-hidden="true">&rarr;</span></Link>
          )
        }
      </div>
    </nav>
  </header>
  )
}


export default NavHeader;