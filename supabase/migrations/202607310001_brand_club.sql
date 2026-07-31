create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public)
values ('babycheepy-private', 'babycheepy-private', false)
on conflict (id) do nothing;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  brand_name text not null,
  phone text not null unique,
  line_id text,
  email text not null unique,
  password_hash text not null,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  membership_type text not null default 'brand_club_lifetime' check (membership_type in ('brand_club_lifetime')),
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended', 'rejected')),
  applied_at timestamptz not null default now(),
  paid_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references public.users(id),
  payment_proof_id uuid,
  admin_note text,
  suspended_at timestamptz,
  suspended_reason text,
  expires_at timestamptz,
  ai_model_set_total integer not null default 0 check (ai_model_set_total >= 0),
  ai_model_set_used integer not null default 0 check (ai_model_set_used >= 0),
  images_per_set integer not null default 6,
  mockup_images_per_set integer not null default 1,
  model_images_per_set integer not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at is null),
  check (ai_model_set_used <= ai_model_set_total)
);

create table if not exists public.payment_proofs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  membership_id uuid references public.memberships(id) on delete cascade,
  storage_bucket text not null,
  storage_path text not null,
  original_filename text not null,
  content_type text not null,
  byte_size integer not null,
  sha256 text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'memberships_payment_proof_id_fkey'
      and conrelid = 'public.memberships'::regclass
  ) then
    alter table public.memberships
      add constraint memberships_payment_proof_id_fkey
      foreign key (payment_proof_id) references public.payment_proofs(id)
      deferrable initially deferred;
  end if;
end;
$$;

