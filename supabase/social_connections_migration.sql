-- Persistent follows and friend requests for existing Xbee installations.
-- Run once in the Supabase SQL Editor while signed in as a project owner.

CREATE TABLE IF NOT EXISTS public.connection_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT CHECK (char_length(message) <= 200),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,
  CHECK (sender_id <> recipient_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_connection_requests_pending_pair
  ON public.connection_requests (sender_id, recipient_id)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_connection_requests_recipient
  ON public.connection_requests (recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_connection_requests_sender
  ON public.connection_requests (sender_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.connections (
  user_low_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_high_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_low_id, user_high_id),
  CHECK (user_low_id < user_high_id)
);

ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their connection requests" ON public.connection_requests;
CREATE POLICY "Users can view their connection requests"
  ON public.connection_requests FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Writes are performed through narrowly-scoped RPCs so clients cannot forge
-- an accepted friendship or change another user's request.
DROP POLICY IF EXISTS "Users can create connection requests" ON public.connection_requests;
DROP POLICY IF EXISTS "Recipients can respond to connection requests" ON public.connection_requests;
REVOKE ALL ON TABLE public.connection_requests FROM anon, authenticated;
GRANT SELECT ON TABLE public.connection_requests TO authenticated;
DROP POLICY IF EXISTS "Users can view their connections" ON public.connections;
CREATE POLICY "Users can view their connections"
  ON public.connections FOR SELECT
  USING (auth.uid() = user_low_id OR auth.uid() = user_high_id);
REVOKE ALL ON TABLE public.connections FROM anon, authenticated;
GRANT SELECT ON TABLE public.connections TO authenticated;

CREATE OR REPLACE FUNCTION public.send_connection_request(p_recipient_id UUID, p_message TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_sender_id UUID := auth.uid();
  v_request_id UUID;
BEGIN
  IF v_sender_id IS NULL THEN
    RAISE EXCEPTION 'Sign in to send a connection request';
  END IF;
  IF p_recipient_id IS NULL OR p_recipient_id = v_sender_id THEN
    RAISE EXCEPTION 'Choose another user to connect with';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_recipient_id) THEN
    RAISE EXCEPTION 'That user could not be found';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(LEAST(v_sender_id::text, p_recipient_id::text) || ':' || GREATEST(v_sender_id::text, p_recipient_id::text)));

  SELECT id INTO v_request_id
  FROM public.connection_requests
  WHERE status = 'accepted'
    AND ((sender_id = v_sender_id AND recipient_id = p_recipient_id)
      OR (sender_id = p_recipient_id AND recipient_id = v_sender_id));
  IF v_request_id IS NOT NULL THEN
    RETURN v_request_id;
  END IF;

  SELECT id INTO v_request_id
  FROM public.connection_requests
  WHERE sender_id = v_sender_id AND recipient_id = p_recipient_id AND status = 'pending';
  IF v_request_id IS NOT NULL THEN
    RETURN v_request_id;
  END IF;

  -- A request in the opposite direction means both people want to connect.
  SELECT id INTO v_request_id
  FROM public.connection_requests
  WHERE sender_id = p_recipient_id AND recipient_id = v_sender_id AND status = 'pending'
  FOR UPDATE;
  IF v_request_id IS NOT NULL THEN
    UPDATE public.connection_requests
    SET status = 'accepted', responded_at = now()
    WHERE id = v_request_id;
    INSERT INTO public.follows (follower_id, following_id)
    VALUES (v_sender_id, p_recipient_id), (p_recipient_id, v_sender_id)
    ON CONFLICT DO NOTHING;
    INSERT INTO public.connections (user_low_id, user_high_id)
    VALUES (LEAST(v_sender_id, p_recipient_id), GREATEST(v_sender_id, p_recipient_id))
    ON CONFLICT DO NOTHING;
    INSERT INTO public.notifications (user_id, actor_id, type, content)
    VALUES (p_recipient_id, v_sender_id, 'follow', 'You are now connected');
    RETURN v_request_id;
  END IF;

  INSERT INTO public.connection_requests (sender_id, recipient_id, message)
  VALUES (v_sender_id, p_recipient_id, NULLIF(left(trim(p_message), 200), ''))
  RETURNING id INTO v_request_id;

  INSERT INTO public.notifications (user_id, actor_id, type, content)
  VALUES (p_recipient_id, v_sender_id, 'follow', 'sent you a connection request');
  RETURN v_request_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.respond_to_connection_request(p_request_id UUID, p_accept BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_recipient_id UUID := auth.uid();
  v_sender_id UUID;
  v_status TEXT;
BEGIN
  IF v_recipient_id IS NULL THEN
    RAISE EXCEPTION 'Sign in to respond to a connection request';
  END IF;

  SELECT sender_id, status INTO v_sender_id, v_status
  FROM public.connection_requests
  WHERE id = p_request_id AND recipient_id = v_recipient_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Connection request not found';
  END IF;
  IF v_status <> 'pending' THEN
    RETURN;
  END IF;

  UPDATE public.connection_requests
  SET status = CASE WHEN p_accept THEN 'accepted' ELSE 'declined' END,
      responded_at = now()
  WHERE id = p_request_id;

  IF p_accept THEN
    INSERT INTO public.follows (follower_id, following_id)
    VALUES (v_recipient_id, v_sender_id), (v_sender_id, v_recipient_id)
    ON CONFLICT DO NOTHING;
    INSERT INTO public.connections (user_low_id, user_high_id)
    VALUES (LEAST(v_recipient_id, v_sender_id), GREATEST(v_recipient_id, v_sender_id))
    ON CONFLICT DO NOTHING;
    INSERT INTO public.notifications (user_id, actor_id, type, content)
    VALUES (v_sender_id, v_recipient_id, 'follow', 'accepted your connection request');
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_connection_request(p_request_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sign in to cancel a connection request';
  END IF;
  UPDATE public.connection_requests
  SET status = 'declined', responded_at = now()
  WHERE id = p_request_id AND sender_id = auth.uid() AND status = 'pending';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pending connection request not found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_connection(p_other_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Sign in to manage connections';
  END IF;
  IF p_other_user_id IS NULL OR p_other_user_id = v_user_id THEN
    RAISE EXCEPTION 'Choose another user';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(LEAST(v_user_id::text, p_other_user_id::text) || ':' || GREATEST(v_user_id::text, p_other_user_id::text)));
  UPDATE public.connection_requests
  SET status = 'declined', responded_at = now()
  WHERE status = 'accepted'
    AND ((sender_id = v_user_id AND recipient_id = p_other_user_id)
      OR (sender_id = p_other_user_id AND recipient_id = v_user_id));
  DELETE FROM public.connections
  WHERE user_low_id = LEAST(v_user_id, p_other_user_id)
    AND user_high_id = GREATEST(v_user_id, p_other_user_id);
  DELETE FROM public.follows
  WHERE (follower_id = v_user_id AND following_id = p_other_user_id)
     OR (follower_id = p_other_user_id AND following_id = v_user_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.follow_user(p_following_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Sign in to follow users';
  END IF;
  IF p_following_id IS NULL OR p_following_id = v_user_id THEN
    RAISE EXCEPTION 'Choose another user to follow';
  END IF;
  INSERT INTO public.follows (follower_id, following_id)
  VALUES (v_user_id, p_following_id)
  ON CONFLICT DO NOTHING;
  IF FOUND THEN
    INSERT INTO public.notifications (user_id, actor_id, type, content)
    VALUES (p_following_id, v_user_id, 'follow', 'started following you');
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.unfollow_user(p_following_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sign in to unfollow users';
  END IF;
  DELETE FROM public.follows
  WHERE follower_id = auth.uid() AND following_id = p_following_id;
END;
$$;

REVOKE ALL ON FUNCTION public.send_connection_request(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.respond_to_connection_request(UUID, BOOLEAN) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cancel_connection_request(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.remove_connection(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.follow_user(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.unfollow_user(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.send_connection_request(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.respond_to_connection_request(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_connection_request(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_connection(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.follow_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unfollow_user(UUID) TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'connection_requests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.connection_requests;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'connections'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.connections;
  END IF;
END;
$$;
