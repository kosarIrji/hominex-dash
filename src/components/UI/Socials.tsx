import { RiTelegramLine } from "react-icons/ri";
import { FiYoutube } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import Link from "next/link";

export default function Socials() {
  return (
    <div className="flex flex-row-reverse sm:justify-between sm:px-5 mb-5  justify-center items-center w-full">
      <span className="shadow-2xl shadow-black hidden sm:block">
        توسعه با 💪 توسط تیم هومینکس
      </span>
      <div className="flex flex-row gap-5 text-2xl">
        <Link href={""}>
          <RiTelegramLine className="shadow-2xl shadow-black cursor-pointer" />
        </Link>
        <Link href={""}>
          <FiYoutube className="shadow-2xl shadow-black cursor-pointer" />
        </Link>
        <Link href={""}>
          <FaWhatsapp className="shadow-2xl shadow-black cursor-pointer" />
        </Link>
        <Link href={""}>
          <FaInstagram className="shadow-2xl shadow-black cursor-pointer" />
        </Link>
      </div>
    </div>
  );
}
