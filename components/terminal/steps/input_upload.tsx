import { cn } from "@/lib/utils";
import { Message, TerminalStep } from "@/utils/enums";
import { MessageType } from "@/utils/types";
import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import TerminalInputBar from "../input-bar";
import { FileDropZone } from "./file-drop-zone";

type TerminalProps = {
  setTerminalStep: Dispatch<SetStateAction<TerminalStep>>;
  setContractContent: Dispatch<SetStateAction<string>>;
  handleGlobalState: (step: TerminalStep, history: MessageType[]) => void;
  state: MessageType[];
};

export function UploadStep({
  setTerminalStep,
  handleGlobalState,
  setContractContent,
  state,
}: TerminalProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadAvailable, setUploadAvailable] = useState(true);
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<MessageType[]>(state);

  const terminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleUpload = (content: string) => {
    setContractContent(content);
    setUploadAvailable(false);
    setHistory((prev) => [
      ...prev,
      {
        type: Message.ASSISTANT,
        content: content,
      },
      {
        type: Message.SYSTEM,
        content: "Does this look right? (y/n)",
      },
    ]);
    setStep(1);
  };

  const handleValidate = () => {
    if (!input) {
      setHistory((prev) => [
        ...prev,
        {
          type: Message.ERROR,
          content: "Invalid input, try again",
        },
      ]);
      setInput("");
      return;
    }
    const l = input[0].toLowerCase();
    switch (l) {
      case "y": {
        setInput("");
        handleGlobalState(TerminalStep.INPUT_ADDRESS, history);
        setTerminalStep(TerminalStep.AUDIT_TYPE);
        break;
      }
      case "n": {
        setInput("");
        setStep(0);
        setHistory((prev) => [
          ...prev,
          {
            type: Message.SYSTEM,
            content: "Okay, let's try again",
          },
        ]);
        setUploadAvailable(true);
        break;
      }
      default: {
        setHistory((prev) => [
          ...prev,
          {
            type: Message.SYSTEM,
            content: "Not a valid input, try again...",
          },
        ]);
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setHistory((prev) => [
      ...prev,
      {
        type: Message.USER,
        content: input,
      },
    ]);
    handleValidate();
  };

  return (
    <>
      <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm">
        {history.map((message, i) => (
          <div
            key={i}
            className={cn(
              "mb-2 leading-relaxed whitespace-pre",
              message.type === Message.SYSTEM && "text-blue-400",
              message.type === Message.USER && "text-green-400",
              message.type === Message.ERROR && "text-red-400",
              message.type === Message.ASSISTANT && "text-white",
            )}
          >
            {message.type === Message.USER && "> "}
            {message.content}
          </div>
        ))}
        {uploadAvailable && <FileDropZone onFileSelect={handleUpload} className="my-8" />}
      </div>
      <TerminalInputBar
        onSubmit={handleSubmit}
        onChange={(value: string) => setInput(value)}
        disabled={uploadAvailable}
        value={input}
        overrideLoading={loading}
      />
    </>
  );
}
