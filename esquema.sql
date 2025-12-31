
\restrict nLfSMvzHVAq2GNQDJLuW2L0ejDHhuiHVBBjCy61hJ4u4WMUuDYFZm2MGwoW8pgd


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
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "voting_mode" "text" DEFAULT 'BLIND'::"text",
    CONSTRAINT "decision_rooms_voting_mode_check" CHECK (("voting_mode" = ANY (ARRAY['BLIND'::"text", 'PUBLIC'::"text"])))
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


CREATE TABLE IF NOT EXISTS "public"."inventory_items" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "quantity" numeric DEFAULT 1 NOT NULL,
    "unit" "text" DEFAULT 'units'::"text" NOT NULL,
    "location" "text" NOT NULL,
    "expiry_date" timestamp with time zone,
    "added_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "emoji" "text"
);


ALTER TABLE "public"."inventory_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."preference_profiles" (
    "user_id" "uuid" NOT NULL,
    "food_preferences" "text"[] DEFAULT '{}'::"text"[],
    "social_tolerance" integer DEFAULT 5,
    "exclusions" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."preference_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."room_candidates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "room_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."room_candidates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."room_participants" (
    "room_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."room_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."saved_recipes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "ingredients" "jsonb" NOT NULL,
    "steps" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "tags" "jsonb" DEFAULT '[]'::"jsonb",
    "prep_time_minutes" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "dietary_tags" "text"[] DEFAULT '{}'::"text"[]
);


ALTER TABLE "public"."saved_recipes" OWNER TO "postgres";


ALTER TABLE ONLY "public"."decision_outcomes"
    ADD CONSTRAINT "decision_outcomes_pkey" PRIMARY KEY ("decision_id");



ALTER TABLE ONLY "public"."decision_rooms"
    ADD CONSTRAINT "decision_rooms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."decisions"
    ADD CONSTRAINT "decisions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."group_decisions"
    ADD CONSTRAINT "group_decisions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."inventory_items"
    ADD CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."preference_profiles"
    ADD CONSTRAINT "preference_profiles_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."room_candidates"
    ADD CONSTRAINT "room_candidates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."room_participants"
    ADD CONSTRAINT "room_participants_pkey" PRIMARY KEY ("room_id", "user_id");



ALTER TABLE ONLY "public"."saved_recipes"
    ADD CONSTRAINT "saved_recipes_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_saved_recipes_dietary_tags" ON "public"."saved_recipes" USING "gin" ("dietary_tags");



ALTER TABLE ONLY "public"."decision_outcomes"
    ADD CONSTRAINT "decision_outcomes_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "public"."decisions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_decisions"
    ADD CONSTRAINT "group_decisions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."decision_rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."inventory_items"
    ADD CONSTRAINT "inventory_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."room_candidates"
    ADD CONSTRAINT "room_candidates_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."decision_rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."room_candidates"
    ADD CONSTRAINT "room_candidates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."room_participants"
    ADD CONSTRAINT "room_participants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."decision_rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saved_recipes"
    ADD CONSTRAINT "saved_recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Dev policy decisions" ON "public"."decisions" USING (true) WITH CHECK (true);



CREATE POLICY "Dev policy outcomes" ON "public"."decision_outcomes" USING (true) WITH CHECK (true);



CREATE POLICY "Dev policy participants" ON "public"."room_participants" USING (true) WITH CHECK (true);



CREATE POLICY "Dev policy profiles" ON "public"."preference_profiles" USING (true) WITH CHECK (true);



CREATE POLICY "Enable read access for all authenticated users" ON "public"."decision_rooms" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read access for participants" ON "public"."room_participants" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable read/write for all (DEV ONLY)" ON "public"."decision_rooms" USING (true) WITH CHECK (true);



CREATE POLICY "Insert group decisions" ON "public"."group_decisions" USING (true) WITH CHECK (true);



CREATE POLICY "Read group decisions" ON "public"."group_decisions" USING (true);



CREATE POLICY "Users can delete their own inventory" ON "public"."inventory_items" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own inventory" ON "public"."inventory_items" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own recipes" ON "public"."saved_recipes" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own inventory" ON "public"."inventory_items" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own inventory" ON "public"."inventory_items" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."decision_outcomes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."decision_rooms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."decisions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group_decisions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."inventory_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."preference_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."room_candidates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."room_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."saved_recipes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "smart_delete_candidates" ON "public"."room_candidates" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "smart_insert_candidates" ON "public"."room_candidates" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "smart_select_candidates" ON "public"."room_candidates" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."decision_rooms"
  WHERE (("decision_rooms"."id" = "room_candidates"."room_id") AND ("decision_rooms"."host_user_id" = "auth"."uid"())))) OR (EXISTS ( SELECT 1
   FROM "public"."decision_rooms"
  WHERE (("decision_rooms"."id" = "room_candidates"."room_id") AND ("decision_rooms"."voting_mode" = 'PUBLIC'::"text"))))));



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



GRANT ALL ON TABLE "public"."inventory_items" TO "anon";
GRANT ALL ON TABLE "public"."inventory_items" TO "authenticated";
GRANT ALL ON TABLE "public"."inventory_items" TO "service_role";



GRANT ALL ON TABLE "public"."preference_profiles" TO "anon";
GRANT ALL ON TABLE "public"."preference_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."preference_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."room_candidates" TO "anon";
GRANT ALL ON TABLE "public"."room_candidates" TO "authenticated";
GRANT ALL ON TABLE "public"."room_candidates" TO "service_role";



GRANT ALL ON TABLE "public"."room_participants" TO "anon";
GRANT ALL ON TABLE "public"."room_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."room_participants" TO "service_role";



GRANT ALL ON TABLE "public"."saved_recipes" TO "anon";
GRANT ALL ON TABLE "public"."saved_recipes" TO "authenticated";
GRANT ALL ON TABLE "public"."saved_recipes" TO "service_role";



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






\unrestrict nLfSMvzHVAq2GNQDJLuW2L0ejDHhuiHVBBjCy61hJ4u4WMUuDYFZm2MGwoW8pgd

RESET ALL;
