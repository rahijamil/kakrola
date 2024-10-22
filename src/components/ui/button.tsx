import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        xs: "h-7 px-2 text-[12px]",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ElementType; // Optional icon on the left
  leftAlign?: boolean; // Align the content to the left
  rightContent?: React.ReactNode; // Add the rightContent prop
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon: Icon,
      leftAlign = false,
      rightContent, // Right content (e.g., icons or custom elements)
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          leftAlign && "justify-start" // Align the content to the left if required
        )}
        ref={ref}
        {...props}
      >
        {/* Render left icon if provided */}
        {Icon && <Icon className="w-4 h-4" />}

        {/* Main content (children) */}
        {children}

        {/* Render right content if provided */}
        {rightContent && <div className="ml-2">{rightContent}</div>}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
