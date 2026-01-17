
\restrict P62LHc9JyFBtQNu0ValxdPdmtZULvxufTRf2jCmnCohmkAeJtMdhYIEVWbOlTzT


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



CREATE OR REPLACE FUNCTION "public"."check_rate_limit"("_key" "text", "_limit" integer, "_window_seconds" integer) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    _current_count integer;
    _window_start timestamptz;
BEGIN
    -- Intentem llegir l'estat actual
    SELECT count, window_start INTO _current_count, _window_start
    FROM public.rate_limits
    WHERE key = _key;

    -- Cas A: No existeix el registre -> El creem
    IF NOT FOUND THEN
        INSERT INTO public.rate_limits (key, count, window_start)
        VALUES (_key, 1, now());
        RETURN true;
    END IF;

    -- Cas B: La finestra de temps ha caducat -> Resetegem el comptador
    IF now() > _window_start + (_window_seconds || ' seconds')::interval THEN
        UPDATE public.rate_limits
        SET count = 1, window_start = now()
        WHERE key = _key;
        RETURN true;
    END IF;

    -- Cas C: Dins la finestra -> Comprovem si ha superat el límit
    IF _current_count >= _limit THEN
        RETURN false; -- BLOQUEJAT
    ELSE
        -- Incrementem
        UPDATE public.rate_limits
        SET count = count + 1
        WHERE key = _key;
        RETURN true;
    END IF;
END;
$$;


ALTER FUNCTION "public"."check_rate_limit"("_key" "text", "_limit" integer, "_window_seconds" integer) OWNER TO "postgres";


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


CREATE OR REPLACE FUNCTION "public"."has_room_access"("_room_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- Seguretat: Si no hi ha user o room, fora
  IF auth.uid() IS NULL OR _room_id IS NULL THEN 
    RETURN false; 
  END IF;

  -- 1. Check Host
  IF EXISTS (SELECT 1 FROM public.decision_rooms WHERE id = _room_id AND host_user_id = auth.uid()) THEN
    RETURN true;
  END IF;

  -- 2. Check Participant
  IF EXISTS (SELECT 1 FROM public.room_participants WHERE room_id = _room_id AND user_id = auth.uid()) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;


ALTER FUNCTION "public"."has_room_access"("_room_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_room_member"("_room_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM room_participants 
    WHERE room_id = _room_id 
    AND user_id = auth.uid()
  );
END;
$$;


ALTER FUNCTION "public"."is_room_member"("_room_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_room_participant"("_room_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.room_participants 
    WHERE room_id = _room_id 
    AND user_id = auth.uid()
  );
END;
$$;


ALTER FUNCTION "public"."is_room_participant"("_room_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."keep_latest_decisions"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Esborra les decisions antigues d'aquesta sala, deixant només les 50 més recents
  DELETE FROM group_decisions
  WHERE id IN (
    SELECT id FROM group_decisions
    WHERE room_id = NEW.room_id
    ORDER BY created_at DESC
    OFFSET 50 -- El límit que vulguis guardar
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."keep_latest_decisions"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_recipe_rating_stats"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    _avg numeric;
    _count integer;
    _dist jsonb;
BEGIN
    -- Calculem estadístiques
    SELECT 
        COALESCE(AVG(value), 0), 
        COUNT(*)
    INTO _avg, _count
    FROM public.recipe_ratings
    WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id);

    -- Calculem distribució (estrelles: vots)
    SELECT jsonb_object_agg(stars, count)
    INTO _dist
    FROM (
        SELECT value as stars, count(*) as count
        FROM public.recipe_ratings
        WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
        GROUP BY value
    ) t;

    -- Actualitzem la recepta
    UPDATE public.saved_recipes
    SET 
        rating_avg = ROUND(_avg, 2),
        rating_count = _count,
        rating_distribution = COALESCE(_dist, '{}'::jsonb)
    WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_recipe_rating_stats"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."community_recipes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "author_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "ingredients" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "steps" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "prep_time_minutes" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "community_recipes_title_check" CHECK (("char_length"("title") >= 3))
);


ALTER TABLE "public"."community_recipes" OWNER TO "postgres";


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
    "invite_code" "text" DEFAULT "encode"("extensions"."gen_random_bytes"(4), 'hex'::"text"),
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
    "created_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb" DEFAULT '{}'::"jsonb"
);

ALTER TABLE ONLY "public"."group_decisions" REPLICA IDENTITY FULL;


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
    "emoji" "text",
    "product_id" "uuid"
);


ALTER TABLE "public"."inventory_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."preference_profiles" (
    "user_id" "uuid" NOT NULL,
    "food_preferences" "text"[] DEFAULT '{}'::"text"[],
    "social_tolerance" integer DEFAULT 5,
    "exclusions" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "username" "text",
    "avatar_emoji" "text" DEFAULT '👨‍🍳'::"text"
);


