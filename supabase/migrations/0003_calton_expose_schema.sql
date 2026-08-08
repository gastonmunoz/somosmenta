-- A schema existing in Postgres is not enough for supabase-js/PostgREST to see
-- it — it must also be added to the Data API's exposed-schemas list, or every
-- request against it fails with PGRST106 ("Invalid schema"). This project's
-- existing exposed list was: public, graphql_public, habitar, flowertime_crm,
-- gym, ideas, trading, prestadores, trading_bot_pump.

ALTER ROLE authenticator SET pgrst.db_schemas = 'public, graphql_public, habitar, flowertime_crm, gym, ideas, trading, prestadores, trading_bot_pump, calton';
NOTIFY pgrst, 'reload config';

-- Grant service_role access to the new schema. Only service_role — anon/authenticated
-- are intentionally left out since the app only ever talks to calton.* via the
-- service role key, and RLS with no policies would zero them out anyway.
GRANT USAGE ON SCHEMA calton TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA calton TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA calton TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA calton TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA calton GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA calton GRANT ALL ON ROUTINES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA calton GRANT ALL ON SEQUENCES TO service_role;
