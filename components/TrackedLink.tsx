"use client";

import { track } from "@vercel/analytics";
import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"a"> & {
  eventName: string;
  eventProperties?: Record<string, string>;
};

export default function TrackedLink({ eventName, eventProperties, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(event) => {
        track(eventName, eventProperties);
        onClick?.(event);
      }}
    />
  );
}
