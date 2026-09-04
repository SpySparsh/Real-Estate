import React from 'react'

/**
 * VISION GRAPHICS
 *
 * Visual language:
 * - Thin architectural strokes
 * - Open / incomplete geometry
 * - Central focal points
 * - Perspective and framing rather than literal "eye" icons
 * - Uses currentColor so Philosophy.jsx/CSS controls colour
 */

/* -------------------------------------------------------------------------- */
/* PERSPECTIVE                                                                */
/* -------------------------------------------------------------------------- */

export function PerspectiveGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 360 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Vanishing point */}
      <circle
        cx="180"
        cy="120"
        r="4"
        fill="currentColor"
      />

      <circle
        cx="180"
        cy="120"
        r="12"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />

      {/* Main perspective lines */}
      <path
        d="M18 24L180 120L342 24"
        stroke="currentColor"
        strokeWidth="1"
      />

      <path
        d="M18 216L180 120L342 216"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Secondary perspective lines */}
      <path
        d="M72 18L180 120L288 18"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />

      <path
        d="M72 222L180 120L288 222"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />

      {/* Horizontal spatial guides */}
      <path
        d="M44 74H316"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.28"
      />

      <path
        d="M44 166H316"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.28"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* ARCHITECTURAL FRAME                                                        */
/* -------------------------------------------------------------------------- */

export function FrameGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top-left frame */}
      <path
        d="M38 104V38H126"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* Top-right frame */}
      <path
        d="M174 38H262V104"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* Bottom-right frame */}
      <path
        d="M262 136V202H174"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* Bottom-left frame */}
      <path
        d="M126 202H38V136"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* Offset inner frame fragments */}
      <path
        d="M72 88V68H110"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.45"
      />

      <path
        d="M190 68H228V88"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.45"
      />

      <path
        d="M228 152V172H190"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.45"
      />

      <path
        d="M110 172H72V152"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.45"
      />

      {/* Small central reference point */}
      <circle
        cx="150"
        cy="120"
        r="3"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* FOCUS                                                                      */
/* -------------------------------------------------------------------------- */

export function FocusGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Corner focus brackets */}
      <path
        d="M30 82V30H82"
        stroke="currentColor"
        strokeWidth="1.1"
      />

      <path
        d="M138 30H190V82"
        stroke="currentColor"
        strokeWidth="1.1"
      />

      <path
        d="M190 138V190H138"
        stroke="currentColor"
        strokeWidth="1.1"
      />

      <path
        d="M82 190H30V138"
        stroke="currentColor"
        strokeWidth="1.1"
      />

      {/* Central focus ring */}
      <circle
        cx="110"
        cy="110"
        r="30"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.45"
      />

      <circle
        cx="110"
        cy="110"
        r="10"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Central point */}
      <circle
        cx="110"
        cy="110"
        r="3"
        fill="currentColor"
      />

      {/* Crosshair fragments */}
      <path
        d="M110 64V76M110 144V156M64 110H76M144 110H156"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.55"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* HORIZON                                                                    */
/* -------------------------------------------------------------------------- */

export function HorizonGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 360 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main horizon */}
      <line
        x1="20"
        y1="76"
        x2="340"
        y2="76"
        stroke="currentColor"
        strokeWidth="1.1"
      />

      {/* Upper distant line */}
      <line
        x1="78"
        y1="48"
        x2="282"
        y2="48"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.35"
      />

      {/* Lower spatial line */}
      <line
        x1="118"
        y1="104"
        x2="242"
        y2="104"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.35"
      />

      {/* Central horizon point */}
      <circle
        cx="180"
        cy="76"
        r="3"
        fill="currentColor"
      />

      {/* Small directional markers */}
      <path
        d="M42 68V84M318 68V84"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.6"
      />

      {/* Subtle vertical reference */}
      <path
        d="M180 60V92"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.45"
      />
    </svg>
  )
}