-- Migration: Create fn_get_mutual_friendships
-- Idempotent: drops function if exists and creates it

DROP FUNCTION IF EXISTS fn_get_mutual_friendships(integer, integer);

CREATE OR REPLACE FUNCTION fn_get_mutual_friendships(p_user_a integer, p_user_b integer)
RETURNS TABLE(
  id integer,
  user_id integer,
  friend_id integer,
  status text,
  created_at timestamp,
  updated_at timestamp
) AS $$
BEGIN
  RETURN QUERY
  WITH friends_a AS (
    SELECT CASE WHEN user_id = p_user_a THEN friend_id ELSE user_id END AS friend_id
    FROM friendships
    WHERE (user_id = p_user_a OR friend_id = p_user_a) AND status = 'ACEPTED'
  ),
  friends_b AS (
    SELECT CASE WHEN user_id = p_user_b THEN friend_id ELSE user_id END AS friend_id
    FROM friendships
    WHERE (user_id = p_user_b OR friend_id = p_user_b) AND status = 'ACEPTED'
  ),
  mutuals AS (
    SELECT friend_id FROM friends_a
    INTERSECT
    SELECT friend_id FROM friends_b
  )
  SELECT f.id, f.user_id, f.friend_id, f.status, f.created_at, f.updated_at
  FROM friendships f
  JOIN mutuals m ON ( (f.user_id = p_user_a AND f.friend_id = m.friend_id)
                    OR (f.friend_id = p_user_a AND f.user_id = m.friend_id) );
END;
$$ LANGUAGE plpgsql STABLE;
