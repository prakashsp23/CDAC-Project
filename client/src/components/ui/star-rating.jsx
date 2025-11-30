import React from 'react'

function StarIcon({ filled = false, size = 20, className = '' }) {
  const sz = typeof size === 'number' ? `${size}px` : size
const [hovered, setHovered] = React.useState(0)

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={sz}
            height={sz}
            className={className}
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            onMouseEnter={() => setHovered(1)}
            onMouseLeave={() => setHovered(0)}
            style={{ transform: hovered ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.2s ease', cursor: 'pointer' ,}}
        >
            <polygon points="12 2 15.09 10.26 24 10.26 17.55 15.63 19.64 23.74 12 18.37 4.36 23.74 6.45 15.63 0 10.26 8.91 10.26 12 2" />
        </svg>
    )
}

export function StarRating({ value = 0, onChange = () => {}, readOnly = false, size = 20 }) {
  // value: number 0-5
  const items = [1,2,3,4,5]
  return (
    <div className="flex items-center gap-1">
      {items.map(i => {
        const filled = i <= value
        if (readOnly) {
          return (
            <span key={i} className={filled ? 'text-card-foreground' : 'text-muted-foreground'}>
              <StarIcon filled={filled} size={size} />
            </span>
          )
        }

        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className="p-1 rounded"
            aria-label={`${i} star`}
          >
            <span className={filled ? 'text-card-foreground' : 'text-muted-foreground'}>
              <StarIcon filled={filled} size={size} />
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
