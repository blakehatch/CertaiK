import { MessageType } from "@/utils/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import TerminalInputBar from "../input-bar";

type TerminalProps = {
  setAuditContent: Dispatch<SetStateAction<string>>;
  contractContent: string;
  promptContent: string;
  state: MessageType[];
};

export function ResultsStep({
  setAuditContent,
  contractContent,
  promptContent,
  state,
}: TerminalProps) {
  const [loading, setLoading] = useState(false);
  const [streamedAudit, setStreamedAudit] = useState("");

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

    let streamedChunks = "";
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
        streamedChunks += chunk;
        setStreamedAudit(streamedChunks);
      }
      setLoading(false);
      // store this in a separate variable so we can access it outside of state.
      setAuditContent(streamedChunks);
    };
    try {
      fetchStream();
    } catch (error) {
      console.log(error);
    }
  }, [state]);

  useEffect(() => {
    scrollToBottom();
  }, [streamedAudit]);

  const handleSubmit = () => {};

  return (
    <>
      <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm no-scrollbar">
        {streamedAudit && (
          <ReactMarkdown className="overflow-scroll no-scrollbar *:whitespace-pre-wrap">
            {streamedAudit}
          </ReactMarkdown>
        )}
      </div>
      <TerminalInputBar
        onSubmit={handleSubmit}
        onChange={(value: string) => {}}
        disabled={true}
        value={""}
        overrideLoading={loading}
        placeholder="Chat feature coming soon..."
      />
    </>
  );
}
