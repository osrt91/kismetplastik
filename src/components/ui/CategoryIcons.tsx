import React, { type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const defaults = (size?: number): SVGProps<SVGSVGElement> => ({
  width: size ?? 24,
  height: size ?? 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function PetBottleIcon({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M9 2h6v3H9z" />
      <path d="M10 5v1.5c0 .5-.5 1-1.5 2S7 10.5 7 12v7a3 3 0 003 3h4a3 3 0 003-3v-7c0-1.5-.5-2.5-1.5-3.5S14 7 14 6.5V5" />
      <path d="M7 15h10" />
    </svg>
  );
}

export function PlasticBottleIcon({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M10 2h4v2h-4z" />
      <path d="M10 4v2c0 .5-1 1.5-2 2.5S6 11 6 13v6a3 3 0 003 3h6a3 3 0 003-3v-6c0-2-1-3-2-4s-2-2-2-2.5V4" />
      <path d="M9 14h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

export function CapIcon({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <rect x="5" y="8" width="14" height="10" rx="2" />
      <path d="M8 8V6a1 1 0 011-1h6a1 1 0 011 1v2" />
      <path d="M5 12h14" />
      <circle cx="12" cy="15" r="1.5" />
    </svg>
  );
}

export function PlugIcon({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <ellipse cx="12" cy="8" rx="5" ry="2" />
      <path d="M7 8v3c0 1.1 2.24 2 5 2s5-.9 5-2V8" />
      <path d="M10 13v3" />
      <path d="M14 13v3" />
      <path d="M8 16h8" />
      <path d="M9 16v3h6v-3" />
    </svg>
  );
}

export function FingerSprayIcon({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M10 6h4v3h-4z" />
      <path d="M10 9v1c0 .5-.5 1-1 1.5S8 13 8 14v5a3 3 0 003 3h2a3 3 0 003-3v-5c0-1-.5-1.5-1-2s-1-1-1-1.5V9" />
      <path d="M14 6h2v-1a1 1 0 00-1-1h-1" />
      <path d="M16 5h2" />
      <path d="M17 3l1-1" />
      <path d="M18 5l1 0" />
      <path d="M17 7l1 1" />
    </svg>
  );
}

export function PumpIcon({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M9 12h6v1H9z" />
      <path d="M10 13v1c0 1-1 2-1 3v3a2 2 0 002 2h2a2 2 0 002-2v-3c0-1-1-2-1-3v-1" />
      <path d="M12 12V6" />
      <path d="M12 6h3v-1a1 1 0 00-1-1h-1" />
      <path d="M15 5h2" />
      <path d="M12 6H9" />
      <path d="M9 3v3" />
    </svg>
  );
}

export function TriggerSprayIcon({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M8 10h3V7h3v3" />
      <path d="M8 10v9a3 3 0 003 3h2a3 3 0 003-3v-9" />
      <path d="M11 7V4h2v1" />
      <path d="M13 5h3" />
      <path d="M6 10h2" />
      <path d="M5 10c0-1 .5-3 3-3" />
      <path d="M5 10v2l-1 1" />
      <path d="M17 3l1-1" />
      <path d="M18 5h1" />
      <path d="M17 7l1 1" />
    </svg>
  );
}

export function FunnelIcon({ size, ...props }: IconProps) {
  return (
    <svg {...defaults(size)} {...props}>
      <path d="M4 4h16" />
      <path d="M5 4l5 10v6h4v-6l5-10" />
      <ellipse cx="12" cy="4" rx="8" ry="1.5" />
    </svg>
  );
}

export const categoryIconMap: Record<string, (props: IconProps) => React.JSX.Element> = {
  "pet-siseler": PetBottleIcon,
  "plastik-siseler": PlasticBottleIcon,
  "kapaklar": CapIcon,
  "tipalar": PlugIcon,
  "parmak-spreyler": FingerSprayIcon,
  "pompalar": PumpIcon,
  "tetikli-pusturtuculer": TriggerSprayIcon,
  "huniler": FunnelIcon,
};

export const categoryIconList = [
  PetBottleIcon,
  PlasticBottleIcon,
  CapIcon,
  PlugIcon,
  FingerSprayIcon,
  PumpIcon,
  TriggerSprayIcon,
  FunnelIcon,
];
