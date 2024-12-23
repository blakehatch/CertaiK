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
    return report;
  };

  useEffect(() => {
    if (state.length) return;
    setLoading(true);
    const cleanedFileContent = removeComments(contractContent || "");
    fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: cleanedFileContent, prompt: promptContent }),
      signal: AbortSignal.timeout(600000),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        const report = JSON.parse(result);
        setAuditContent(report);
      })
      .catch((error) => {
        console.log(error);
        setAuditContent("");
      })
      .finally(() => setLoading(false));
  }, [state]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = () => {};

  return (
    <>
      <div ref={terminalRef} className="flex-1 overflow-y-auto font-mono text-sm">
        {loading && (
          <div>
            <p>
              Loading
              <span className="animate-loading-dots inline-block overflow-x-hidden align-bottom">
                ...
              </span>
            </p>
            <p>(this can take up to a minute)</p>
          </div>
        )}
        {auditContent && <ReactMarkdown className="overflow-scroll">{auditContent}</ReactMarkdown>}
      </div>
      <TerminalInputBar
        onSubmit={handleSubmit}
        onChange={(value: string) => {}}
        disabled={true}
        value={""}
      />
    </>
  );
}
