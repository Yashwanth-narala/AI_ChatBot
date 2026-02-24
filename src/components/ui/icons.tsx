import type { SVGProps } from "react";

export function LightningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M13 2 4 14h5v8l9-12h-5V2Z" fill="currentColor" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M9.5 16.2 5.8 12.5l-1.3 1.3 5 5 9-9-1.3-1.3-7.7 7.7Z"
        fill="currentColor"
      />
    </svg>
  );
}
