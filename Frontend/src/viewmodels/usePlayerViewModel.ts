import { useState, useEffect } from 'react';
import { PlayerViewModel } from './PlayerViewModel';

export function usePlayerViewModel() {
  const vm = PlayerViewModel.getInstance();
  const [state, setState] = useState(vm.state$.value);

  useEffect(() => {
    const sub = vm.state$.subscribe(s => setState(s));
    return () => sub.unsubscribe();
  }, [vm]);

  return {
    isPlaying: state.isPlaying,
    playSong: (title: string, audioUrl: string) => vm.playSong(title, audioUrl),
    playSongByBlob: (song: any) => vm.playSongByBlob(song),
    setup: () => vm.setup(),
  };
}
