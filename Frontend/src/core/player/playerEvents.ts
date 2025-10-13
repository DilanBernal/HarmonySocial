import TrackPlayer, { Event } from 'react-native-track-player';
import { playerState$ } from './PlayerService';

export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    await TrackPlayer.play();
    playerState$.next({ isPlaying: true, trackId: null });
  });
  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    await TrackPlayer.pause();
    playerState$.next({ isPlaying: false, trackId: null });
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () =>
    TrackPlayer.skipToNext(),
  );
  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious(),
  );

  TrackPlayer.addEventListener(Event.PlaybackError, e => {
    console.warn('Playback error', e);
  });
}
