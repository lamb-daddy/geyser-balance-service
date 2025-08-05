import pgp from "pg-promise";
import path from "path";
import { IDbBalance } from "./types";

const db = pgp()({
  connectionString: process.env.DATABASE_URL,
});

const upsertBalanceSql = new pgp.QueryFile(
  path.join(__dirname, "../sql/queries/upsertBalance.sql"),
);

const upsertBalancesSql = new pgp.QueryFile(
  path.join(__dirname, "../sql/queries/upsertBalances.sql"),
);

const getBalanceSql = new pgp.QueryFile(
  path.join(__dirname, "../sql/queries/getBalance.sql"),
);

async function upsertBalance(data: IDbBalance): Promise<void> {
  try {
    await db.none(upsertBalanceSql, {
      address: data.address,
      token: data.token,
      balance: data.balance,
      decimals: data.decimals,
      slot: data.slot,
      signature: data.signature,
    });
  } catch (error) {
    console.error("DB error while upserting balance occured:", error);
    throw error;
  }
}

async function upsertBalances(data: readonly IDbBalance[]): Promise<void> {
  try {
    await db.none(upsertBalancesSql, {
      balances: JSON.stringify(data),
    });
  } catch (error) {
    console.error("DB error while upserting balances occured:", error);
    throw error;
  }
}

async function getBalance(
  address: string,
  token: string,
): Promise<IDbBalance | null> {
  try {
    const balance = await db.oneOrNone<IDbBalance>(getBalanceSql, {
      address,
      token,
    });
    return balance;
  } catch (error) {
    console.error("DB error while retrieving balance occured:", error);
    throw error;
  }
}

export { db, upsertBalance, upsertBalances, getBalance };
