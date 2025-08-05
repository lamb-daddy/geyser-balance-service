INSERT INTO balances (address, token, balance, decimals, slot, signature)
VALUES (${address}, ${token}, ${balance}, ${decimals}, ${slot}, ${signature})
ON CONFLICT ON CONSTRAINT address_token_idx
DO UPDATE SET
  balance = EXCLUDED.balance,
  decimals = EXCLUDED.decimals,
  slot = EXCLUDED.slot,
  signature = EXCLUDED.signature
WHERE
  balances.slot < EXCLUDED.slot;

