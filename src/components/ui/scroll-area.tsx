import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "~/utils/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
  >(({ className, children, ...props }, ref) => {
  // check if user uses scrollAreaViewport...
  const hasViewportChild = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === ScrollAreaViewport
  );

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >

      {/*...then renders conditionally */}
      {hasViewportChild ? (children)
        :
        (
        <ScrollAreaViewport>
          {children}
        </ScrollAreaViewport>
      )}
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollAreaViewport = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaViewport>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaViewport>
  >(({ className, children, ...props }, ref) =>
  {
    return(
  <ScrollAreaPrimitive.Viewport
    ref={ref}
    className={cn("h-full w-full rounded-[inherit]", className)}
    {...props}
  >
    {children}
  </ScrollAreaPrimitive.Viewport>
  )}
);
  
ScrollAreaViewport.displayName = ScrollAreaPrimitive.ScrollAreaViewport.displayName;


const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
      "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
      "h-2.5 border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-slate-200 dark:bg-slate-800" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollAreaViewport ,ScrollBar }