ALTER TABLE "public"."preference_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_catalog" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "external_id" "text" NOT NULL,
    "source" "text" NOT NULL,
    "name" "text" NOT NULL,
    "image_url" "text",
    "price" numeric(10,2),
    "tags" "text"[],
    "emoji" "text",
    "nutritional_info" "jsonb",
    "last_fetched_at" timestamp with time zone DEFAULT "now"(),
    "quantity_amount" numeric(10,2),
    "quantity_unit" "text"
);


ALTER TABLE "public"."product_catalog" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rate_limits" (
    "key" "text" NOT NULL,
    "count" integer DEFAULT 1,
    "window_start" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."rate_limits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recipe_favorites" (
    "user_id" "uuid" NOT NULL,
    "recipe_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."recipe_favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recipe_ratings" (
    "recipe_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "value" integer NOT NULL,
    "comment" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "recipe_ratings_comment_check" CHECK (("char_length"("comment") <= 500)),
    CONSTRAINT "recipe_ratings_value_check" CHECK ((("value" >= 1) AND ("value" <= 5)))
);


ALTER TABLE "public"."recipe_ratings" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."recipes_with_stats" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::"uuid" AS "author_id",
    NULL::"text" AS "title",
    NULL::"text" AS "description",
    NULL::"jsonb" AS "ingredients",
    NULL::"jsonb" AS "steps",
    NULL::"text"[] AS "tags",
    NULL::integer AS "prep_time_minutes",
    NULL::timestamp with time zone AS "created_at",
    NULL::double precision AS "average_rating",
    NULL::integer AS "rating_count";


ALTER VIEW "public"."recipes_with_stats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."room_candidates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "room_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."room_candidates" REPLICA IDENTITY FULL;


ALTER TABLE "public"."room_candidates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."room_participants" (
    "room_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."room_participants" REPLICA IDENTITY FULL;


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
    "dietary_tags" "text"[] DEFAULT '{}'::"text"[],
    "is_public" boolean DEFAULT false,
    "author_name" "text" DEFAULT 'IA'::"text",
    "likes_count" integer DEFAULT 0,
    "rating_avg" numeric(3,2) DEFAULT 0,
    "rating_count" integer DEFAULT 0,
    "rating_distribution" "jsonb" DEFAULT '{}'::"jsonb",
    "estimated_cost" numeric(10,2) DEFAULT 0,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_ai_generated" boolean DEFAULT false
);


ALTER TABLE "public"."saved_recipes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."security_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "level" "text" NOT NULL,
    "event_type" "text" NOT NULL,
    "user_id" "uuid",
    "ip_address" "text",
    "details" "jsonb" DEFAULT '{}'::"jsonb",
    CONSTRAINT "security_logs_level_check" CHECK (("level" = ANY (ARRAY['INFO'::"text", 'WARN'::"text", 'ERROR'::"text", 'CRITICAL'::"text"])))
);


