import React, { useState } from 'react'
import { Star } from 'lucide-react'

function StarRating({ value = 0, max = 5, onChange, readOnly = false }) {
    // Usage: <StarRating value={userRating} onChange={setUserRating} />
    const [hover, setHover] = useState(0);

    return (
        <div className="flex gap-1">
            {Array.from({ length: max }, (_, i) => {
                const star = i + 1;
                const isActive = star <= (hover || value);

                return (
                    <Star
                        key={star}
                        onClick={() => !readOnly && onChange?.(star)}
                        onMouseEnter={() => !readOnly && setHover(star)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                        className={[
                            "h-5 w-5 transition-colors",
                            !readOnly && "cursor-pointer hover:text-foreground",
                            isActive
                                ? "fill-foreground text-foreground"
                                : "fill-none text-muted-foreground/25",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    />
                );
            })}
        </div>
    );
}


// Component to display fetched rating
function DisplayServiceRating({ rating }) {
    // Usage: <DisplayServiceRating rating={4.5} />
    return (
        <div className="flex items-center gap-2">
            <StarRating value={rating} readOnly />
            <span className="text-sm text-muted-foreground">
                ({rating?.toFixed(1)}) 
            </span>
        </div>
    )
}

export { StarRating, DisplayServiceRating }