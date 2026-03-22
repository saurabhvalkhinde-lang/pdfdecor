-- =============================================
-- Supabase Migration: payment orders + user subscription fields
-- =============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan') THEN
    CREATE TYPE public.subscription_plan AS ENUM ('free', 'pro');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE public.subscription_status AS ENUM (
      'none','active','trialing','past_due','canceled','expired'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_order_status') THEN
    CREATE TYPE public.payment_order_status AS ENUM (
      'created','attempted','paid','failed','cancelled'
    );
  END IF;
END $$;

-- Add subscription columns to users (safe, idempotent)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS plan            public.subscription_plan   NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS status          public.subscription_status NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS start_date      timestamptz,
  ADD COLUMN IF NOT EXISTS end_date        timestamptz,
  ADD COLUMN IF NOT EXISTS razorpay_subscription_id text;

CREATE UNIQUE INDEX IF NOT EXISTS users_rzp_sub_id_unique
  ON public.users (razorpay_subscription_id)
  WHERE razorpay_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS users_sub_status_idx ON public.users (status);
CREATE INDEX IF NOT EXISTS users_sub_end_idx    ON public.users (end_date);

-- payment_orders table
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id                   uuid     PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid     NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  razorpay_order_id    text     NOT NULL,
  receipt              text,
  plan                 public.subscription_plan   NOT NULL DEFAULT 'pro',
  amount_paise         integer  NOT NULL CHECK (amount_paise > 0),
  currency             text     NOT NULL DEFAULT 'INR',
  status               public.payment_order_status NOT NULL DEFAULT 'created',
  razorpay_payment_id  text,
  razorpay_signature   text,
  failure_code         text,
  failure_description  text,
  notes                jsonb    NOT NULL DEFAULT '{}',
  metadata             jsonb    NOT NULL DEFAULT '{}',
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  attempted_at         timestamptz,
  paid_at              timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS po_rzp_order_id_unique ON public.payment_orders (razorpay_order_id);
CREATE INDEX IF NOT EXISTS po_user_id_idx   ON public.payment_orders (user_id);
CREATE INDEX IF NOT EXISTS po_status_idx    ON public.payment_orders (status);
CREATE INDEX IF NOT EXISTS po_created_idx   ON public.payment_orders (created_at DESC);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_po_updated_at ON public.payment_orders;
CREATE TRIGGER trg_po_updated_at
BEFORE UPDATE ON public.payment_orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "po_select_own" ON public.payment_orders;
CREATE POLICY "po_select_own" ON public.payment_orders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "po_insert_own" ON public.payment_orders;
CREATE POLICY "po_insert_own" ON public.payment_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "po_no_update" ON public.payment_orders;
CREATE POLICY "po_no_update" ON public.payment_orders
  FOR UPDATE USING (false);

DROP POLICY IF EXISTS "po_no_delete" ON public.payment_orders;
CREATE POLICY "po_no_delete" ON public.payment_orders
  FOR DELETE USING (false);
