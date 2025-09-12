"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TableRow } from "@/components/ui/table";

type RowLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
};

export default function RowLink({
  href,
  className,
  children,
  disabled,
}: RowLinkProps) {
  const router = useRouter();

  const onClick = React.useCallback(() => {
    if (!disabled) router.push(href);
  }, [disabled, href, router]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <TableRow
      role="link"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={[
        "cursor-pointer hover:bg-muted/50 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring",
        disabled && "pointer-events-none opacity-60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </TableRow>
  );
}