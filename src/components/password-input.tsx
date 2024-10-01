"use client";

import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [isPasswordShown, setIsPasswordShown] = React.useState(false);

    return (
      <div className="relative w-full">
        <Input
          className={cn("pr-9", className)}
          type={isPasswordShown ? "text" : "password"}
          ref={ref}
          {...props}
        />
        <Button
          variant="link"
          className="absolute right-0 top-1/2 -translate-y-1/2"
          onClick={() => setIsPasswordShown(!isPasswordShown)}
          type="button"
          size="icon"
        >
          {isPasswordShown ? (
            <>
              <EyeClosedIcon />
              <span className="sr-only">Hide password</span>
            </>
          ) : (
            <>
              <EyeOpenIcon />
              <span className="sr-only">Show password</span>
            </>
          )}
        </Button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
