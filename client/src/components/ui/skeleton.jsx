import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-[#2e2e2e]", className)}
      {...props} />)
  );
}

export { Skeleton }
