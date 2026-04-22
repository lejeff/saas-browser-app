"use client";

import type { ReactNode } from "react";

type Props = {
  label: string;
  helper?: string;
  children: ReactNode;
  className?: string;
};

export function FramedField({ label, helper, children, className = "" }: Props) {
  return (
    <div className={className}>
      <div className="field-frame">
        <div className="field-label">{label}</div>
        <div className="field-body">{children}</div>
      </div>
      {helper ? <p className="field-helper">{helper}</p> : null}
    </div>
  );
}
