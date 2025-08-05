import * as env from "env-var";

import Client, { CommitmentLevel } from "@triton-one/yellowstone-grpc";
import startProcessing from "./startProcessing";

const parseCommitmentLevel = (
  commitment: string | undefined,
): CommitmentLevel | undefined => {
  if (!commitment) {
    return;
  }
  const typedCommitment =
    commitment.toUpperCase() as keyof typeof CommitmentLevel;
  return CommitmentLevel[typedCommitment];
};

export default async () => {
  const endpoint = env.get("GEYSER_ENDPOINT").required().asString();
  const xToken = env.get("GEYSER_XTOKEN").default("").asString();
  const commitment = parseCommitmentLevel(env.get("COMMITMENT").asString());

  const client = new Client(endpoint, xToken, {
    "grpc.max_receive_message_length": 64 * 1024 * 1024, // 64MiB
  });

  await startProcessing(client, commitment);
};
