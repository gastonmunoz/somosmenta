-- Fixed-window API rate limiting, backed by plain Postgres — no Redis/Upstash
-- needed at this volume. One row per (route, IP); check_rate_limit() is the
-- atomic check-and-increment called from src/lib/rate-limit.ts.

create table if not exists calton.rate_limits (
  key text primary key,
  window_start timestamptz not null default now(),
  count integer not null default 1
);

alter table calton.rate_limits enable row level security;

-- Returns true if the call is allowed. Resets the window (and count) once
-- p_window_seconds has elapsed since window_start, otherwise increments and
-- compares against p_limit.
create or replace function calton.check_rate_limit(p_key text, p_limit int, p_window_seconds int)
returns boolean
language plpgsql
security definer
set search_path = calton
as $$
declare
  v_count int;
begin
  insert into calton.rate_limits (key, window_start, count)
  values (p_key, now(), 1)
  on conflict (key) do update
    set count = case
          when calton.rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
            then 1
          else calton.rate_limits.count + 1
        end,
        window_start = case
          when calton.rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
            then now()
          else calton.rate_limits.window_start
        end
  returning count into v_count;

  return v_count <= p_limit;
end;
$$;
