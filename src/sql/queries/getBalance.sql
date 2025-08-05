SELECT
    id,
    address,
    token,
    balance,
    decimals,
    slot,
    signature
FROM balances
WHERE address = ${address} AND token = ${token};
