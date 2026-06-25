-- ============================================================
-- PocketModa · Supabase Schema
-- 在 Supabase > SQL Editor 里全选执行
-- ============================================================

-- 1. Profiles (扩展 Supabase auth.users)
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text not null default '',
  role        text not null check (role in ('buyer','seller','admin')) default 'buyer',
  whatsapp    text,
  company     text,
  avatar_url  text,
  verified    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- 新用户注册时自动创建 profile
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'buyer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Products
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  seller_id   uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  brand       text not null default '',
  description text not null default '',
  fabric      text not null check (fabric in ('Silk','Cashmere','Linen','Cotton','Wool','Denim','Leather')),
  region      text not null check (region in ('Milan','Tuscany','Veneto','Naples','Florence')),
  moq         integer not null default 1,
  tier_prices jsonb not null default '[]',
  is_pronto   boolean not null default false,
  stock_qty   integer not null default 0,
  images      text[] not null default '{}',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- 3. Orders
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  buyer_id    uuid not null references public.profiles(id),
  seller_id   uuid not null references public.profiles(id),
  order_type  text not null check (order_type in ('pronto','pre_order')),
  status      text not null default 'pending'
              check (status in ('pending','confirmed','in_production','qc_check','shipped','delivered','cancelled')),
  notes       text,
  total_eur   numeric(10,2) not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 4. Order Items
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid not null references public.products(id),
  quantity    integer not null,
  unit_price  numeric(10,2) not null,
  total       numeric(10,2) not null
);

-- 5. Messages (订单聊天)
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  sender_id   uuid not null references public.profiles(id),
  content     text not null,
  created_at  timestamptz not null default now()
);

-- 自动更新 orders.updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function update_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table public.profiles    enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.messages    enable row level security;

-- Helper: 当前用户角色
create or replace function auth_role()
returns text language sql security definer as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Profiles
create policy "users can read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "admin can read all profiles"
  on public.profiles for select using (auth_role() = 'admin');
create policy "users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Products: 所有登录用户可读，卖家管理自己的商品
create policy "logged in users can read active products"
  on public.products for select using (auth.uid() is not null and (is_active = true or seller_id = auth.uid()));
create policy "sellers can insert products"
  on public.products for insert with check (auth.uid() = seller_id and auth_role() = 'seller');
create policy "sellers can update own products"
  on public.products for update using (auth.uid() = seller_id);
create policy "admin can manage all products"
  on public.products for all using (auth_role() = 'admin');

-- Orders: 买卖双方各自看自己的订单
create policy "buyers see own orders"
  on public.orders for select using (auth.uid() = buyer_id);
create policy "sellers see own orders"
  on public.orders for select using (auth.uid() = seller_id);
create policy "admin sees all orders"
  on public.orders for select using (auth_role() = 'admin');
create policy "buyers can create orders"
  on public.orders for insert with check (auth.uid() = buyer_id and auth_role() = 'buyer');
create policy "sellers can update order status"
  on public.orders for update using (auth.uid() = seller_id);
create policy "admin can update all orders"
  on public.orders for update using (auth_role() = 'admin');

-- Order items
create policy "order participants can read items"
  on public.order_items for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    ) or auth_role() = 'admin'
  );
create policy "buyers can insert order items"
  on public.order_items for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.buyer_id = auth.uid()
    )
  );

-- Messages: 只有订单双方可以读写
create policy "order participants can read messages"
  on public.messages for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    ) or auth_role() = 'admin'
  );
create policy "order participants can send messages"
  on public.messages for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );

-- ============================================================
-- Realtime (聊天实时推送)
-- ============================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.orders;