ALTER TABLE "public"."security_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shopping_list_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "quantity" numeric DEFAULT 1 NOT NULL,
    "unit" "text" DEFAULT 'ut'::"text" NOT NULL,
    "is_checked" boolean DEFAULT false,
    "added_at" timestamp with time zone DEFAULT "now"(),
    "emoji" "text" DEFAULT '📦'::"text",
    "product_id" "text",
    "product_image" "text",
    "estimated_cost" numeric(10,2)
);


ALTER TABLE "public"."shopping_list_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shopping_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "total_cost" numeric(10,2) DEFAULT 0,
    "item_count" integer DEFAULT 0,
    "items_snapshot" "jsonb" NOT NULL
);


ALTER TABLE "public"."shopping_sessions" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."user_leaderboard" AS
 SELECT "user_id",
    COALESCE("username", ('Chef '::"text" || "substr"(("user_id")::"text", 1, 4))) AS "display_name",
    COALESCE("avatar_emoji", '👨‍🍳'::"text") AS "avatar_emoji",
    (COALESCE(( SELECT "sum"("rr"."value") AS "sum"
           FROM ("public"."recipe_ratings" "rr"
             JOIN "public"."saved_recipes" "r" ON (("r"."id" = "rr"."recipe_id")))
          WHERE (("r"."user_id" = "p"."user_id") AND ("rr"."user_id" <> "p"."user_id"))), (0)::bigint) * 2) AS "quality_score",
    LEAST(( SELECT "count"(*) AS "count"
           FROM "public"."inventory_items" "i"
          WHERE ("i"."user_id" = "p"."user_id")), (50)::bigint) AS "pantry_score",
    (( SELECT "count"(*) AS "count"
           FROM "public"."recipe_ratings" "rr"
          WHERE ("rr"."user_id" = "p"."user_id")) * 5) AS "community_score"
   FROM "public"."preference_profiles" "p";


ALTER VIEW "public"."user_leaderboard" OWNER TO "postgres";


ALTER TABLE ONLY "public"."community_recipes"
    ADD CONSTRAINT "community_recipes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."decision_outcomes"
    ADD CONSTRAINT "decision_outcomes_pkey" PRIMARY KEY ("decision_id");



ALTER TABLE ONLY "public"."decision_rooms"
    ADD CONSTRAINT "decision_rooms_invite_code_key" UNIQUE ("invite_code");



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



ALTER TABLE ONLY "public"."product_catalog"
    ADD CONSTRAINT "product_catalog_external_id_source_key" UNIQUE ("external_id", "source");



ALTER TABLE ONLY "public"."product_catalog"
    ADD CONSTRAINT "product_catalog_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rate_limits"
    ADD CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("key");



ALTER TABLE ONLY "public"."recipe_favorites"
    ADD CONSTRAINT "recipe_favorites_pkey" PRIMARY KEY ("user_id", "recipe_id");



ALTER TABLE ONLY "public"."recipe_ratings"
    ADD CONSTRAINT "recipe_ratings_pkey" PRIMARY KEY ("recipe_id", "user_id");



ALTER TABLE ONLY "public"."room_candidates"
    ADD CONSTRAINT "room_candidates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."room_participants"
    ADD CONSTRAINT "room_participants_pkey" PRIMARY KEY ("room_id", "user_id");



ALTER TABLE ONLY "public"."saved_recipes"
    ADD CONSTRAINT "saved_recipes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."security_logs"
    ADD CONSTRAINT "security_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shopping_list_items"
    ADD CONSTRAINT "shopping_list_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shopping_sessions"
    ADD CONSTRAINT "shopping_sessions_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_community_recipes_author" ON "public"."community_recipes" USING "btree" ("author_id");



CREATE INDEX "idx_community_recipes_tags" ON "public"."community_recipes" USING "gin" ("tags");



CREATE INDEX "idx_decision_rooms_invite_code" ON "public"."decision_rooms" USING "btree" ("invite_code");



