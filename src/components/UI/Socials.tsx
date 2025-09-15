import { RiTelegramLine } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import Link from "next/link";

export default function Socials() {
  return (
    <div className="flex z-[-1] flex-row-reverse sm:justify-between sm:px-5 mb-5  justify-center items-center w-full">
      <span className="shadow-2xl shadow-black hidden sm:block">
        توسعه توسط تیم هومینکس
      </span>
      <div className="flex flex-row gap-3 text-2xl ">
        <Link
          href={""}
          className="bg-[var(--background)]/70 backdrop-blur-md rounded-sm p-2">
          <RiTelegramLine className="shadow-2xl shadow-black cursor-pointer" />
        </Link>

        <Link
          href={""}
          className="bg-[var(--background)]/70 backdrop-blur-md rounded-sm p-2">
          <FaWhatsapp className="shadow-2xl shadow-black cursor-pointer" />
        </Link>
        <Link
          href={""}
          className="bg-[var(--background)]/70 backdrop-blur-md rounded-sm p-2">
          <FaInstagram className="shadow-2xl shadow-black cursor-pointer" />
        </Link>
      </div>
    </div>
  );
}
