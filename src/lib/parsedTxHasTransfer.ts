import {
  identifyTokenInstruction,
  TOKEN_PROGRAM_ADDRESS,
  TokenInstruction,
} from "@solana-program/token";
import { getBase58Codec } from "@solana/kit";
import {
  TParsedTransaction,
  TRawInnerInstruction,
  TRawOuterInstruction,
} from "./types";

const isRawInstructionTransfer = (
  rawIns: TRawInnerInstruction | TRawOuterInstruction,
): boolean => {
  if ("parsed" in rawIns) {
    return (
      rawIns.programId === TOKEN_PROGRAM_ADDRESS &&
      (rawIns.parsed.type === "transfer" ||
        rawIns.parsed.type === "transferChecked")
    );
  } else if (rawIns.programId === TOKEN_PROGRAM_ADDRESS && "data" in rawIns) {
    const ins = identifyTokenInstruction(getBase58Codec().encode(rawIns.data));
    return (
      ins === TokenInstruction.Transfer ||
      ins === TokenInstruction.TransferChecked
    );
  } else {
    return false;
  }
};

export default (tx: TParsedTransaction): boolean =>
  !tx.meta.err && // TODO: check successfull txs from a geyser
  (tx.meta.innerInstructions
    ?.flatMap((inner) => inner.instructions)
    .some(isRawInstructionTransfer) ||
    tx.transaction.message.instructions.some(isRawInstructionTransfer));
