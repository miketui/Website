import Link from "next/link";
import clsx from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Base = { children: ReactNode; variant?: "primary" | "secondary" | "ghost"; className?: string };
type LinkProps = Base & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>;
type NativeButtonProps = Base & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;
type Props = LinkProps | NativeButtonProps;

export function Button(props: Props) {
  const { children, variant = "primary", className } = props;
  const classes = clsx(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-antique focus:ring-offset-2 focus:ring-offset-obsidian",
    variant === "primary" && "bg-antique text-obsidian hover:shadow-gold",
    variant === "secondary" && "border border-antique text-whitegold hover:bg-antique hover:text-obsidian",
    variant === "ghost" && "text-whitegold underline decoration-antique underline-offset-4",
    className
  );
  if ("href" in props && typeof props.href === "string") {
    const { href, children: linkChildren, variant: _variant, className: _className, ...rest } = props;
    return <Link href={href} {...rest} className={classes}>{linkChildren}</Link>;
  }
  const buttonProps = props as NativeButtonProps;
  const { children: buttonChildren, variant: _variant, className: _className, ...rest } = buttonProps;
  return <button {...rest} className={classes}>{buttonChildren}</button>;
}
