"use client";

import { AuditTypeStep } from "@/components/terminal/steps/audit_type";
import { InitialStep } from "@/components/terminal/steps/initial";
import { AddressStep } from "@/components/terminal/steps/input_address";
import { ResultsStep } from "@/components/terminal/steps/results";
import { cn } from "@/lib/utils";
import { TerminalStep } from "@/utils/enums";
import { initialState } from "@/utils/initialStates";
import { MessageType } from "@/utils/types";
import { useState } from "react";

export default function TerminalAuditPage() {
  const [terminalStep, setTerminalStep] = useState<TerminalStep>(TerminalStep.INITIAL);
  const [contractContent, setContractContent] = useState<string>("");
  const [promptContent, setPromptContent] = useState<string>("");
  const [auditContent, setAuditContent] = useState<string>("");
  const [terminalState, setTerminalState] =
    useState<Record<TerminalStep, MessageType[]>>(initialState);
  const [stack, setStack] = useState([]);

  const handleGlobalState = (step: TerminalStep, history: MessageType[]) => {
    setTerminalState((prev) => ({ ...prev, [step]: history }));
  };

  console.log(terminalStep);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative container mx-auto px-4 py-16 z-10">
        <h1 className="text-4xl text-center mb-12">Smart Contract Auditor AI</h1>
        <div
          className={cn(
            "bg-black/90 border border-gray-800 rounded-lg p-4",
            "flex flex-col h-[600px] w-full max-w-[800px]",
          )}
        >
          {terminalStep == TerminalStep.INITIAL && (
            <InitialStep
              setTerminalStep={setTerminalStep}
              handleGlobalState={handleGlobalState}
              state={terminalState[TerminalStep.INITIAL]}
            />
          )}
          {terminalStep == TerminalStep.INPUT_ADDRESS && (
            <AddressStep
              setTerminalStep={setTerminalStep}
              handleGlobalState={handleGlobalState}
              state={terminalState[TerminalStep.INPUT_ADDRESS]}
              setContractContent={setContractContent}
            />
          )}
          {terminalStep == TerminalStep.AUDIT_TYPE && (
            <AuditTypeStep
              setTerminalStep={setTerminalStep}
              handleGlobalState={handleGlobalState}
              state={terminalState[TerminalStep.AUDIT_TYPE]}
              setPromptContent={setPromptContent}
              promptContent={promptContent}
            />
          )}
          {terminalStep == TerminalStep.RESULTS && (
            <ResultsStep
              setTerminalStep={setTerminalStep}
              handleGlobalState={handleGlobalState}
              state={terminalState[TerminalStep.RESULTS]}
              setAuditContent={setAuditContent}
              contractContent={contractContent}
              promptContent={promptContent}
              auditContent={auditContent}
            />
          )}
        </div>
      </div>
    </main>
  );
}