create table if not exists public.ai_models (
  id uuid primary key default gen_random_uuid(),
  model_code text not null unique,
  display_name text not null,
  preview_bucket text,
  preview_path text,
  approx_age text,
  gender text,
  style text,
  skin_tone text,
  hair_style text,
  suitable_age_range text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_model_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  membership_id uuid not null references public.memberships(id) on delete cascade,
  brand_name text not null,
  product_name text not null,
  product_type text not null,
  ai_model_id uuid not null references public.ai_models(id),
  status text not null default 'draft' check (status in ('draft','submitted','waiting_for_details','accepted','in_progress','review','revision','completed','cancelled')),
  aspect_ratio text not null,
  background_style text not null,
  usage_channel text not null,
  notes text,
  confirmation_checked boolean not null default false,
  credit_debited boolean not null default false,
  revision_rounds_included integer not null default 1,
  revision_rounds_used integer not null default 0,
  started_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_model_request_files (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.ai_model_requests(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  file_kind text not null,
  storage_bucket text not null,
  storage_path text not null,
  original_filename text not null,
  content_type text not null,
  byte_size integer not null,
  sha256 text not null,
  created_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table if not exists public.ai_model_deliverables (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.ai_model_requests(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  deliverable_kind text not null check (deliverable_kind in ('mockup','model_pose_1','model_pose_2','model_pose_3','model_pose_4','model_pose_5')),
  storage_bucket text not null,
  storage_path text not null,
  original_filename text not null,
  content_type text not null,
  byte_size integer not null,
  sha256 text not null,
  created_at timestamptz not null default now(),
  unique (request_id, deliverable_kind),
  unique (storage_bucket, storage_path)
);

create table if not exists public.ai_model_revisions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.ai_model_requests(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  message text not null,
  selected_deliverable_ids text[] not null default '{}',
  status text not null default 'submitted',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_model_credit_transactions (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references public.memberships(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  request_id uuid references public.ai_model_requests(id) on delete set null,
  transaction_type text not null check (transaction_type in ('grant','debit','refund','adjustment')),
  delta integer not null,
  idempotency_key text unique,
  reason text,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.production_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  brand_name text not null,
  product_name text not null,
  product_image_bucket text,
  product_image_path text,
  quantity integer,
  received_at timestamptz,
  started_at timestamptz,
  expected_done_at date,
  current_status text not null default 'รับข้อมูลแล้ว',
  customer_note text,
  internal_note text,
  tracking_number text,
  shipping_carrier text,
  show_to_customer boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.production_status_history (
  id uuid primary key default gen_random_uuid(),
  production_order_id uuid not null references public.production_orders(id) on delete cascade,
  status text not null,
  customer_note text,
  visible_to_customer boolean not null default true,
  changed_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  body text not null,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_value jsonb,
  after_value jsonb,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_touch_updated_at on public.users;
create trigger users_touch_updated_at before update on public.users for each row execute function public.touch_updated_at();
drop trigger if exists memberships_touch_updated_at on public.memberships;
create trigger memberships_touch_updated_at before update on public.memberships for each row execute function public.touch_updated_at();
drop trigger if exists ai_models_touch_updated_at on public.ai_models;
create trigger ai_models_touch_updated_at before update on public.ai_models for each row execute function public.touch_updated_at();
drop trigger if exists ai_model_requests_touch_updated_at on public.ai_model_requests;
create trigger ai_model_requests_touch_updated_at before update on public.ai_model_requests for each row execute function public.touch_updated_at();
drop trigger if exists production_orders_touch_updated_at on public.production_orders;
create trigger production_orders_touch_updated_at before update on public.production_orders for each row execute function public.touch_updated_at();

create or replace function public.register_brand_club_member(
  p_first_name text,
  p_last_name text,
  p_brand_name text,
  p_phone text,
  p_line_id text,
  p_email text,
  p_password_hash text,
  p_payment_storage_bucket text,
  p_payment_storage_path text,
  p_payment_original_filename text,
  p_payment_content_type text,
  p_payment_byte_size integer,
  p_payment_sha256 text
)
returns public.memberships
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users;
  v_membership public.memberships;
  v_payment public.payment_proofs;
begin
  insert into public.users (first_name, last_name, brand_name, phone, line_id, email, password_hash, role)
  values (p_first_name, p_last_name, p_brand_name, p_phone, nullif(p_line_id, ''), lower(p_email), p_password_hash, 'member')
  returning * into v_user;

  insert into public.memberships (
    user_id, membership_type, status, applied_at, paid_at, expires_at,
    ai_model_set_total, ai_model_set_used, images_per_set, mockup_images_per_set, model_images_per_set
  )
  values (v_user.id, 'brand_club_lifetime', 'pending', now(), now(), null, 0, 0, 6, 1, 5)
  returning * into v_membership;

  insert into public.payment_proofs (
    user_id, membership_id, storage_bucket, storage_path, original_filename,
    content_type, byte_size, sha256, status
  )
  values (
    v_user.id, v_membership.id, p_payment_storage_bucket, p_payment_storage_path,
    p_payment_original_filename, p_payment_content_type, p_payment_byte_size, p_payment_sha256, 'pending'
  )
  returning * into v_payment;

  update public.memberships
  set payment_proof_id = v_payment.id
  where id = v_membership.id
  returning * into v_membership;

  insert into public.notifications (user_id, title, body, href)
  values (
    v_user.id,
    'สมัคร Babycheepy Brand Club สำเร็จ',
    'บัญชีของคุณอยู่ระหว่างการตรวจสอบหลักฐานการชำระเงิน',
    '/member-dashboard'
  );

  return v_membership;
end;
$$;

create or replace function public.bootstrap_admin_user(
  p_first_name text,
  p_last_name text,
  p_brand_name text,
  p_phone text,
  p_line_id text,
  p_email text,
  p_password_hash text
)
returns public.users
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user public.users;
begin
  insert into public.users (first_name, last_name, brand_name, phone, line_id, email, password_hash, role)
  values (p_first_name, p_last_name, p_brand_name, p_phone, nullif(p_line_id, ''), lower(p_email), p_password_hash, 'admin')
  on conflict (email) do update
    set role = 'admin',
        password_hash = excluded.password_hash,
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        brand_name = excluded.brand_name,
        phone = excluded.phone,
        line_id = excluded.line_id
  returning * into v_user;
  return v_user;
end;
$$;

create or replace function public.approve_brand_club_member(
  p_membership_id uuid,
  p_admin_id uuid,
  p_note text
)
returns public.memberships
language plpgsql
security definer
set search_path = public
as $$
declare
  v_membership public.memberships;
  v_key text := 'brand-club-initial-credit:' || p_membership_id::text;
begin
  select * into v_membership from public.memberships where id = p_membership_id for update;
  if not found then raise exception 'membership not found'; end if;

  update public.memberships
  set status = 'active',
      membership_type = 'brand_club_lifetime',
      approved_at = coalesce(approved_at, now()),
      approved_by = p_admin_id,
      admin_note = nullif(p_note, ''),
      expires_at = null
  where id = p_membership_id
  returning * into v_membership;

  if not exists (select 1 from public.ai_model_credit_transactions where idempotency_key = v_key) then
    update public.memberships
    set ai_model_set_total = ai_model_set_total + 1
    where id = p_membership_id
    returning * into v_membership;

    insert into public.ai_model_credit_transactions (
      membership_id, user_id, transaction_type, delta, idempotency_key, reason, created_by
    )
    values (p_membership_id, v_membership.user_id, 'grant', 1, v_key, 'initial brand club AI model set', p_admin_id);
  end if;

  return v_membership;
end;
$$;

create or replace function public.set_brand_club_member_status(
  p_membership_id uuid,
  p_admin_id uuid,
  p_status text,
  p_note text,
  p_suspended_reason text
)
returns public.memberships
language plpgsql
security definer
set search_path = public
as $$
declare
  v_membership public.memberships;
begin
  if p_status not in ('pending', 'suspended', 'rejected') then
    raise exception 'invalid membership status';
  end if;

  update public.memberships
  set status = p_status,
      admin_note = nullif(p_note, ''),
      suspended_at = case when p_status = 'suspended' then now() else suspended_at end,
      suspended_reason = case when p_status = 'suspended' then nullif(p_suspended_reason, '') else null end,
      expires_at = null
  where id = p_membership_id
  returning * into v_membership;

  if not found then raise exception 'membership not found'; end if;
  return v_membership;
end;
$$;

create or replace function public.adjust_ai_model_set_credit(
  p_membership_id uuid,
  p_admin_id uuid,
  p_delta integer,
  p_reason text,
  p_idempotency_key text
)
returns public.memberships
language plpgsql
security definer
set search_path = public
as $$
declare
  v_membership public.memberships;
begin
  if p_delta = 0 then raise exception 'delta cannot be zero'; end if;
  select * into v_membership from public.memberships where id = p_membership_id for update;
  if not found then raise exception 'membership not found'; end if;
  if v_membership.ai_model_set_total + p_delta < v_membership.ai_model_set_used then
    raise exception 'credit total cannot be lower than used credit';
  end if;

  update public.memberships
  set ai_model_set_total = ai_model_set_total + p_delta
  where id = p_membership_id
  returning * into v_membership;

  insert into public.ai_model_credit_transactions (
    membership_id, user_id, transaction_type, delta, idempotency_key, reason, created_by
  )
  values (p_membership_id, v_membership.user_id, 'adjustment', p_delta, p_idempotency_key, p_reason, p_admin_id)
  on conflict (idempotency_key) do nothing;

  return v_membership;
end;
$$;

create or replace function public.set_ai_model_request_status(
  p_request_id uuid,
  p_admin_id uuid,
  p_status text,
  p_note text
)
returns public.ai_model_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.ai_model_requests;
  v_membership public.memberships;
  v_key text;
begin
  if p_status not in ('draft','submitted','waiting_for_details','accepted','in_progress','review','revision','completed','cancelled') then
    raise exception 'invalid request status';
  end if;

  select * into v_request from public.ai_model_requests where id = p_request_id for update;
  if not found then raise exception 'request not found'; end if;

  if p_status in ('accepted', 'in_progress') and not v_request.credit_debited then
    select * into v_membership from public.memberships where id = v_request.membership_id for update;
    if v_membership.ai_model_set_total - v_membership.ai_model_set_used <= 0 then
      raise exception 'insufficient ai model set credit';
    end if;
    v_key := 'ai-request-debit:' || p_request_id::text;
    if not exists (select 1 from public.ai_model_credit_transactions where idempotency_key = v_key) then
      update public.memberships
      set ai_model_set_used = ai_model_set_used + 1
      where id = v_request.membership_id;
      insert into public.ai_model_credit_transactions (
        membership_id, user_id, request_id, transaction_type, delta, idempotency_key, reason, created_by
      )
      values (v_request.membership_id, v_request.user_id, v_request.id, 'debit', -1, v_key, 'ai model request accepted', p_admin_id);
    end if;
    v_request.credit_debited := true;
  end if;

  if p_status = 'cancelled' and v_request.credit_debited and v_request.started_at is null then
    v_key := 'ai-request-refund-before-start:' || p_request_id::text;
    if not exists (select 1 from public.ai_model_credit_transactions where idempotency_key = v_key) then
      update public.memberships
      set ai_model_set_used = greatest(ai_model_set_used - 1, 0)
      where id = v_request.membership_id;
      insert into public.ai_model_credit_transactions (
        membership_id, user_id, request_id, transaction_type, delta, idempotency_key, reason, created_by
      )
      values (v_request.membership_id, v_request.user_id, v_request.id, 'refund', 1, v_key, 'cancelled before work started', p_admin_id);
    end if;
    v_request.credit_debited := false;
  end if;

  update public.ai_model_requests
  set status = p_status,
      credit_debited = v_request.credit_debited,
      started_at = case when p_status = 'in_progress' then coalesce(started_at, now()) else started_at end,
      delivered_at = case when p_status = 'completed' then coalesce(delivered_at, now()) else delivered_at end,
      notes = coalesce(nullif(p_note, ''), notes)
  where id = p_request_id
  returning * into v_request;

  return v_request;
end;
$$;

create or replace function public.update_production_order_status(
  p_order_id uuid,
  p_admin_id uuid,
  p_patch jsonb
)
returns public.production_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.production_orders;
  v_status text := coalesce(p_patch->>'current_status', p_patch->>'currentStatus');
  v_customer_note text := coalesce(p_patch->>'customer_note', p_patch->>'customerNote');
begin
  if v_status is null or length(trim(v_status)) = 0 then raise exception 'status is required'; end if;

  update public.production_orders
  set current_status = v_status,
      customer_note = coalesce(nullif(v_customer_note, ''), customer_note),
      internal_note = coalesce(nullif(p_patch->>'internal_note', ''), internal_note),
      tracking_number = coalesce(nullif(p_patch->>'tracking_number', ''), tracking_number),
      shipping_carrier = coalesce(nullif(p_patch->>'shipping_carrier', ''), shipping_carrier),
      started_at = case when v_status in ('กำลังตัด','กำลังเย็บ','กำลังปักหรือสกรีน') then coalesce(started_at, now()) else started_at end
  where id = p_order_id
  returning * into v_order;

  if not found then raise exception 'production order not found'; end if;

  insert into public.production_status_history (
    production_order_id, status, customer_note, visible_to_customer, changed_by
  )
  values (p_order_id, v_status, v_customer_note, true, p_admin_id);

  return v_order;
end;
$$;

create or replace function public.consume_password_reset_token(
  p_token_hash text,
  p_password_hash text
)
returns public.users
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token public.password_reset_tokens;
  v_user public.users;
begin
  select * into v_token
  from public.password_reset_tokens
  where token_hash = p_token_hash
    and consumed_at is null
    and expires_at > now()
  for update;

  if not found then return null; end if;

  update public.users
  set password_hash = p_password_hash
  where id = v_token.user_id
  returning * into v_user;

  update public.password_reset_tokens
  set consumed_at = now()
  where id = v_token.id;

  return v_user;
end;
$$;
