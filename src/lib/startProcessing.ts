import { inspect } from "node:util";

import Client, {
  CommitmentLevel,
  SubscribeRequest,
  txEncode,
  txErrDecode,
} from "@triton-one/yellowstone-grpc";
import { upsertBalances } from "./db";
import extractBalancesFromParsedTx from "./extractBalancesFromParsedTx";

export default async (
  client: Client,
  commitment: CommitmentLevel | undefined,
) => {
  const stream = await client.subscribe();
  const streamClosed = new Promise<void>((resolve, reject) => {
    stream.on("error", (error) => {
      reject(error);
      stream.end();
    });
    stream.on("end", () => {
      resolve();
    });
    stream.on("close", () => {
      resolve();
    });
  });

  stream.on("data", async (data) => {
    if (data.transaction) {
      const slot = data.transaction.slot;
      const message = data.transaction.transaction;
      const tx = txEncode.encode(
        message,
        txEncode.encoding.JsonParsed,
        255,
        true,
      );
      if (message.meta.err) {
        const err = txErrDecode.decode(message.meta.err.err);
        console.log(
          `TX filters: ${data.filters}, slot#${slot}, err: ${inspect(err)}}`,
        );
      }

      await upsertBalances(extractBalancesFromParsedTx(tx));
    }
  });

  const request: SubscribeRequest = {
    accounts: {},
    slots: {},
    transactions: {},
    transactionsStatus: {},
    entry: {},
    blocks: {},
    blocksMeta: {},
    commitment,
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
