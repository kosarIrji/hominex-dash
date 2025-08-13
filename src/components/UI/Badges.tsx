import { ReactNode } from "react";

type Badge = {
  value: string;
};

export const Blue = ({ value }: Badge) => (
  <span
    id="badge-dismiss-default"
    className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded-sm dark:bg-blue-900 dark:text-blue-300">
    {value}
  </span>
);
export const Gray = ({ value }: Badge) => (
  <span
    id="badge-dismiss-dark"
    className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-gray-800 bg-gray-100 rounded-sm dark:bg-gray-700 dark:text-gray-300">
    {value}
  </span>
);

export const Red = ({ value }: Badge) => (
  <span
    id="badge-dismiss-red"
    className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-red-800 bg-red-100 rounded-sm dark:bg-red-900 dark:text-red-300">
    {value}
  </span>
);
export const Green = ({ value }: Badge) => (
  <span
    id="badge-dismiss-green"
    className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-green-800 bg-green-100 rounded-sm dark:bg-green-900 dark:text-green-300">
    {value}
  </span>
);
export const Yellow = ({ value }: Badge) => (
  <span
    id="badge-dismiss-yellow"
    className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-sm dark:bg-yellow-900 dark:text-yellow-300">
    {value}
  </span>
);
export const YellowChildren = ({ children }: { children: ReactNode }) => (
  <span
    id="badge-dismiss-yellow"
    className="inline-flex flex-row-reverse items-center px-2 py-1 me-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-sm dark:bg-yellow-900 dark:text-yellow-300">
    {children}
  </span>
);

export const Indigo = ({ value }: Badge) => (
  <span
    id="badge-dismiss-indigo"
    className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-sm dark:bg-indigo-900 dark:text-indigo-300">
    {value}
  </span>
);
export const Purple = ({ value }: Badge) => (
  <span
    id="badge-dismiss-purple"
    className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-purple-800 bg-purple-100 rounded-sm dark:bg-purple-900 dark:text-purple-300">
    {value}
  </span>
);
export const Pink = ({ value }: Badge) => (
  <span
    id="badge-dismiss-pink"
    className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-pink-800 bg-pink-100 rounded-sm dark:bg-pink-900 dark:text-pink-300">
    {value}
  </span>
);

export const Colorless = ({ value }: Badge) => {
  return (
    <span className=" text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-2xl dark:text-blue-400 border border-blue-400">
      {value}
    </span>
  );
};
