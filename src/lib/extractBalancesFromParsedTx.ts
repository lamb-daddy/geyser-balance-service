import { TOKEN_PROGRAM_ADDRESS } from '@solana-program/token';
import { IDbBalance, TParsedTransaction } from './types';

export default (tx: TParsedTransaction, slot: bigint): readonly IDbBalance[] =>
  tx.meta.postTokenBalances?.reduce((acc: readonly IDbBalance[], raw) => {
    if (!raw.owner || raw.programId !== TOKEN_PROGRAM_ADDRESS) {
      return acc;
    } else {
      return [
        ...acc,
        {
          address: raw.owner,
          balance: raw.uiTokenAmount.amount,
          token: raw.mint,
          decimals: raw.uiTokenAmount.decimals,
          slot,
          signature: tx.transaction.signatures[0],
        },
      ];
    }
  }, []) ?? [];
