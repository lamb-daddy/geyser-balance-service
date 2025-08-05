CREATE TABLE balances (
    id BIGSERIAL PRIMARY KEY,
    address VARCHAR NOT NULL,
    token VARCHAR NOT NULL,
    balance NUMERIC NOT NULL,
    decimals SMALLINT NOT NULL,
    slot NUMERIC NOT NULL,
    signature VARCHAR NOT NULL
);

ALTER TABLE balances ADD CONSTRAINT address_token_idx UNIQUE (address, token);

CREATE INDEX balances_address_slot_idx ON balances (address, slot DESC);
