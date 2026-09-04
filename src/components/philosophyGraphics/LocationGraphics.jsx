import React from 'react'

/**
 * Shared wrapper behaviour:
 * - All graphics use currentColor so CSS controls their colour.
 * - className allows Philosophy.jsx to position/size them independently.
 * - SVG viewBoxes are intentionally spacious so the graphics feel editorial,
 *   not like standard UI icons.
 */

/* -------------------------------------------------------------------------- */
/* COMPASS                                                                    */
/* -------------------------------------------------------------------------- */

export function CompassGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer orientation ring */}
      <circle
        cx="100"
        cy="100"
        r="72"
        stroke="currentColor"
        strokeWidth="1.2"
      />

      {/* Inner ring */}
      <circle
        cx="100"
        cy="100"
        r="42"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.45"
      />

      {/* Cardinal axis */}
      <path
        d="M100 16V184M16 100H184"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.35"
      />

      {/* Direction marks */}
      <path
        d="M100 28V42M100 158V172M28 100H42M158 100H172"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      {/* Abstract directional pointer */}
      <path
        d="M100 48L119 100L100 152L81 100L100 48Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Central focal point */}
      <circle
        cx="100"
        cy="100"
        r="4"
        fill="currentColor"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* COORDINATE                                                                 */
/* -------------------------------------------------------------------------- */

export function CoordinateGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main horizontal axis */}
      <line
        x1="18"
        y1="90"
        x2="242"
        y2="90"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Main vertical axis */}
      <line
        x1="130"
        y1="18"
        x2="130"
        y2="162"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Precision marks */}
      <path
        d="M58 84V96M94 84V96M166 84V96M202 84V96"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.65"
      />

      <path
        d="M124 48H136M124 66H136M124 114H136M124 132H136"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.65"
      />

      {/* Secondary framing lines */}
      <path
        d="M36 58H108M152 122H224"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.35"
      />

      {/* Central location point */}
      <circle
        cx="130"
        cy="90"
        r="5"
        fill="currentColor"
      />

      <circle
        cx="130"
        cy="90"
        r="12"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.45"
      />

      {/* Coordinate-style labels */}
      <text
        x="18"
        y="78"
        fill="currentColor"
        fontSize="9"
        fontFamily="inherit"
        opacity="0.55"
        letterSpacing="1"
      >
        28° 36'
      </text>

      <text
        x="184"
        y="108"
        fill="currentColor"
        fontSize="9"
        fontFamily="inherit"
        opacity="0.55"
        letterSpacing="1"
      >
        77° 12'
      </text>
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* CONTOUR                                                                    */
/* -------------------------------------------------------------------------- */

export function ContourGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer contour */}
      <path
        d="
          M20 132
          C42 84, 88 52, 142 48
          C198 44, 250 70, 292 112
          C312 132, 304 160, 274 174
          C238 190, 192 184, 158 174
          C114 162, 72 174, 38 158
          C20 150, 12 142, 20 132
        "
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Middle contour */}
      <path
        d="
          M52 132
          C70 96, 108 76, 150 74
          C194 72, 232 92, 258 120
          C274 138, 264 156, 240 164
          C210 174, 174 164, 148 156
          C112 146, 84 156, 62 146
          C50 142, 46 138, 52 132
        "
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.78"
      />

      {/* Inner contour */}
      <path
        d="
          M84 130
          C98 106, 122 94, 152 94
          C184 94, 210 108, 226 126
          C238 140, 226 150, 208 152
          C184 156, 164 144, 146 140
          C122 134, 100 142, 88 136
          C84 134, 82 132, 84 130
        "
        stroke="currentColor"
        strokeWidth="0.85"
        opacity="0.58"
      />

      {/* Core terrain mark */}
      <path
        d="
          M122 128
          C132 116, 144 112, 158 114
          C174 116, 186 126, 188 134
          C190 140, 182 144, 170 142
          C158 140, 150 134, 140 134
          C132 134, 126 134, 122 128
        "
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />

      {/* Small location marker */}
      <circle
        cx="158"
        cy="114"
        r="3"
        fill="currentColor"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* LOCATION POINT                                                              */
/* -------------------------------------------------------------------------- */

export function LocationPointGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer radius */}
      <circle
        cx="90"
        cy="90"
        r="62"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.25"
      />

      {/* Secondary radius */}
      <circle
        cx="90"
        cy="90"
        r="42"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.45"
      />

      {/* Inner ring */}
      <circle
        cx="90"
        cy="90"
        r="18"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.8"
      />

      {/* Axis fragments */}
      <path
        d="M90 12V28M90 152V168M12 90H28M152 90H168"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Central point */}
      <circle
        cx="90"
        cy="90"
        r="5"
        fill="currentColor"
      />

      {/* Small precision marks */}
      <circle
        cx="90"
        cy="48"
        r="2"
        fill="currentColor"
        opacity="0.55"
      />

      <circle
        cx="132"
        cy="90"
        r="2"
        fill="currentColor"
        opacity="0.55"
      />

      <circle
        cx="90"
        cy="132"
        r="2"
        fill="currentColor"
        opacity="0.55"
      />

      <circle
        cx="48"
        cy="90"
        r="2"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  )
}