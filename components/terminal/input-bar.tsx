import { cn } from "@/lib/utils";
import React from "react";

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}

const TerminalInputBar: React.FC<InputBarProps> = ({ value, onChange, onSubmit, disabled }) => {
  return (
    <form onSubmit={onSubmit} className="mt-4 flex items-center">
      <span className="text-green-400 mr-2">{">"}</span>
      <input
        autoFocus={true}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "flex-1 bg-transparent border-none outline-none",
          "text-white font-mono",
          "placeholder:text-gray-500",
          "caret-green-400",
          disabled && "cursor-not-allowed opacity-50",
        )}
        placeholder="Type your command..."
      />
    </form>
  );
};

export default TerminalInputBar;
