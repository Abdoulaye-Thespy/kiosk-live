'use client';

import {
  UserGroupIcon,
  HomeIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ClipboardDocumentIcon,
  ClipboardIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Tableau de bord', href: '/admin', icon: HomeIcon },
  {
    name: 'Utilisateurs',
    href: '/admin/utilisateurs',
    icon: UserGroupIcon,
  },
  { name: 'Rapports', 
    href: '/admin/rapports', 
    icon: ChartPieIcon 
  },
  { name: 'Kiosques', href: '/admin/kiosques', icon: BuildingOfficeIcon },
  { name: 'Contrats', href: '/admin/contrats', icon: ClipboardIcon },
  { name: 'Factures & Paiments', href: '/admin/facturepaiement', icon: ClipboardDocumentIcon },
  { name: 'Maintenances', href: '/admin/maintenances', icon: QuestionMarkCircleIcon },
  { name: 'Paramètres', href: '/admin/parametres', icon: Cog6ToothIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-1 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-[#E55210]': pathname === link.href,
              },
            )}
            >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
