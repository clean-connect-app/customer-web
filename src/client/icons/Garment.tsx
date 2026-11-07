import type { ReactNode } from "react";
import type { IGarmentIconProps } from "../types/index";
import type { TServiceIcon } from "../../shared/types/index";
export function Garment({ kind }: IGarmentIconProps) {
  const paths: Record<TServiceIcon, ReactNode> = {
    shirt: (
      <>
        <path d="m34 18 18-7 18 7 18 20-14 12-8-10v45H38V40l-8 10-14-12 18-20Z" />
        <path d="m42 14 10 13 10-13M52 27v58M38 40l-4-22m32 22 4-22m-4 30h-9v10h9" />
        <path d="m43 13-4 12 7 5 6-3m9-14 4 12-7 5-6-3" />
        <circle cx="55" cy="40" r=".8" />
        <circle cx="55" cy="56" r=".8" />
        <circle cx="55" cy="72" r=".8" />
      </>
    ),
    trousers: (
      <>
        <path d="M32 13h40l4 72H56l-4-43-4 43H28l4-72Z" />
        <path d="M32 21h40M52 21v21M40 13v8m24-8v8M32 26l9 3v10M72 26l-9 3v10M29 78h19m8 0h19" />
        <circle cx="54" cy="17" r=".7" />
      </>
    ),
    dress: (
      <>
        <path d="m38 13 7-3c0 10 14 10 14 0l7 3 5 23-10 9 18 40H25l18-40-10-9 5-23Z" />
        <path d="M43 45h18M40 39h24M45 10l-2 16m16-16 2 16M38 80h28M47 51l-7 25m17-25 7 25" />
      </>
    ),
    suit: (
      <>
        <path d="m37 17 15-7 15 7 16 18-10 10-6-7 3 44H34l3-44-6 7-10-10 16-18Z" />
        <path d="m44 14 8 15 8-15M52 29v53m-14-64 4 20 10-9m14-11-4 20-10-9M40 54h7m10 0h7M45 15l-3 12m17-12 3 12" />
        <circle cx="56" cy="45" r="1" />
        <circle cx="56" cy="63" r="1" />
      </>
    ),
    coat: (
      <>
        <path d="m39 12 13-3 13 3 15 21-10 9-6-10 8 55H32l8-55-6 10-10-9 15-21Z" />
        <path d="m44 11-6 17 14 9 14-9-6-17M52 37v50M36 59h10m12 0h10M35 70l10-3m14 0 10 3" />
        <circle cx="57" cy="49" r="1" />
        <circle cx="57" cy="63" r="1" />
        <circle cx="57" cy="77" r="1" />
      </>
    ),
    duvet: (
      <>
        <path d="M25 17h54v60a10 10 0 0 1-10 10H25V17Z" />
        <path d="M25 28h44v59M37 28v59m16-59v59M25 43h44M25 58h44M25 73h44M69 17v11h10" />
        <path d="m79 77-10 10M30 22h33" />
      </>
    ),
  };
  return (
    <svg
      width="112"
      height="112"
      viewBox="2 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <ellipse
        cx="52"
        cy="91"
        rx="30"
        ry="3"
        fill="currentColor"
        opacity=".07"
      />
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[kind]}
      </g>
    </svg>
  );
}
