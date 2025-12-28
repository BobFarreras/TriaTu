
\restrict 9v9UgUPujCdJleCnIMwV2QNaGpSdmkaq7G5ubYqTKgLRfJAZ2Ml12YkR6rey0zp


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.preference_profiles (user_id, food_preferences, social_tolerance, exclusions)
  VALUES (new.id, '{}', 5, '{}'); -- Valors per defecte
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."decision_outcomes" (
    "decision_id" "uuid" NOT NULL,
    "choice" "text" NOT NULL,
    "reason" "text" NOT NULL,
    "generated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."decision_outcomes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."decision_rooms" (
    "id" "uuid" NOT NULL,
    "host_user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "status" "text" DEFAULT 'OPEN'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."decision_rooms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."decisions" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "status" "text" NOT NULL,
    "context" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."decisions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."group_decisions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "room_id" "uuid",
    "choice" "text" NOT NULL,
    "reason" "text" NOT NULL,
    "candidates_proposed" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."group_decisions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."preference_profiles" (
    "user_id" "uuid" NOT NULL,
    "food_preferences" "text"[] DEFAULT '{}'::"text"[],
    "social_tolerance" integer DEFAULT 5,
    "exclusions" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."preference_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."room_participants" (
    "room_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."room_participants" OWNER TO "postgres";


ALTER TABLE ONLY "public"."decision_outcomes"
    ADD CONSTRAINT "decision_outcomes_pkey" PRIMARY KEY ("decision_id");



ALTER TABLE ONLY "public"."decision_rooms"
    ADD CONSTRAINT "decision_rooms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."decisions"
    ADD CONSTRAINT "decisions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."group_decisions"
    ADD CONSTRAINT "group_decisions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."preference_profiles"
    ADD CONSTRAINT "preference_profiles_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."room_participants"
    ADD CONSTRAINT "room_participants_pkey" PRIMARY KEY ("room_id", "user_id");



ALTER TABLE ONLY "public"."decision_outcomes"
    ADD CONSTRAINT "decision_outcomes_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "public"."decisions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_decisions"
    ADD CONSTRAINT "group_decisions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."decision_rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."room_participants"
    ADD CONSTRAINT "room_participants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."decision_rooms"("id") ON DELETE CASCADE;



CREATE POLICY "Dev policy decisions" ON "public"."decisions" USING (true) WITH CHECK (true);



CREATE POLICY "Dev policy outcomes" ON "public"."decision_outcomes" USING (true) WITH CHECK (true);



CREATE POLICY "Dev policy participants" ON "public"."room_participants" USING (true) WITH CHECK (true);



CREATE POLICY "Dev policy profiles" ON "public"."preference_profiles" USING (true) WITH CHECK (true);



CREATE POLICY "Enable read/write for all (DEV ONLY)" ON "public"."decision_rooms" USING (true) WITH CHECK (true);



CREATE POLICY "Insert group decisions" ON "public"."group_decisions" USING (true) WITH CHECK (true);



CREATE POLICY "Read group decisions" ON "public"."group_decisions" USING (true);



ALTER TABLE "public"."decision_outcomes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."decision_rooms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."decisions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group_decisions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."preference_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."room_participants" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON TABLE "public"."decision_outcomes" TO "anon";
GRANT ALL ON TABLE "public"."decision_outcomes" TO "authenticated";
GRANT ALL ON TABLE "public"."decision_outcomes" TO "service_role";



GRANT ALL ON TABLE "public"."decision_rooms" TO "anon";
GRANT ALL ON TABLE "public"."decision_rooms" TO "authenticated";
GRANT ALL ON TABLE "public"."decision_rooms" TO "service_role";



GRANT ALL ON TABLE "public"."decisions" TO "anon";
GRANT ALL ON TABLE "public"."decisions" TO "authenticated";
GRANT ALL ON TABLE "public"."decisions" TO "service_role";



GRANT ALL ON TABLE "public"."group_decisions" TO "anon";
GRANT ALL ON TABLE "public"."group_decisions" TO "authenticated";
GRANT ALL ON TABLE "public"."group_decisions" TO "service_role";



GRANT ALL ON TABLE "public"."preference_profiles" TO "anon";
GRANT ALL ON TABLE "public"."preference_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."preference_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."room_participants" TO "anon";
GRANT ALL ON TABLE "public"."room_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."room_participants" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






\unrestrict 9v9UgUPujCdJleCnIMwV2QNaGpSdmkaq7G5ubYqTKgLRfJAZ2Ml12YkR6rey0zp

RESET ALL;