CREATE INDEX "idx_decisions_user_id" ON "public"."decisions" USING "btree" ("user_id");



CREATE INDEX "idx_group_decisions_room_id" ON "public"."group_decisions" USING "btree" ("room_id");



CREATE INDEX "idx_inventory_items_user_id" ON "public"."inventory_items" USING "btree" ("user_id");



CREATE INDEX "idx_recipes_estimated_cost" ON "public"."saved_recipes" USING "btree" ("estimated_cost");



CREATE INDEX "idx_room_candidates_room_id" ON "public"."room_candidates" USING "btree" ("room_id");



CREATE INDEX "idx_room_participants_user_id" ON "public"."room_participants" USING "btree" ("user_id");



CREATE INDEX "idx_saved_recipes_dietary_tags" ON "public"."saved_recipes" USING "gin" ("dietary_tags");



CREATE INDEX "idx_saved_recipes_tags" ON "public"."saved_recipes" USING "gin" ("tags");



CREATE INDEX "idx_saved_recipes_user_id" ON "public"."saved_recipes" USING "btree" ("user_id");



CREATE INDEX "shopping_list_user_idx" ON "public"."shopping_list_items" USING "btree" ("user_id");



CREATE OR REPLACE VIEW "public"."recipes_with_stats" AS
 SELECT "r"."id",
    "r"."author_id",
    "r"."title",
    "r"."description",
    "r"."ingredients",
    "r"."steps",
    "r"."tags",
    "r"."prep_time_minutes",
    "r"."created_at",
    (COALESCE("avg"("rt"."value"), (0)::numeric))::double precision AS "average_rating",
    ("count"("rt"."value"))::integer AS "rating_count"
   FROM ("public"."community_recipes" "r"
     LEFT JOIN "public"."recipe_ratings" "rt" ON (("r"."id" = "rt"."recipe_id")))
  GROUP BY "r"."id";



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."saved_recipes" FOR EACH ROW EXECUTE FUNCTION "extensions"."moddatetime"('updated_at');



CREATE OR REPLACE TRIGGER "on_vote_update_recipe" AFTER INSERT OR DELETE OR UPDATE ON "public"."recipe_ratings" FOR EACH ROW EXECUTE FUNCTION "public"."update_recipe_rating_stats"();



CREATE OR REPLACE TRIGGER "trigger_cleanup_decisions" AFTER INSERT ON "public"."group_decisions" FOR EACH ROW EXECUTE FUNCTION "public"."keep_latest_decisions"();



ALTER TABLE ONLY "public"."community_recipes"
    ADD CONSTRAINT "community_recipes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."decision_outcomes"
    ADD CONSTRAINT "decision_outcomes_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "public"."decisions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saved_recipes"
    ADD CONSTRAINT "fk_recipes_to_profiles" FOREIGN KEY ("user_id") REFERENCES "public"."preference_profiles"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."group_decisions"
    ADD CONSTRAINT "group_decisions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."decision_rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."inventory_items"
    ADD CONSTRAINT "inventory_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product_catalog"("id");



ALTER TABLE ONLY "public"."inventory_items"
    ADD CONSTRAINT "inventory_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recipe_favorites"
    ADD CONSTRAINT "recipe_favorites_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."saved_recipes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recipe_favorites"
    ADD CONSTRAINT "recipe_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recipe_ratings"
    ADD CONSTRAINT "recipe_ratings_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."saved_recipes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recipe_ratings"
    ADD CONSTRAINT "recipe_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."room_candidates"
    ADD CONSTRAINT "room_candidates_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."decision_rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."room_candidates"
    ADD CONSTRAINT "room_candidates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."room_participants"
    ADD CONSTRAINT "room_participants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."decision_rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saved_recipes"
    ADD CONSTRAINT "saved_recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



COMMENT ON CONSTRAINT "saved_recipes_user_id_fkey" ON "public"."saved_recipes" IS 'Link to author profile';



