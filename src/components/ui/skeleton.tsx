import { cn } from "src/utils/utils";
import React from "react";

// Step 1: Define a new type/interface
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number; 
}

function Skeleton({
  className,
  delay = 0, 
  ...props
}: SkeletonProps) {
  const style = {
    animationDelay: `${delay}ms`, 
  };

  return (
    <div
      style={style}
      className={cn("animate-pulse rounded-md bg-slate-300 dark:bg-slate-900", className)}
      {...props}
    />
  );
}

export { Skeleton };
