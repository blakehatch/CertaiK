import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-full flex justify-start items-center text-white absolute top-0 left-0 z-10">
      <Link
        className="cursor-pointer m-4"
        href="https://www.certaik.xyz"
        target="_blank"
        referrerPolicy="no-referrer"
      >
        <img src="/logo.svg" alt="Logo" className="h-16 w-auto" />
      </Link>
    </header>
  );
};

export default Header;
