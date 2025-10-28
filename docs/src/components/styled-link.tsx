import NextLink, { LinkProps } from 'next/link';
import { cn } from '@/lib/utils';
import React from 'react';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';

interface Props extends LinkProps {
  className?: string;
  children: React.ReactNode;
}

export function StyledLink({ className, children, ...props }: Props) {
  return (
    <NextLink
      {...props}
      className={cn(
        'x:dark:text-primary-600 x:text-primary-800 underline hover:no-underline',
        className,
      )}
    >
      {children}
      &nbsp;
      <ArrowTopRightIcon className="x:inline x:align-baseline x:shrink-0" />
    </NextLink>
  );
}
