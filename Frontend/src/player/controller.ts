import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';
import { normalizeMediaUrl } from '../utils/normalizeUrl';

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
    return { ok: r.ok, status: r.status, ct: r.headers.get('content-type') || '' };
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
    id: 'test',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    title: 'Test MP3',
    artist: 'SoundHelix',
  });
  await TrackPlayer.play();
}

