import { Message, TerminalStep } from "./enums";

export const initialState = {
  [TerminalStep.INITIAL]: [
    {
      type: Message.SYSTEM,
      content:
        "Welcome to Smart Contract Auditor AI. Choose an option:\n\n1. Input contract address\n2. Upload file\n3. Paste code",
    },
  ],
  [TerminalStep.INPUT_ADDRESS]: [
    {
      type: Message.SYSTEM,
      content: "Input a contract address to get started",
    },
  ],
  [TerminalStep.INPUT_PASTE]: [
    {
      type: Message.SYSTEM,
      content: "Type or paste your smart contract",
    },
  ],
  [TerminalStep.INPUT_UPLOAD]: [
    {
      type: Message.SYSTEM,
      content: "Drag + Drop, or press below, to upload a .sol or .rs file",
    },
  ],
  [TerminalStep.AUDIT_TYPE]: [
    {
      type: Message.SYSTEM,
      content:
        "Before we start, which type of audit do you want?\n\n1. Security Audit\n2. Gas Optimization Audit",
    },
  ],
  [TerminalStep.RESULTS]: [],
};
