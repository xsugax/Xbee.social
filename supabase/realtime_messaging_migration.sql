-- Apply this migration to existing Supabase projects to enable safe direct-message setup.
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can join conversations" ON public.conversation_participants;

CREATE OR REPLACE FUNCTION public.get_or_create_dm(user1_id UUID, user2_id UUID)
RETURNS UUID AS $$
DECLARE
  conv_id UUID;
BEGIN
  IF auth.uid() IS NULL OR user1_id <> auth.uid() OR user2_id = auth.uid() THEN
    RAISE EXCEPTION 'You can only create a direct conversation as yourself';
  END IF;

  SELECT cp1.conversation_id INTO conv_id
  FROM public.conversation_participants cp1
  JOIN public.conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
  JOIN public.conversations c ON c.id = cp1.conversation_id
  WHERE cp1.user_id = user1_id
    AND cp2.user_id = user2_id
    AND c.type = 'direct'
    AND (SELECT count(*) FROM public.conversation_participants cp3 WHERE cp3.conversation_id = c.id) = 2
  LIMIT 1;

  IF conv_id IS NULL THEN
    INSERT INTO public.conversations (type) VALUES ('direct') RETURNING id INTO conv_id;
    INSERT INTO public.conversation_participants (conversation_id, user_id)
      VALUES (conv_id, user1_id), (conv_id, user2_id);
  END IF;

  RETURN conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.get_or_create_dm(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_or_create_dm(UUID, UUID) TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'conversation_participants'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
  END IF;
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
END;
$$;
