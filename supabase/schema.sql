-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
-- Links to auth.users and stores application-specific user data
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  name text,
  mobile text,
  outlaw_id text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone" 
on public.profiles for select 
using ( true );

create policy "Users can insert their own profile" 
on public.profiles for insert 
with check ( auth.uid() = id );

create policy "Users can update own profile" 
on public.profiles for update 
using ( auth.uid() = id );

-- PRODUCTS TABLE
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  image_url text,
  category text,
  stock_quantity integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for products
alter table public.products enable row level security;

-- Policies for products
create policy "Products are viewable by everyone" 
on public.products for select 
using ( true );

-- (Optional) Policy for admin to insert/update products 
-- Assuming for now that service_role or dashboard is used for management.

-- CART_ITEMS TABLE
create table public.cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  quantity integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Prevent duplicate rows for same user+product, enforce uniqueness
  unique(user_id, product_id)
);

-- Enable RLS for cart_items
alter table public.cart_items enable row level security;

-- Policies for cart_items
create policy "Users can view their own cart items" 
on public.cart_items for select 
using ( auth.uid() = user_id );

create policy "Users can insert into their own cart" 
on public.cart_items for insert 
with check ( auth.uid() = user_id );

create policy "Users can update their own cart items" 
on public.cart_items for update 
using ( auth.uid() = user_id );

create policy "Users can delete their own cart items" 
on public.cart_items for delete 
using ( auth.uid() = user_id );

-- STORAGE BUCKETS (If needed)
-- insert into storage.buckets (id, name) values ('products', 'products');
-- insert into storage.policies (name, definition, bucket_id, read) values ('Public Access', 'true', 'products', true);

-- ORDERS TABLE
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  order_number text unique not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric not null,
  shipping_cost numeric default 0,
  total numeric not null,
  -- Shipping info
  shipping_name text not null,
  shipping_email text not null,
  shipping_phone text,
  shipping_address text not null,
  shipping_city text not null,
  shipping_state text,
  shipping_zip text not null,
  shipping_country text default 'India',
  -- Payment info
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_method text default 'razorpay',
  razorpay_payment_id text,
  razorpay_order_id text,
  -- Timestamps
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for orders
alter table public.orders enable row level security;

-- Policies for orders
create policy "Users can view their own orders" 
on public.orders for select 
using ( auth.uid() = user_id );

create policy "Users can create their own orders" 
on public.orders for insert 
with check ( auth.uid() = user_id );

-- ORDER_ITEMS TABLE
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products on delete set null,
  product_name text not null,
  product_price numeric not null,
  product_image text,
  quantity integer not null,
  subtotal numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for order_items
alter table public.order_items enable row level security;

-- Policies for order_items (via order relationship)
create policy "Users can view their own order items" 
on public.order_items for select 
using ( 
  exists (
    select 1 from public.orders 
    where orders.id = order_items.order_id 
    and orders.user_id = auth.uid()
  )
);

create policy "Users can create their own order items" 
on public.order_items for insert 
with check ( 
  exists (
    select 1 from public.orders 
    where orders.id = order_items.order_id 
    and orders.user_id = auth.uid()
  )
);


-- INITIAL SEED DATA (Optional - basic t-shirts)
insert into public.products (name, description, price, image_url, category, stock_quantity)
values 
  (
    'Outlaw Logo Tee', 
    'A premium black t-shirt with a small, minimalist OUTLAW text logo on the chest in red.', 
    45.00, 
    '/images/outlaw-tee-minimal-logo.png', 
    't-shirt', 
    100
  ),
  (
    'Skull Graphic Tee', 
    'Black streetwear t-shirt with a bold, edgy skull graphic design in dark red and white.', 
    55.00, 
    '/images/outlaw-tee-skull-graphic.png', 
    't-shirt', 
    50
  ),
  (
    'Vintage Distressed Tee', 
    'Distressed, vintage-wash dark grey t-shirt with rips and heavy wash effects.', 
    60.00, 
    '/images/outlaw-tee-vintage-distressed.png', 
    't-shirt', 
    30
  );
