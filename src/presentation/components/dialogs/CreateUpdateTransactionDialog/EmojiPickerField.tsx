"use client";

import { Button } from "@/presentation/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface EmojiPickerFieldProps {
  value: string;
  onChange: (emoji: string) => void;
  disabled?: boolean;
}

export const EmojiPickerField = ({
  value,
  onChange,
  disabled,
}: EmojiPickerFieldProps) => {
  const currentEmoji = value || "📃";

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onChange(emojiData.emoji);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 w-full text-2xl"
          disabled={disabled}
          type="button"
        >
          {currentEmoji}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" side="bottom">
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          width="100%"
          height="24rem"
        />
      </PopoverContent>
    </Popover>
  );
};
