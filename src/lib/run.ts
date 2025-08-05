import * as env from 'env-var';

import Client from '@triton-one/yellowstone-grpc';
import startProcessing from './startProcessing';

export default async () => {
  console.log('Starting service');
  const endpoint = env.get('GEYSER_ENDPOINT').required().asString();
  const xToken = env.get('GEYSER_XTOKEN').default('').asString();
  const commitment = env.get('COMMITMENT').default('confirmed').asString();
  const rpcUrl = env.get('RPC_URL').default('https://api.mainnet-beta.solana.com').asString();

  const client = new Client(endpoint, xToken, {
    'grpc.max_receive_message_length': 64 * 1024 * 1024, // 64MiB
  });

  await startProcessing(client, rpcUrl, commitment);
};
