import type { IDropIconProps } from "../types/index";
export function Drop({ small = false }: IDropIconProps) {
  return (
    <svg
      width={small ? 20 : 28}
      height={small ? 20 : 28}
      viewBox="0 0 28 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 2C11 8 3 15 3 21a11 11 0 0 0 22 0C25 15 17 8 14 2Z"
        fill="currentColor"
      />
      <path
        d="m9 21 3 3 7-8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
