import type { ButtonProps } from "@navikt/ds-react";
import { Button, Link } from "@navikt/ds-react";
import type { LinkProps } from "@remix-run/react";
import { useHref } from "@remix-run/react";
import type { PropsWithChildren, Ref } from "react";
import { forwardRef } from "react";
import { useLinkClickHandler } from "react-router-dom";

interface IProps extends LinkProps {
  asButtonVariant?: ButtonProps["variant"];
  loading?: boolean;
}

export const RemixLink = forwardRef(RemixLinkComponent);

function RemixLinkComponent(
  props: PropsWithChildren<IProps>,
  ref: Ref<HTMLAnchorElement> | undefined,
) {
  const {
    onClick,
    replace = false,
    asButtonVariant,
    state,
    target,
    to,
    children,
    className,
    loading,
  } = props;
  const href = useHref(to);
  const handleClick = useLinkClickHandler(to, {
    replace,
    state,
    target,
  });

  if (asButtonVariant) {
    return (
      <Button
        className={className || ""}
        href={href}
        size={"small"}
        variant={asButtonVariant}
        loading={loading}
        onClick={(event) => {
          /* Dette er OK å ignorere, den klager på at det er feil type 
          (Anchor i stedet for Button), og siden vi alltid sender med 
          as="a" overstyrer vi dette til å være en anchor-tag. Typene 
          bakover i designsystemet gjenspeiler ikke dette. */
          // @ts-ignore
          onClick?.(event);
          if (!event.defaultPrevented) {
            // @ts-ignore
            handleClick(event);
          }
        }}
        ref={ref}
        as="a"
      >
        {children}
      </Button>
    );
  }

  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          handleClick(event);
        }
      }}
      ref={ref}
      className={className || ""}
    >
      {children}
    </Link>
  );
}
