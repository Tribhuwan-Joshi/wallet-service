# Wallet Service

A closed-loop wallet system for high traffic applications having data integrity as top priority.

---

# Tech Stack

- APIs - ExpressJS - Lightweight and un-opinionated. I am familiar with NodeJS.
- DBMS - PostgreSQL - Strong ACID guarantees.
- Container - Docker - Used to ship and run the service easily.
- Migration - node-pg-migrate - To manage schema changes.
- Validation - Zod - Minimal validation before DB interaction.

---

# Assumptions

- API gateway already prefixes routes with `/api`.
- Authentication service already exists.
- Error handling is minimal and not production-polished.

---

# Models

## Users

- id (bigserial, primary key)
- email (unique, not null)
- created_at

One user represents one account holder.

---

## Wallets

- id (bigserial, primary key)
- user_id (unique, FK -> users.id)
- wallet_type (USER | SYSTEM)
- balance
- created_at

Each user has exactly one wallet.  
There is one SYSTEM wallet.

Relationship:

users 1 -> 1 wallets

---

## Transactions

- id
- wallet_id (FK -> wallets.id)
- type (Topup | Bonus | Credit | Debit)
- amount
- created_at

Relationship:

wallets 1 -> N transactions

---

## Ledger Entries

- id
- transaction_id (FK -> transactions.id)
- wallet_id (FK -> wallets.id)
- entry_type (DEBIT | CREDIT)
- amount
- created_at

Implements double-entry bookkeeping.

Each transaction creates:
- One DEBIT entry
- One CREDIT entry

NOTE: Although I am saving ledger, we can use it in special cases to compute balance, as I have balance field in wallet. Computing balance using double-entry ledger sound not-so-optimal to me. We can use this in verification process or audit.

---

## Idempotency Keys

- id
- idempotency_key (unique)
- response (jsonb, optional)
- created_at

Used to prevent duplicate transaction execution.

---

# Design Decisions

## User Creation

User and Wallet are created inside a single transaction.  
This guarantees no user exists without a wallet.

---

# Concurrency and Race Condition Handling

- Using BEGIN / COMMIT for atomic operations.
- Using SELECT ... FOR UPDATE to lock wallet row.
- Prevents double-spend.
- Single client connection per transaction by using pooling through pg.pool

---

# Deadlock Avoidance

- Always locking wallet first.
- Deterministic order of operations.
- Consistent locking pattern.

---

# Idempotency

- Inserting idempotency key at the start of transaction.
- Using UNIQUE constraint to prevent duplicates.
- Returning 409 on duplicate key.
- I am not using json response replay for now to keep it simple.

---

# Error Handling

- Duplicate email returns 400.
- Unique constraint violations mapped manually.
- Other DB errors bubble up.
- I am not handling error gracefully much, have created an AppError class but internal erros like duplicate keys are getting thrown in console.

# Setup and Run with Docker

## Prerequisite

- Docker installed

---

## Spin Up the Application

From project root:

```bash
docker compose down -v
docker compose up --build
```

This will:

- Start PostgreSQL container
- Build the app container
- Run migrations automatically
- Start the server

App will be available at:

http://localhost:5000

---

## Verify Database

Enter the DB container:

```bash
docker exec -it wallet-db psql -U postgres -d walletdb
```

Check tables:

```sql
\dt
SELECT * FROM wallets;
```

SYSTEM wallet should exist.

---

# API Testing

I am assuming API gateway already prefixes routes with `/api`.

Base route:

http://localhost:5000/api

---

## 1. Create User

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

This creates:
- user
- wallet automatically

---

## 2. Get Wallet

```bash
curl http://localhost:5000/api/wallet/1
```

- get wallet info for userId 1

---

## 3. Create Transaction

Idempotency key expects a UUID.

I am expecting that idempotency key would be given from frontend API interceptor.

For testing, here are some UUIDv4 values:

550e8400-e29b-41d4-a716-446655440000  
9b2d6f3e-5f8a-4b2d-9a2f-2c9a4f3a8e11  
3f1c2d9a-7e4b-4d8f-a3c2-8b1f6d5e9a22  

Example request:

```bash
curl -X POST http://localhost:5000/api/wallet/transactions/1 \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{"type":"Credit","amount":100}'
```
- You can give type of - Credit, Debit, Topup and Bonus
If you send the same idempotency key again:

- It returns 409
- No duplicate transaction will happen

---

## 4. Get Transactions for userId 1

```bash
curl http://localhost:5000/api/wallet/transactions/1?page=1&limit=10
```
- queries are optional, I am taking them as page = 1, limit = 10 by default

---

# Reset Everything

To reset database and start fresh:

```bash
docker compose down -v
docker compose up --build
```

This removes DB volume and recreates schema.
I haven't hosted it cuz verfication and inspecting the DB would be hard in that case.