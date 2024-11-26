import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'
import Image from 'next/image';
import { Switch } from "@/components/ui/switch"

export default function SideNav({ userRole = 'client' }: { userRole?: 'admin' | 'commercial' | 'client' }) {
  return (
    <div className="flex h-full flex-col px-2 py-4 md:px-2 border-r border-gray-10">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md p-4"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>

     <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks  userRole ={ userRole} />
      <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

      <div className="max-w-sm mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Image
            src="/blank-profile.png"
            alt="Alesia Karapova"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-medium text-gray-900 dark:text-white">Alesia Karapova</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <EllipsisHorizontalIcon className="h-5 w-5" />
          <span className="sr-only">More options</span>
        </button>
      </div>
      <hr />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Dark Mode</span>
        <Switch
          className="data-[state=checked]:bg-blue-600"
        />
      </div>
    </div>
      </div>
    </div>
  );
}
