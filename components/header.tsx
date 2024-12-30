import { BookOpenText } from 'lucide-react';
import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full flex justify-between items-center text-white absolute top-0 left-0 z-30">
      <Link
        className="cursor-pointer m-4"
        href="https://www.certaik.xyz"
        target="_blank"
        referrerPolicy="no-referrer"
      >
        <img src="/logo.svg" alt="Logo" className="h-16 w-auto" />
      </Link>
      <div className="flex space-x-2 ml-auto mr-5">
        <Link
          className="cursor-pointer flex items-center"
          href="https://docs.certaik.xyz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BookOpenText className="mr-2" />
          Docs
        </Link>
      </div>
    </header>
  );
};

export default Header;
