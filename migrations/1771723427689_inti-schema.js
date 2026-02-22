/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "bigserial",
      primaryKey: true,
    },
    email: {
      type: "text",
      notNull: true,
      unique: true,
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createTable("wallets", {
    id: {
      type: "bigserial",
      primaryKey: true,
    },
    user_id: {
      type: "bigint",
      references: "users",
      onDelete: "CASCADE",
      unique: true,
    },
    wallet_type: {
      type: "text",
      notNull: true,
      default: "USER",
      check: "wallet_type IN ('USER','SYSTEM')",
    },
    balance: {
      type: "numeric(15,2)",
      notNull: true,
      default: 0,
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createTable("transactions", {
    id: {
      type: "bigserial",
      primaryKey: true,
    },
    wallet_id: {
      type: "bigint",
      notNull: true,
      references: "wallets",
      onDelete: "CASCADE",
    },
    type: {
      type: "text",
      notNull: true,
      check: "type IN ('Topup','Bonus','Credit','Debit')",
    },
    amount: {
      type: "numeric(15,2)",
      notNull: true,
      check: "amount > 0",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createTable("ledger_entries", {
    id: {
      type: "bigserial",
      primaryKey: true,
    },
    transaction_id: {
      type: "bigint",
      notNull: true,
      references: "transactions",
      onDelete: "CASCADE",
    },
    wallet_id: {
      type: "bigint",
      notNull: true,
      references: "wallets",
      onDelete: "CASCADE",
    },
    entry_type: {
      type: "text",
      notNull: true,
      check: "entry_type IN ('DEBIT','CREDIT')",
    },
    amount: {
      type: "numeric(15,2)",
      notNull: true,
      check: "amount > 0",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.createTable("idempotency_keys", {
    id: {
      type: "bigserial",
      primaryKey: true,
    },
    idempotency_key: {
      type: "uuid",
      notNull: true,
      unique: true,
    },
    response: {
      type: "jsonb",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.sql(`
    INSERT INTO wallets (wallet_type, balance)
    VALUES ('SYSTEM', 0);
  `);
};

export const down = (pgm) => {
  pgm.dropTable("idempotency_keys");
  pgm.dropTable("ledger_entries");
  pgm.dropTable("transactions");
  pgm.dropTable("wallets");
  pgm.dropTable("users");
};
