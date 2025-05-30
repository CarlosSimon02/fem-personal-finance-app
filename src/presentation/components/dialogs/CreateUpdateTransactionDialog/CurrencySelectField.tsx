"use client";

import { Input } from "@/presentation/components/ui/input";
import React, { useEffect, useRef } from "react";

type CurrencyInputFieldProps = React.ComponentProps<"input"> & {
  value: number;
  onChange: (value: number) => void;
};

export const CurrencyInputField = ({
  value,
  onChange,
  disabled = false,
  placeholder = "0.00",
  className,
  ...props
}: CurrencyInputFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const oldValueRef = useRef("");
  const oldSelectionRef = useRef({ start: 0, end: 0 });

  // Format the initial value
  const formatValue = (val: number) => {
    return val === 0 ? "" : val.toString();
  };

  const [displayValue, setDisplayValue] = React.useState(formatValue(value));

  // Sync with external value changes
  useEffect(() => {
    setDisplayValue(formatValue(value));
  }, [value]);

  // Input filter function
  const isCurrencyValid = (val: string) => {
    return /^-?\d*\.?\d{0,2}$/.test(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (isCurrencyValid(newValue)) {
      oldValueRef.current = newValue;
      if (inputRef.current) {
        oldSelectionRef.current = {
          start: inputRef.current.selectionStart || 0,
          end: inputRef.current.selectionEnd || 0,
        };
      }
      setDisplayValue(newValue);
      // Convert to number and call onChange
      const numericValue = newValue === "" ? 0 : parseFloat(newValue);
      onChange(numericValue);
    } else if (oldValueRef.current !== undefined) {
      // Restore previous value
      setDisplayValue(oldValueRef.current);
      // Restore selection after state update
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(
            oldSelectionRef.current.start,
            oldSelectionRef.current.end
          );
        }
      }, 0);
    } else {
      setDisplayValue("");
      onChange(0);
    }
  };

  const handleBlur = () => {
    // Format the value on blur
    if (displayValue && !displayValue.includes(".")) {
      const formatted = displayValue + ".00";
      setDisplayValue(formatted);
      onChange(parseFloat(formatted));
    } else if (displayValue && displayValue.endsWith(".")) {
      const formatted = displayValue + "00";
      setDisplayValue(formatted);
      onChange(parseFloat(formatted));
    } else if (displayValue && displayValue.split(".")[1]?.length === 1) {
      const formatted = displayValue + "0";
      setDisplayValue(formatted);
      onChange(parseFloat(formatted));
    }
  };

  return (
    <Input
      ref={inputRef}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      {...props}
    />
  );
};
