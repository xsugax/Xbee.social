insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('profile-media', 'profile-media', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('post-media', 'post-media', true, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public Xbee media read" on storage.objects;
create policy "Public Xbee media read"
  on storage.objects for select
  using (bucket_id in ('profile-media', 'post-media'));

drop policy if exists "Users upload own Xbee media" on storage.objects;
create policy "Users upload own Xbee media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('profile-media', 'post-media')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Users delete own Xbee media" on storage.objects;
create policy "Users delete own Xbee media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('profile-media', 'post-media')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
