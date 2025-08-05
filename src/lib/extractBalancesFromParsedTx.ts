import { IDbBalance, TParsedTransaction } from "./types";

export default (tx: TParsedTransaction): readonly IDbBalance[] =>
  tx.meta.postTokenBalances?.reduce((acc: readonly IDbBalance[], raw) => {
    if (!raw.owner) {
      return [];
    } else {
      return [
        ...acc,
        {
          address: raw.owner,
          balance: raw.uiTokenAmount.amount,
          token: raw.mint,
          decimals: raw.uiTokenAmount.decimals,
          slot: tx.slot,
          signature: tx.transaction.signatures[0],
        },
      ];
    }
  }, []) ?? [];
