"use client";

import { cn } from "@/utils/lib/shadcnUtils";

type ColorPickerProps = {
  id?: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
  disabled?: boolean;
};

const PRESET_COLORS = [
  "#10b981", // Green
  "#6366f1", // Indigo
  "#ef4444", // Red
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#ec4899", // Pink
  "#8b5cf6", // Violet
  "#14b8a6", // Teal
];

export const ColorPicker = ({
  id,
  value,
  onChange,
  className,
  disabled,
}: ColorPickerProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          id={id}
          type="button"
          className={cn(
            "h-8 w-8 rounded-full border focus:ring-2 focus:ring-offset-2 focus:outline-none",
            value === color ? "ring-2 ring-offset-2" : "border-gray-300"
          )}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          aria-label={`Select color ${color}`}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
