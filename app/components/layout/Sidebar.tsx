"use client";
import { 
  GlobeAltIcon, 
  Cog6ToothIcon,
  Square3Stack3DIcon,
  ArchiveBoxIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/', icon: GlobeAltIcon },
  { name: 'My Deck', href: '/deck', icon: Square3Stack3DIcon },
  { name: 'Packs', href: '/packs', icon: ArchiveBoxIcon },
  { name: 'How to Play', href: '/how-to-play', icon: QuestionMarkCircleIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-blue-900/50 border-r border-blue-800 fixed left-0 top-0">
      <div className="p-6 space-y-8">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <GlobeAltIcon className="w-8 h-8 text-gold-400" />
          <h1 className="text-xl font-bold text-gold-300">Wealth of Nations</h1>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-4">
          {/* Primary CTA */}
          <Link
            href="/play"
            className={`
              flex items-center justify-center w-full px-4 py-3 mb-8 
              text-lg font-semibold text-white 
              bg-gradient-to-r from-amber-500 to-amber-600 
              rounded-lg shadow-lg hover:from-amber-600 hover:to-amber-700 
              transition-all duration-200
            `}
          >
            Play Game
          </Link>

          {/* Nav Links */}
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors
                         ${pathname === item.href
                           ? 'bg-blue-800/40 text-gold-300' 
                           : 'text-blue-100 hover:text-gold-300 hover:bg-blue-800/30'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
