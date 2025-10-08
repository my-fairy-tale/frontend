'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/books', label: '동화책 만들기' },
  { href: '/library', label: '모두의 서재' },
  { href: '/mypage', label: '마이페이지' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex md:space-x-8">
      {navLinks.map((link) => {
        const isActive =
          link.href === '/'
            ? pathname === link.href
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-base font-medium transition-colors ${
              isActive
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
