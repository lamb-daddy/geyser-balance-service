import * as env from 'env-var';
import pgp from 'pg-promise';
import path from 'path';
import { IDbBalance } from './types';

const initOptions = env.get('DEBUG_DB').default('false').asBool()
  ? {
      query(e: pgp.IEventContext) {
        console.log('QUERY:', e.query);
      },
      error(err: any, e: pgp.IEventContext) {
        console.error('DB ERROR:', err);
        console.error('QUERY CONTEXT:', e.query);
      },
    }
  : {};

const db = pgp(initOptions)({
  connectionString: env.get('DATABASE_URL').required().asString(),
});

const upsertBalanceSql = new pgp.QueryFile(
  path.join(process.cwd(), 'src/sql/queries/upsertBalance.sql')
);

const upsertBalancesSql = new pgp.QueryFile(
  path.join(process.cwd(), 'src/sql/queries/upsertBalances.sql')
);

const getBalanceSql = new pgp.QueryFile(path.join(process.cwd(), 'src/sql/queries/getBalance.sql'));

const getMostRecentSlotSql = new pgp.QueryFile(
  path.join(process.cwd(), 'src/sql/queries/getMostRecentSlot.sql')
);

async function upsertBalance(data: IDbBalance): Promise<void> {
  try {
    await db.none(upsertBalanceSql, {
      address: data.address,
      token: data.token,
      balance: data.balance,
      decimals: data.decimals,
      slot: String(data.slot),
      signature: data.signature,
    });
  } catch (error) {
    console.error('DB error while upserting balance occured:', error);
    throw error;
  }
}

async function upsertBalances(data: readonly IDbBalance[]): Promise<void> {
  if (data.length === 0) {
    return;
  }
  try {
    await db.none(upsertBalancesSql, {
      balances: JSON.stringify(data.map((item) => ({ ...item, slot: String(item.slot) }))),
    });
  } catch (error) {
    console.error('DB error while upserting balances occured:', error);
    throw error;
  }
}

async function getBalance(address: string, token: string): Promise<IDbBalance | null> {
  try {
    const balance = await db.oneOrNone<IDbBalance>(getBalanceSql, {
      address,
      token,
    });
    return balance;
  } catch (error) {
    console.error('DB error while retrieving balance occured:', error);
    throw error;
  }
}

async function getMostRecentSlot(): Promise<bigint | null> {
  try {
    const result = await db.oneOrNone<{ max_slot: string | null }>(getMostRecentSlotSql);
    return result?.max_slot ? BigInt(result.max_slot) : null;
  } catch (error) {
    console.error('DB error while retrieving most recent slot:', error);
    throw error;
  }
}

export { db, upsertBalance, upsertBalances, getBalance, getMostRecentSlot };