ALTER TABLE ONLY "public"."security_logs"
    ADD CONSTRAINT "security_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."shopping_list_items"
    ADD CONSTRAINT "shopping_list_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shopping_sessions"
    ADD CONSTRAINT "shopping_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



CREATE POLICY "Anyone can read ratings" ON "public"."recipe_ratings" FOR SELECT USING (true);



CREATE POLICY "Authenticated users can read all profiles" ON "public"."preference_profiles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can read all ratings" ON "public"."recipe_ratings" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authors can delete own recipes" ON "public"."community_recipes" FOR DELETE USING (("auth"."uid"() = "author_id"));



CREATE POLICY "Authors can update own recipes" ON "public"."community_recipes" FOR UPDATE USING (("auth"."uid"() = "author_id"));



CREATE POLICY "Dev policy decisions" ON "public"."decisions" USING (true) WITH CHECK (true);



CREATE POLICY "Dev policy outcomes" ON "public"."decision_outcomes" USING (true) WITH CHECK (true);



CREATE POLICY "Dev policy profiles" ON "public"."preference_profiles" USING (true) WITH CHECK (true);



CREATE POLICY "Enable delete for owners and hosts" ON "public"."room_candidates" FOR DELETE USING ((("auth"."uid"() = "user_id") OR (( SELECT "decision_rooms"."host_user_id"
   FROM "public"."decision_rooms"
  WHERE ("decision_rooms"."id" = "room_candidates"."room_id")) = "auth"."uid"())));



CREATE POLICY "Enable insert for anon (login failures)" ON "public"."security_logs" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated" ON "public"."room_candidates" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."security_logs" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all" ON "public"."room_candidates" FOR SELECT USING (true);



CREATE POLICY "Enable read access for authenticated users" ON "public"."decision_rooms" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Insert group decisions" ON "public"."group_decisions" USING (true) WITH CHECK (true);



CREATE POLICY "Public recipes are viewable by everyone" ON "public"."community_recipes" FOR SELECT USING (true);



CREATE POLICY "Public recipes are viewable by everyone" ON "public"."saved_recipes" FOR SELECT USING ((("auth"."uid"() = "user_id") OR ("is_public" = true)));



CREATE POLICY "Ratings are viewable by everyone" ON "public"."recipe_ratings" FOR SELECT USING (true);



CREATE POLICY "Read group decisions" ON "public"."group_decisions" USING (true);



CREATE POLICY "Users can create recipes" ON "public"."community_recipes" FOR INSERT WITH CHECK (("auth"."uid"() = "author_id"));



CREATE POLICY "Users can delete from their own shopping list" ON "public"."shopping_list_items" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own inventory" ON "public"."inventory_items" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own recipes" ON "public"."saved_recipes" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert into their own shopping list" ON "public"."shopping_list_items" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own history" ON "public"."shopping_sessions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own inventory" ON "public"."inventory_items" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own recipes" ON "public"."saved_recipes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own favorites" ON "public"."recipe_favorites" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own recipes" ON "public"."saved_recipes" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can rate" ON "public"."recipe_ratings" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can rate recipes" ON "public"."recipe_ratings" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own inventory" ON "public"."inventory_items" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own shopping list" ON "public"."shopping_list_items" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own history" ON "public"."shopping_sessions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own inventory" ON "public"."inventory_items" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own recipes" ON "public"."saved_recipes" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own shopping list" ON "public"."shopping_list_items" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "allow_host_all" ON "public"."decision_rooms" USING (("auth"."uid"() = "host_user_id"));



CREATE POLICY "allow_join" ON "public"."room_participants" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "allow_participant_read" ON "public"."decision_rooms" FOR SELECT USING ("public"."has_room_access"("id"));



CREATE POLICY "allow_read_participants" ON "public"."room_participants" FOR SELECT USING ("public"."has_room_access"("room_id"));



