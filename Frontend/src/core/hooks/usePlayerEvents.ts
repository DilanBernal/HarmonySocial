import { useEffect } from 'react';
import TrackPlayer, { Event } from 'react-native-track-player';

export function usePlayerEvents() {
  useEffect(() => {
    const onPlay = () => TrackPlayer.play();
    const onPause = () => TrackPlayer.pause();
    const onNext = () => TrackPlayer.skipToNext();
    const onPrevious = () => TrackPlayer.skipToPrevious();

    const subPlay = TrackPlayer.addEventListener(
      Event.RemotePlay,
      onPlay as any,
    );
    const subPause = TrackPlayer.addEventListener(
      Event.RemotePause,
      onPause as any,
    );
    const subNext = TrackPlayer.addEventListener(
      Event.RemoteNext,
      onNext as any,
    );
    const subPrev = TrackPlayer.addEventListener(
      Event.RemotePrevious,
      onPrevious as any,
    );

    return () => {
      // Different versions of the library return either a subscription with .remove()
      // or an unsubscribe function. Handle both defensively.
      try {
        if (subPlay && typeof (subPlay as any).remove === 'function')
          (subPlay as any).remove();
        else if (typeof subPlay === 'function') (subPlay as any)();

        if (subPause && typeof (subPause as any).remove === 'function')
          (subPause as any).remove();
        else if (typeof subPause === 'function') (subPause as any)();

        if (subNext && typeof (subNext as any).remove === 'function')
          (subNext as any).remove();
        else if (typeof subNext === 'function') (subNext as any)();

        if (subPrev && typeof (subPrev as any).remove === 'function')
          (subPrev as any).remove();
        else if (typeof subPrev === 'function') (subPrev as any)();
      } catch (e) {
        // ignore
      }
    };
  }, []);
}
