import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:     "border-transparent bg-[#F7F7F7]/5 text-[#111111]",
        secondary:   "border-transparent bg-[#F0F0F0] text-[#999999]",
        success:     "border-transparent bg-[#00C087]/10 text-[#00C087]",
        destructive: "border-red-200 bg-red-50 text-red-600",
        outline:     "border-[#E8E8E8] text-[#999999]",
        collab:      "border-transparent bg-orange-50 text-orange-600",
        commerce:    "border-transparent bg-[#00C087]/10 text-[#00C087]",
        spam:        "border-red-200 bg-red-50 text-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