ALTER TABLE "public"."community_recipes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."decision_outcomes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."decision_rooms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."decisions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."group_decisions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."inventory_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."preference_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rate_limits" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."recipe_favorites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."recipe_ratings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."room_candidates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."room_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."saved_recipes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."security_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shopping_list_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shopping_sessions" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."check_rate_limit"("_key" "text", "_limit" integer, "_window_seconds" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."check_rate_limit"("_key" "text", "_limit" integer, "_window_seconds" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_rate_limit"("_key" "text", "_limit" integer, "_window_seconds" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_room_access"("_room_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."has_room_access"("_room_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_room_access"("_room_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_room_member"("_room_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_room_member"("_room_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_room_member"("_room_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_room_participant"("_room_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_room_participant"("_room_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_room_participant"("_room_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."keep_latest_decisions"() TO "anon";
GRANT ALL ON FUNCTION "public"."keep_latest_decisions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."keep_latest_decisions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_recipe_rating_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_recipe_rating_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_recipe_rating_stats"() TO "service_role";



GRANT ALL ON TABLE "public"."community_recipes" TO "anon";
GRANT ALL ON TABLE "public"."community_recipes" TO "authenticated";
GRANT ALL ON TABLE "public"."community_recipes" TO "service_role";



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



GRANT ALL ON TABLE "public"."product_catalog" TO "anon";
GRANT ALL ON TABLE "public"."product_catalog" TO "authenticated";
GRANT ALL ON TABLE "public"."product_catalog" TO "service_role";



GRANT ALL ON TABLE "public"."rate_limits" TO "anon";
GRANT ALL ON TABLE "public"."rate_limits" TO "authenticated";
GRANT ALL ON TABLE "public"."rate_limits" TO "service_role";



GRANT ALL ON TABLE "public"."recipe_favorites" TO "anon";
GRANT ALL ON TABLE "public"."recipe_favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."recipe_favorites" TO "service_role";



GRANT ALL ON TABLE "public"."recipe_ratings" TO "anon";
GRANT ALL ON TABLE "public"."recipe_ratings" TO "authenticated";
GRANT ALL ON TABLE "public"."recipe_ratings" TO "service_role";



GRANT ALL ON TABLE "public"."recipes_with_stats" TO "anon";
GRANT ALL ON TABLE "public"."recipes_with_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."recipes_with_stats" TO "service_role";



GRANT ALL ON TABLE "public"."room_candidates" TO "anon";
GRANT ALL ON TABLE "public"."room_candidates" TO "authenticated";
GRANT ALL ON TABLE "public"."room_candidates" TO "service_role";



GRANT ALL ON TABLE "public"."room_participants" TO "anon";
GRANT ALL ON TABLE "public"."room_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."room_participants" TO "service_role";



GRANT ALL ON TABLE "public"."saved_recipes" TO "anon";
GRANT ALL ON TABLE "public"."saved_recipes" TO "authenticated";
GRANT ALL ON TABLE "public"."saved_recipes" TO "service_role";



GRANT ALL ON TABLE "public"."security_logs" TO "anon";
GRANT ALL ON TABLE "public"."security_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."security_logs" TO "service_role";



GRANT ALL ON TABLE "public"."shopping_list_items" TO "anon";
GRANT ALL ON TABLE "public"."shopping_list_items" TO "authenticated";
GRANT ALL ON TABLE "public"."shopping_list_items" TO "service_role";



GRANT ALL ON TABLE "public"."shopping_sessions" TO "anon";
GRANT ALL ON TABLE "public"."shopping_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."shopping_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."user_leaderboard" TO "anon";
GRANT ALL ON TABLE "public"."user_leaderboard" TO "authenticated";
GRANT ALL ON TABLE "public"."user_leaderboard" TO "service_role";



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






\unrestrict P62LHc9JyFBtQNu0ValxdPdmtZULvxufTRf2jCmnCohmkAeJtMdhYIEVWbOlTzT

RESET ALL;
