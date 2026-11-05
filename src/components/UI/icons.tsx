import type { SVGProps } from 'react';

/** Small inline icons. Decorative by default — the button that holds one supplies the label. */
const Svg = ({ children, size = 16, ...props }: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);

export const TrashIcon = () => (
  <Svg>
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
  </Svg>
);
export const ArrowUpIcon = () => (
  <Svg>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Svg>
);
export const ArrowDownIcon = () => (
  <Svg>
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </Svg>
);
export const ChevronIcon = () => (
  <Svg size={14}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);
export const CloseIcon = () => (
  <Svg size={14}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);
export const CheckIcon = () => (
  <Svg size={14} strokeWidth={3}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);
