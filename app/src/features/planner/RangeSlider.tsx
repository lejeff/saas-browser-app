"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";

export type RangeSliderRowSpec = {
  label: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
};

export function RangeSliderRow({
  spec,
  value,
  onChange,
  helpers,
  thumbAriaLabels = ["Start", "End"]
}: {
  spec: RangeSliderRowSpec;
  value: [number, number];
  onChange: (next: [number, number]) => void;
  helpers: [string, string];
  thumbAriaLabels?: [string, string];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-[var(--navy)]">{spec.label}</span>
        <span className="font-display text-base tabular-nums text-[var(--navy)]">
          {spec.format(value[0])} — {spec.format(value[1])}
        </span>
      </div>
      <SliderPrimitive.Root
        className="range-slider-root"
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={value}
        onValueChange={(next) => {
          const [start = value[0], end = value[1]] = next;
          onChange([start, end]);
        }}
        minStepsBetweenThumbs={0}
      >
        <SliderPrimitive.Track className="range-slider-track">
          <SliderPrimitive.Range className="range-slider-fill" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="range-slider-thumb"
          aria-label={thumbAriaLabels[0]}
        />
        <SliderPrimitive.Thumb
          className="range-slider-thumb"
          aria-label={thumbAriaLabels[1]}
        />
      </SliderPrimitive.Root>
      <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)]">
        <span>{spec.format(spec.min)}</span>
        <span>{spec.format(spec.max)}</span>
      </div>
      <div className="text-[11px] text-[var(--ink-muted)]">
        <div>{helpers[0]}</div>
        <div>{helpers[1]}</div>
      </div>
    </div>
  );
}
