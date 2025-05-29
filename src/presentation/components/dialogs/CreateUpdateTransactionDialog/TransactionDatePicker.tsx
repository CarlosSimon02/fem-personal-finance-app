"use client";

import { Button } from "@/presentation/components/ui/button";
import { Calendar } from "@/presentation/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover";
import { cn } from "@/utils/lib/shadcnUtils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface TransactionDatePickerProps {
  value: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

export const TransactionDatePicker = ({
  value,
  onChange,
  disabled,
}: TransactionDatePickerProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className={cn(
          "pl-3 text-left font-normal",
          !value && "text-muted-foreground"
        )}
        disabled={disabled}
      >
        {value ? format(value, "PPP") : <span>Pick a date</span>}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={value}
        onSelect={onChange}
        disabled={disabled}
        initialFocus
      />
    </PopoverContent>
  </Popover>
);
