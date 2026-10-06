import { getSupabase } from '@/lib/supabase';

export type MediaBucket = 'profile-media' | 'post-media';

export function validateImageFile(file: File, maxSizeBytes: number): string | null {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return 'Choose a JPEG, PNG, WebP, or GIF image.';
  }
  if (file.size > maxSizeBytes) {
    return `Choose an image smaller than ${Math.floor(maxSizeBytes / 1024 / 1024)} MB.`;
  }
  return null;
}

export function validateVideoFile(file: File, maxSizeBytes: number): string | null {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (!allowedTypes.includes(file.type)) {
    return 'Choose an MP4, WebM, or QuickTime video.';
  }
  if (file.size > maxSizeBytes) {
    return `Choose a video smaller than ${Math.floor(maxSizeBytes / 1024 / 1024)} MB.`;
  }
  return null;
}

export async function uploadUserMedia(
  bucket: MediaBucket,
  userId: string,
  file: File,
  folder: 'avatars' | 'covers' | 'posts',
): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const path = `${userId}/${folder}/${crypto.randomUUID()}.${extension}`;
  const supabase = getSupabase();
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Media upload failed: ${error.message}`);
  return supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
}

export async function removeUserMedia(bucket: MediaBucket, publicUrl: string): Promise<void> {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const pathname = new URL(publicUrl).pathname;
  const markerIndex = pathname.indexOf(marker);
  if (markerIndex < 0) throw new Error('The uploaded media URL is invalid.');
  const path = decodeURIComponent(pathname.slice(markerIndex + marker.length));
  const { error } = await getSupabase().storage.from(bucket).remove([path]);
  if (error) throw new Error(`Media cleanup failed: ${error.message}`);
}
