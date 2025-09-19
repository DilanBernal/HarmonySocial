import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';
import { normalizeMediaUrl } from '../utils/normalizeUrl';
import { getSongsService } from '../core/services/song/GetSongsService';

export async function setupPlayer() {
  await TrackPlayer.setupPlayer({ autoHandleInterruptions: true });

  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],
    compactCapabilities: [Capability.Play, Capability.Pause],
  });
}

async function preflight(url: string) {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    return {
      ok: r.ok,
      status: r.status,
      ct: r.headers.get('content-type') || '',
    };
  } catch (e) {
    return { ok: false, status: 0, ct: '' };
  }
}

export async function playSong(item: { title: string; audioUrl: string }) {
  const url = normalizeMediaUrl(item.audioUrl);
  console.log('[Player] playSong url=', url);

  const head = await preflight(url);
  console.log('[Player] preflight =', head);
  if (!head.ok) {
    console.warn(`[Player] URL no accesible. HTTP ${head.status}`);
    return;
  }

  await TrackPlayer.reset();
  await TrackPlayer.add({ id: item.title, url, title: item.title });
  await TrackPlayer.play();
}

export async function playTest() {
  console.log('[Player] playTest (HTTPS)');
  await TrackPlayer.reset();
  await TrackPlayer.add({
    artwork:
      'https://th.bing.com/th/id/R.133c1b2acf062503efd0208f3f618c95?rik=Vfjse57v8Ig33Q&pid=ImgRaw&r=0',
    id: 'test',
    url: 'https://fs571vhd-4666.use2.devtunnels.ms/api/file/song?id=9535d8b1-ca4c-460b-9cd7-fa4e608f8f00-1758152747433.mp3',
    title: 'Test MP3',
    artist: 'SoundHelix',
  });
  await TrackPlayer.play();
}

const getSongService = new getSongsService();

export type songRequest = {
  id?: string;
  title: string;
  artist?: string;
  blobName: string;
  artwork?: string;
};

export async function playSongByBlob(song: songRequest) {
  console.log(song);

  const blobId = song.blobName
    .split('http://127.0.0.1:10000/devstoreaccount1/canciones/')[1]
    ?.trim();

  const url = getSongService.getSongStreamUrl(blobId);

  console.log(url);

  await TrackPlayer.reset();

  const track = {
    id: song.id ?? song.blobName,
    url: url,
    title: song.title,
    artist: song.artist ?? '',
    artwork: song.artwork ?? undefined,
  };

  await TrackPlayer.add(track);
  await TrackPlayer.play();
  return url;
}

