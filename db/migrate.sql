create table public.addresses (
  address text not null,
  expiry timestamp with time zone not null,
  constraint addresses_pkey primary key (address)
) TABLESPACE pg_default;

create index IF not exists addresses_expiry_idx on public.addresses using btree (expiry) TABLESPACE pg_default;

create table public.emails (
  id serial not null,
  recipient text null,
  sender text not null,
  subject text null,
  body text null,
  delivered timestamp with time zone not null,
  constraint emails_pkey primary key (id),
  constraint emails_recipient_fkey foreign KEY (recipient) references addresses (address) on delete CASCADE,
  constraint fk_recipient foreign KEY (recipient) references addresses (address) on delete CASCADE
) TABLESPACE pg_default;

SELECT cron.schedule(
  'delete_expired_addresses',
  '*/5 * * * *',
  $$DELETE FROM addresses WHERE expiry < NOW();$$
);
