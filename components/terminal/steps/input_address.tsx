import { cn } from "@/lib/utils";
import { Message, TerminalStep } from "@/utils/enums";
import { MessageType } from "@/utils/types";
import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import TerminalInputBar from "../input-bar";

type TerminalProps = {
  setTerminalStep: Dispatch<SetStateAction<TerminalStep>>;
  setContractContent: Dispatch<SetStateAction<string>>;
  handleGlobalState: (step: TerminalStep, history: MessageType[]) => void;
  state: MessageType[];
};

export function AddressStep({
  setTerminalStep,
  handleGlobalState,
  setContractContent,
  state,
}: TerminalProps) {
  const [input, setInput] = useState("");
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

  const handleScan = () => {
    if (!input) {
      setHistory((prev) => [
        ...prev,
        {
          type: Message.ERROR,
          content: "Not a valid address, try again...",
        },
      ]);
      setInput("");
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        type: Message.ASSISTANT,
        content: "Loading...",
      },
    ]);

    fetch(`/api/scan?address=${encodeURIComponent(input)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Bad request");
        }
        return response.json();
      })
      .then((result) => {
        if (result.error) {
          throw new Error("Bad response");
        }
        setContractContent(result.sourceCode);
        setHistory((prev) => [
          ...prev,
          {
            type: Message.ASSISTANT,
            content: result.sourceCode,
          },
          {
            type: Message.SYSTEM,
            content: "Does this look right? (y/n)",
          },
        ]);
        setStep(1);
      })
      .catch((error) => {
        console.log(error);
        setHistory((prev) => [
          ...prev,
          {
            type: Message.ERROR,
            content: "Something went wrong",
          },
        ]);
      })
      .finally(() => setInput(""));
  };

  const handleValidate = () => {
    if (!input) {
      setHistory((prev) => [
        ...prev,
        {
          type: Message.ERROR,
          content: "Not a valid address, try again...",
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
            content: "Okay, let's try again. Input a smart contract address",
          },
        ]);
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
    if (!step) {
      handleScan();
    } else {
      handleValidate();
    }
  };

  return (
    <>
      <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm">
        {history.map((message, i) => (
          <div
            key={i}
            className={cn(
              "mb-2 leading-relaxed whitespace-pre-line",
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
      </div>
      <TerminalInputBar
        onSubmit={handleSubmit}
        onChange={(value: string) => setInput(value)}
        disabled={false}
        value={input}
      />
    </>
  );
}
