import React from 'react'

/**
 * DEVELOPMENT GRAPHICS
 *
 * Visual language:
 * - Architectural construction
 * - Structure emerging from geometry
 * - Precision, assembly and progression
 * - Thin editorial strokes using currentColor
 *
 * These graphics should feel like the natural evolution of the
 * perspective/frame graphics from the Vision stage.
 */


/* -------------------------------------------------------------------------- */
/* STRUCTURAL GRID                                                            */
/* -------------------------------------------------------------------------- */

export function StructuralGridGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer structure */}
      <rect
        x="45"
        y="35"
        width="210"
        height="190"
        stroke="currentColor"
        strokeWidth="1.1"
      />

      {/* Vertical structural lines */}
      <path
        d="M97.5 35V225M150 35V225M202.5 35V225"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.6"
      />

      {/* Horizontal structural lines */}
      <path
        d="M45 82.5H255M45 130H255M45 177.5H255"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.6"
      />

      {/* Strong central axis */}
      <line
        x1="150"
        y1="18"
        x2="150"
        y2="242"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.75"
      />

      {/* Construction nodes */}
      <circle cx="45" cy="35" r="3" fill="currentColor" />
      <circle cx="255" cy="35" r="3" fill="currentColor" />
      <circle cx="45" cy="225" r="3" fill="currentColor" />
      <circle cx="255" cy="225" r="3" fill="currentColor" />

      <circle
        cx="150"
        cy="130"
        r="4"
        fill="currentColor"
      />
    </svg>
  )
}


/* -------------------------------------------------------------------------- */
/* ASSEMBLY                                                                   */
/* -------------------------------------------------------------------------- */

export function AssemblyGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Base plane */}
      <path
        d="M70 205H250"
        stroke="currentColor"
        strokeWidth="1.1"
      />

      {/* Left structural mass */}
      <rect
        x="82"
        y="112"
        width="54"
        height="93"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Centre structural mass */}
      <rect
        x="136"
        y="72"
        width="52"
        height="133"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Right structural mass */}
      <rect
        x="188"
        y="126"
        width="50"
        height="79"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Construction alignment lines */}
      <path
        d="M62 112H258"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.3"
      />

      <path
        d="M62 72H258"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.25"
      />

      {/* Vertical guide */}
      <path
        d="M162 40V222"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.35"
      />

      {/* Assembly nodes */}
      <circle cx="109" cy="112" r="3" fill="currentColor" />
      <circle cx="162" cy="72" r="3" fill="currentColor" />
      <circle cx="213" cy="126" r="3" fill="currentColor" />
    </svg>
  )
}


/* -------------------------------------------------------------------------- */
/* ELEVATION                                                                  */
/* -------------------------------------------------------------------------- */

export function ElevationGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 340 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Ground line */}
      <line
        x1="38"
        y1="218"
        x2="302"
        y2="218"
        stroke="currentColor"
        strokeWidth="1.1"
      />

      {/* Main architectural silhouette */}
      <path
        d="
          M78 218
          V118
          H116
          V78
          H166
          V48
          H222
          V118
          H262
          V218
        "
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Internal floors */}
      <path
        d="M78 148H262M78 182H262"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.55"
      />

      {/* Vertical divisions */}
      <path
        d="M116 118V218M166 48V218M222 118V218"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.55"
      />

      {/* Subtle measurement markers */}
      <path
        d="M58 48V218M52 48H64M52 218H64"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.35"
      />

      <path
        d="M78 238H262"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.3"
      />

      {/* Key construction point */}
      <circle
        cx="166"
        cy="48"
        r="3"
        fill="currentColor"
      />
    </svg>
  )
}


/* -------------------------------------------------------------------------- */
/* PROGRESSION                                                                */
/* -------------------------------------------------------------------------- */

export function ProgressionGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 360 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Baseline */}
      <line
        x1="32"
        y1="178"
        x2="328"
        y2="178"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Progressive forms */}
      <rect
        x="58"
        y="142"
        width="42"
        height="36"
        stroke="currentColor"
        strokeWidth="1"
      />

      <rect
        x="132"
        y="104"
        width="48"
        height="74"
        stroke="currentColor"
        strokeWidth="1"
      />

      <rect
        x="220"
        y="54"
        width="58"
        height="124"
        stroke="currentColor"
        strokeWidth="1.1"
      />

      {/* Internal development lines */}
      <path
        d="M132 141H180M220 95H278M220 136H278"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.45"
      />

      {/* Direction line */}
      <path
        d="M48 188L292 32"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.3"
      />

      {/* Progress nodes */}
      <circle cx="79" cy="142" r="3" fill="currentColor" />
      <circle cx="156" cy="104" r="3" fill="currentColor" />
      <circle cx="249" cy="54" r="3" fill="currentColor" />
    </svg>
  )
}