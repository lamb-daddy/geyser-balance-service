import { test } from "uvu";
import { expect } from "chai";
import extractBalancesFromParsedTx from "../lib/extractBalancesFromParsedTx";
import { txWithMixedTransfers } from "./fixtures";
import { IDbBalance } from "../lib/types";

test("should extract all token balances from a transaction", () => {
  const balances = extractBalancesFromParsedTx(
    txWithMixedTransfers,
    txWithMixedTransfers.slot,
  );

  const expectedBalances: IDbBalance[] = [
    {
      address: "9yj3zvLS3fDMqi1F8zhkaWfq8TZpZWHe6cz1Sgt7djXf",
      token: "So11111111111111111111111111111111111111112",
      balance: "13599098681482",
      decimals: 9,
      slot: 357886485n,
      signature:
        "5NGFNkHp9DLVd2mPSWiNy5FVk1VVwpCg3hXwkv5xTP14B3Xi4VrdPLPSoCcxNsnax7i4T6WVjywnRn6z2G39NmGh",
    },
    {
      address: "CzVxLcDP5Usb8kwXsLcaAQcv5YeXzE93WHJjvESrNUwd",
      token: "q8yAeu9ggVWK7C9We9JDZAfdyJ9TSXfDixoMS3Tpump",
      balance: "265384253163",
      decimals: 6,
      slot: 357886485n,
      signature:
        "5NGFNkHp9DLVd2mPSWiNy5FVk1VVwpCg3hXwkv5xTP14B3Xi4VrdPLPSoCcxNsnax7i4T6WVjywnRn6z2G39NmGh",
    },
    {
      address: "G5UZAVbAf46s7cKWoyKu8kYTip9DGTpbLZ2qa9Aq69dP",
      token: "So11111111111111111111111111111111111111112",
      balance: "635899524037",
      decimals: 9,
      slot: 357886485n,
      signature:
        "5NGFNkHp9DLVd2mPSWiNy5FVk1VVwpCg3hXwkv5xTP14B3Xi4VrdPLPSoCcxNsnax7i4T6WVjywnRn6z2G39NmGh",
    },
    {
      address: "HddbLbisLdzdaYH8WPggKmyrA9BM7uVEX1kJCMHzxJkA",
      token: "q8yAeu9ggVWK7C9We9JDZAfdyJ9TSXfDixoMS3Tpump",
      balance: "178482767295402",
      decimals: 6,
      slot: 357886485n,
      signature:
        "5NGFNkHp9DLVd2mPSWiNy5FVk1VVwpCg3hXwkv5xTP14B3Xi4VrdPLPSoCcxNsnax7i4T6WVjywnRn6z2G39NmGh",
    },
    {
      address: "HddbLbisLdzdaYH8WPggKmyrA9BM7uVEX1kJCMHzxJkA",
      token: "So11111111111111111111111111111111111111112",
      balance: "105582697366",
      decimals: 9,
      slot: 357886485n,
      signature:
        "5NGFNkHp9DLVd2mPSWiNy5FVk1VVwpCg3hXwkv5xTP14B3Xi4VrdPLPSoCcxNsnax7i4T6WVjywnRn6z2G39NmGh",
    },
    {
      address: "Esb7C313KiZD7ewkqPNja6rgnryaQtB8FntHsnD2xdPC",
      token: "So11111111111111111111111111111111111111112",
      balance: "2181496492",
      decimals: 9,
      slot: 357886485n,
      signature:
        "5NGFNkHp9DLVd2mPSWiNy5FVk1VVwpCg3hXwkv5xTP14B3Xi4VrdPLPSoCcxNsnax7i4T6WVjywnRn6z2G39NmGh",
    },
  ];

  expect(balances).to.deep.equal(expectedBalances);
});

test.run();
