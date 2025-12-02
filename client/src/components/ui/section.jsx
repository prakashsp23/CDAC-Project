import * as React from "react"
import { cn } from "@/lib/utils"

const Section = React.forwardRef(({ className, ...props }, ref) => (
    <section
        ref={ref}
        className={cn("w-full h-full", className)}
        {...props}
    />
))
Section.displayName = "Section"

export { Section }

