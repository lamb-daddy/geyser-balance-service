INSERT INTO balances (address, token, balance, decimals, slot, signature)
SELECT DISTINCT ON (address, token)
    address, token, balance, decimals, slot, signature
FROM json_to_recordset(${balances}::json)
    AS new_values(address TEXT, token TEXT, balance NUMERIC, decimals SMALLINT, slot NUMERIC, signature TEXT)
ORDER BY address, token, slot DESC
ON CONFLICT ON CONSTRAINT address_token_idx
DO UPDATE SET
  balance = EXCLUDED.balance,
  decimals = EXCLUDED.decimals,
  slot = EXCLUDED.slot,
  signature = EXCLUDED.signature
WHERE
  balances.slot < EXCLUDED.slot;
