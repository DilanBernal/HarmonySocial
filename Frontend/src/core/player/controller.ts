import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';
import { normalizeMediaUrl } from '../utils/normalizeUrl';
import { GetSongsService } from '../services/song/GetSongsService';

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
}
