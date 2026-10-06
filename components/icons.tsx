import type { SVGProps } from "react";

// Set mic de iconițe inline (fără bibliotecă). Stil: linie 1.75px, colțuri rotunjite.
const paths: Record<string, React.ReactNode> = {
  road: <><path d="M5 21 9 3M19 21 15 3" /><path d="M12 5v2M12 11v2M12 17v2" /></>,
  bulb: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2.2h5c.1-1 .5-1.7 1.1-2.2A6 6 0 0 0 12 3Z" /></>,
  car: <><path d="M5 16V11l2-5h10l2 5v5" /><path d="M3 16h18v3H3zM7 19v2M17 19v2" /><circle cx="7.5" cy="13" r=".5" /><circle cx="16.5" cy="13" r=".5" /></>,
  tree: <><path d="M12 22v-6" /><path d="M12 2 6 10h3l-4 6h14l-4-6h3Z" /></>,
  bin: <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" /><path d="M10 11v6M14 11v6" /></>,
  school: <><path d="m2 9 10-5 10 5-10 5Z" /><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6" /></>,
  hand: <><path d="M11 13V5a1.5 1.5 0 0 1 3 0v6M14 6a1.5 1.5 0 0 1 3 0v6M8 13V8a1.5 1.5 0 0 1 3 0" /><path d="M17 9a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-1a7 7 0 0 1-5.6-2.8L3.5 15.5a1.6 1.6 0 0 1 2.4-2.1L8 15" /></>,
  shield: <><path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6Z" /><path d="m9 12 2 2 4-4" /></>,
  dots: <><circle cx="5" cy="12" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="19" cy="12" r="1.2" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  check: <path d="m5 12 5 5 9-10" />,
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4Z" /><circle cx="12" cy="13" r="3.5" /></>,
  download: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  play: <path d="M8 5v14l11-7Z" />,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 6" /></>,
  megaphone: <><path d="M3 10v4h3l7 4V6L6 10Z" /><path d="M17 9a4 4 0 0 1 0 6M6 14l1 6h2l-1-5" /></>,
  chat: <path d="M4 5h16v11H9l-5 4Z" />,
};

export type IconName = keyof typeof paths;

export function Icon({ name, ...props }: { name: IconName | string } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {paths[name] ?? paths.dots}
    </svg>
  );
}
