import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
        src="/logo-h.png"
        width={1024}
        height={270}
        className="hidden md:block"
        alt="kioske online logo"
      />
    </div>
  );
}
