import { TerminalStep } from "./enums";

export const stepText = {
  [TerminalStep.INITIAL]: "audit method",
  [TerminalStep.INPUT_ADDRESS]: "audit address",
  [TerminalStep.INPUT_PASTE]: "paste audit",
  [TerminalStep.INPUT_UPLOAD]: "upload audit",
  [TerminalStep.AUDIT_TYPE]: "audit type",
  [TerminalStep.RESULTS]: "results",
};
