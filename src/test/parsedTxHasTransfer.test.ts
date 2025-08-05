import { test } from "uvu";
import { expect } from "chai";
import parsedTxHasTransfer from "../lib/parsedTxHasTransfer";
import {
  txWithInnerTransfer,
  txWithMixedTransfers,
  txWithoutTokenTransfers,
} from "./fixtures";

test("should return true for a transaction with inner instructions", () => {
  const result = parsedTxHasTransfer(txWithInnerTransfer);
  expect(result).to.be.true;
});

test("should return true for a transaction with mixed instructions", () => {
  const result = parsedTxHasTransfer(txWithMixedTransfers);
  expect(result).to.be.true;
});

test("should return false for a transaction without token transfers", () => {
  const result = parsedTxHasTransfer(txWithoutTokenTransfers);
  expect(result).to.be.false;
});

test.run();
