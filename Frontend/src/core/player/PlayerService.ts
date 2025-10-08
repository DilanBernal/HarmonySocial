import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from 'react-native-track-player';
import { normalizeMediaUrl } from '../../utils/normalizeUrl';
import { GetSongsService } from '../services/song/GetSongsService';
import { BehaviorSubject } from 'rxjs';

const getSongService = new GetSongsService();

export type PlayerState = { isPlaying: boolean; trackId?: string | null };

export const playerState$ = new BehaviorSubject<PlayerState>({
  isPlaying: false,
  trackId: null,
});

export class PlayerService {
  static async setup() {
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

  private static async preflight(url: string) {
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

  static async playSong(item: { title: string; audioUrl: string }) {
    const url = normalizeMediaUrl(item.audioUrl);
    const head = await this.preflight(url);
    if (!head.ok) {
      console.warn(`[Player] URL no accesible. HTTP ${head.status}`);
      return;
    }

    await TrackPlayer.reset();
    await TrackPlayer.add({ id: item.title, url, title: item.title });
    await TrackPlayer.play();
    playerState$.next({ isPlaying: true, trackId: item.title });
  }

  static async playSongByBlob(song: {
    id?: string;
    title: string;
    artist?: string;
    blobName: string;
    artwork?: string;
  }) {
    const blobId = song.blobName.split('canciones/')[1]?.trim();
    const url = getSongService.getSongStreamUrl(blobId);

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
    playerState$.next({ isPlaying: true, trackId: track.id });
    return url;
  }
}
