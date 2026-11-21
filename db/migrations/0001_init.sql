-- Esquema inicial: catálogo, inventario, zonas de entrega y pedidos.
-- Postgres estándar (Supabase, Railway o cualquier Postgres ≥ 13). Se aplica con `npm run db:migrate`.
-- Dinero siempre en centavos enteros (MXN). Nunca flotantes.

-- ------------------------------------------------------------- catálogo

create table products (
  id                text primary key,                 -- mismo id que content/products.ts (p. ej. "mezquite-stout-6")
  slug              text not null unique,
  name              text not null,
  style             text not null,
  short_description text not null,
  units_per_pack    integer not null default 1 check (units_per_pack > 0),
  price_cents       integer check (price_cents >= 0), -- null = precio por confirmar
  currency          text not null default 'MXN' check (currency = 'MXN'),
  status            text not null default 'coming-soon' check (status in ('available', 'coming-soon', 'hidden')),
  featured          boolean not null default false,
  specs             jsonb,                            -- { abv, ibu, srm, volumeMl }
  image             jsonb,                            -- { src, alt, width, height }
  sku               text unique,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Sin fila en inventory = el producto no lleva control de stock (se puede pedir sin límite).
create table inventory (
  product_id text primary key references products (id) on delete cascade,
  stock      integer not null default 0 check (stock >= 0),
  -- Unidades apartadas por pedidos en proceso de pago (Fase 3).
  reserved   integer not null default 0 check (reserved >= 0),
  updated_at timestamptz not null default now(),
  check (reserved <= stock)
);

-- ------------------------------------------------------------- entregas

create table delivery_zones (
  id              text primary key,                   -- p. ej. "cd-juarez"
  name            text not null,
  shipping_cents  integer check (shipping_cents >= 0), -- null = por confirmar
  min_order_cents integer check (min_order_cents >= 0),
  active          boolean not null default true,
  sort_order      integer not null default 0
);

-- ------------------------------------------------------------- pedidos (se usan desde la Fase 3)

create table orders (
  id               uuid primary key default gen_random_uuid(),
  -- Token largo y no adivinable para /pedido/[token]. Nunca exponer el id secuencialmente.
  public_token     text not null unique,
  status           text not null default 'pending' check (status in (
                     'pending',    -- creado, esperando pago
                     'paid',       -- pago confirmado por webhook
                     'rejected',   -- pago rechazado
                     'expired',    -- la reserva venció sin pago
                     'preparing', 'shipped', 'delivered',
                     'cancelled', 'refunded')),
  subtotal_cents   integer not null check (subtotal_cents >= 0),
  shipping_cents   integer not null default 0 check (shipping_cents >= 0),
  total_cents      integer not null check (total_cents >= 0),
  currency         text not null default 'MXN',
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  address          jsonb not null,                    -- { calle, colonia, cp, referencias }
  zone_id          text references delivery_zones (id),
  notes            text,
  age_confirmed    boolean not null default false,
  terms_accepted   boolean not null default false,
  payment_provider text,                              -- 'mercadopago' | 'stripe'
  payment_id       text,
  reserved_until   timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check (total_cents = subtotal_cents + shipping_cents)
);

create index orders_status_idx on orders (status, created_at desc);
create unique index orders_payment_idx on orders (payment_provider, payment_id) where payment_id is not null;

create table order_items (
  order_id         uuid not null references orders (id) on delete cascade,
  product_id       text not null references products (id),
  -- Copia del nombre y del precio al momento de comprar: el catálogo puede cambiar después.
  product_name     text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity         integer not null check (quantity > 0),
  primary key (order_id, product_id)
);

-- ------------------------------------------------------------- updated_at automático

create function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at  before update on products  for each row execute function set_updated_at();
create trigger inventory_updated_at before update on inventory for each row execute function set_updated_at();
create trigger orders_updated_at    before update on orders    for each row execute function set_updated_at();

-- ------------------------------------------------------------- seguridad
-- El sitio se conecta con DATABASE_URL desde el servidor (dueño de las tablas, no le afecta RLS).
-- RLS sin políticas cierra el acceso por la API pública de Supabase (anon/authenticated).
-- En un Postgres sin Supabase (Railway) no estorba.

alter table products       enable row level security;
alter table inventory      enable row level security;
alter table delivery_zones enable row level security;
alter table orders         enable row level security;
alter table order_items    enable row level security;
