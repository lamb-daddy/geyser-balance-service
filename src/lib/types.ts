import { MapTransactionEncodingToReturnType } from "@triton-one/yellowstone-grpc/dist/types/types";

export type TParsedTransaction = MapTransactionEncodingToReturnType[4];
export type TRawInnerInstruction = NonNullable<
  TParsedTransaction["meta"]["innerInstructions"]
>[number]["instructions"][number];
export type TRawOuterInstruction =
  TParsedTransaction["transaction"]["message"]["instructions"][number];

export interface IDbBalance {
  address: string;
  token: string;
  balance: string;
  decimals: number;
  slot: bigint;
  signature: string;
}
