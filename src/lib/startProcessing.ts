import { inspect } from 'node:util';

import Client, {
  CommitmentLevel,
  SubscribeRequest,
  SubscribeUpdate,
  txEncode,
  txErrDecode,
} from '@triton-one/yellowstone-grpc';

import { getMostRecentSlot, upsertBalances } from './db';
import extractBalancesFromParsedTx from './extractBalancesFromParsedTx';
import { Commitment, createSolanaRpc } from '@solana/kit';

const parseCommitmentLevel = (commitment: string | undefined): CommitmentLevel | undefined => {
  if (!commitment) {
    return;
  }
  const typedCommitment = commitment.toUpperCase() as keyof typeof CommitmentLevel;
  return CommitmentLevel[typedCommitment];
};

export default async (client: Client, rpcUrl: string, commitment: string) => {
  console.log('Start processing transactions');
  let count = 0;
  const rpc = createSolanaRpc(rpcUrl);

  const stream = await client.subscribe();
  const streamClosed = new Promise<void>((resolve, reject) => {
    stream.on('error', (error) => {
      console.error('Stream error:', error);
      reject(error);
    });
    stream.on('end', resolve);
    stream.on('close', resolve);
  });

  stream.on('data', async (data: SubscribeUpdate) => {
    if (data.transaction) {
      const slot = data.transaction.slot;
      const message = data.transaction.transaction;
      if (!message || !message.meta) return;
      const tx = txEncode.encode(message, txEncode.encoding.JsonParsed, 255, true);
      if (message.meta.err) {
        const err = txErrDecode.decode(message.meta.err.err);
        console.log(`TX filters: ${data.filters}, slot#${slot}, err: ${inspect(err)}}`);
      }
      const balances = extractBalancesFromParsedTx(tx, BigInt(slot));
      try {
        await upsertBalances(balances);
        if (++count % 10000 === 0) {
          const [recentSlotFromDb, recentSlotFromRpc] = await Promise.all([
            getMostRecentSlot(),
            rpc.getSlot({ commitment: commitment as Commitment }).send(),
          ]);
          const lag = recentSlotFromRpc - (recentSlotFromDb ?? 0n);
          console.log(count, 'transactions has been processed. Slots lag:', Number(lag));
        }
      } catch (e) {
        console.error('Error upserting balances', balances, e);
      }
    }
  });

  const request: SubscribeRequest = {
    accounts: {},
    slots: {},
    transactions: {
      client: {
        vote: false,
        failed: false,
        accountInclude: [],
        accountExclude: [],
        accountRequired: [],
      },
    },
    transactionsStatus: {},
    entry: {},
    blocks: {},
    blocksMeta: {},
    commitment: parseCommitmentLevel(commitment),
    accountsDataSlice: [],
    ping: undefined,
  };

  await new Promise<void>((resolve, reject) => {
    stream.write(request, (err: unknown) => {
      if (err === null || err === undefined) {
        resolve();
      } else {
        reject(err);
      }
    });
  }).catch((reason) => {
    console.error(reason);
    throw reason;
  });
  await streamClosed;
};
