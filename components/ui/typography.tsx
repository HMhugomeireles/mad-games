import * as React from "react"

export function TypographyH1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance"
      {...props}
    />
  )
}

export function TypographyH2({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"  
      {...props}
    />
  )
}

export function TypographyH3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight"  
      {...props}
    />
  )
}

export function TypographyH4({ className, ...props }: React.ComponentProps<"h4">) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight"  
      {...props}
    />
  )
}


export function TypographyP({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6"  
      {...props}
    />
  )
}


export function TypographyBlockquote({ className, ...props }: React.ComponentProps<"blockquote">) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic"  
      {...props}
    />
  )
}


export function TypographyMuted({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className="text-muted-foreground text-sm"  
      {...props}
    />
  )
}
