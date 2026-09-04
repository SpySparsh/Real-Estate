import React from 'react'

/**
 * VALUE GRAPHICS
 *
 * Visual language:
 * - Calm and resolved
 * - Balanced geometry
 * - Permanence and longevity
 * - Less "construction" than Development
 * - More complete forms and stable composition
 * - Uses currentColor so colour is controlled externally
 */


/* -------------------------------------------------------------------------- */
/* BALANCE                                                                    */
/* -------------------------------------------------------------------------- */

export function BalanceGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Central vertical axis */}
      <line
        x1="150"
        y1="30"
        x2="150"
        y2="190"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.65"
      />

      {/* Main balance line */}
      <line
        x1="48"
        y1="110"
        x2="252"
        y2="110"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* Left balanced form */}
      <circle
        cx="92"
        cy="110"
        r="30"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Right balanced form */}
      <circle
        cx="208"
        cy="110"
        r="30"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Central anchor */}
      <circle
        cx="150"
        cy="110"
        r="7"
        fill="currentColor"
      />

      <circle
        cx="150"
        cy="110"
        r="18"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />

      {/* Small reference marks */}
      <path
        d="M92 72V84M92 136V148M208 72V84M208 136V148"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.45"
      />
    </svg>
  )
}


/* -------------------------------------------------------------------------- */
/* FOUNDATION                                                                 */
/* -------------------------------------------------------------------------- */

export function FoundationGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Ground / foundation line */}
      <line
        x1="42"
        y1="190"
        x2="278"
        y2="190"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* Main stable form */}
      <rect
        x="95"
        y="70"
        width="130"
        height="120"
        stroke="currentColor"
        strokeWidth="1.1"
      />

      {/* Internal structural divisions */}
      <path
        d="M95 110H225M95 150H225"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />

      <path
        d="M138 70V190M182 70V190"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />

      {/* Extended foundation */}
      <path
        d="M72 204H248"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />

      {/* Foundation reference marks */}
      <path
        d="M95 198V212M225 198V212"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.45"
      />

      {/* Central permanent anchor */}
      <circle
        cx="160"
        cy="130"
        r="4"
        fill="currentColor"
      />
    </svg>
  )
}


/* -------------------------------------------------------------------------- */
/* LONGEVITY                                                                  */
/* -------------------------------------------------------------------------- */

export function LongevityGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer time ring */}
      <circle
        cx="140"
        cy="140"
        r="92"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Middle ring */}
      <circle
        cx="140"
        cy="140"
        r="62"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />

      {/* Inner ring */}
      <circle
        cx="140"
        cy="140"
        r="30"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.35"
      />

      {/* Cardinal marks */}
      <path
        d="M140 32V48M140 232V248M32 140H48M232 140H248"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Secondary markers */}
      <path
        d="
          M70 70L81 81
          M199 199L210 210
          M210 70L199 81
          M81 199L70 210
        "
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />

      {/* Permanent centre */}
      <circle
        cx="140"
        cy="140"
        r="5"
        fill="currentColor"
      />
    </svg>
  )
}


/* -------------------------------------------------------------------------- */
/* VALUE POINT                                                                */
/* -------------------------------------------------------------------------- */

export function ValuePointGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer square */}
      <rect
        x="38"
        y="38"
        width="164"
        height="164"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.45"
      />

      {/* Inner square */}
      <rect
        x="72"
        y="72"
        width="96"
        height="96"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Diagonal relationship */}
      <path
        d="M72 168L168 72"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.35"
      />

      {/* Horizontal centre line */}
      <line
        x1="38"
        y1="120"
        x2="202"
        y2="120"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.3"
      />

      {/* Vertical centre line */}
      <line
        x1="120"
        y1="38"
        x2="120"
        y2="202"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.3"
      />

      {/* Final focal point */}
      <circle
        cx="120"
        cy="120"
        r="6"
        fill="currentColor"
      />

      <circle
        cx="120"
        cy="120"
        r="17"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.45"
      />
    </svg>
  )
}