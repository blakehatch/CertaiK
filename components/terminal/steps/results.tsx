import { TerminalStep } from "@/utils/enums";
import { MessageType } from "@/utils/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import TerminalInputBar from "../input-bar";

type TerminalProps = {
  setTerminalStep: Dispatch<SetStateAction<TerminalStep>>;
  setAuditContent: Dispatch<SetStateAction<string>>;
  handleGlobalState: (step: TerminalStep, history: MessageType[]) => void;
  contractContent: string;
  promptContent: string;
  auditContent: string;
  state: MessageType[];
};

export function ResultsStep({
  setTerminalStep,
  handleGlobalState,
  setAuditContent,
  contractContent,
  promptContent,
  auditContent,
  state,
}: TerminalProps) {
  const [loading, setLoading] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  const removeComments = (report: string): string => {
    report = report.replace(/\/\/.*$/gm, "");
    report = report.replace(/\/\*[\s\S]*?\*\//g, "");
    report = report
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .join("\n");
    return report;
  };

  useEffect(() => {
    if (state.length || loading) return;
    setLoading(true);
    const cleanedFileContent = removeComments(contractContent || "");

    const fetchStream = async () => {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: cleanedFileContent, prompt: promptContent }),
        signal: AbortSignal.timeout(600000),
      });

      if (!response.ok) {
        console.log("ERROR", response.statusText);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        setAuditContent((prev) => prev + chunk);
      }
      setLoading(false);
    };
    try {
      fetchStream();
    } catch (error) {
      console.log(error);
    }
  }, [state]);

  useEffect(() => {
    scrollToBottom();
  }, [auditContent]);

  const handleSubmit = () => {};

  return (
    <>
      <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm">
        {auditContent && <ReactMarkdown className="overflow-scroll">{auditContent}</ReactMarkdown>}
      </div>
      <TerminalInputBar
        onSubmit={handleSubmit}
        onChange={(value: string) => {}}
        disabled={true}
        value={""}
        overrideLoading={loading}
      />
    </>
  );
}
