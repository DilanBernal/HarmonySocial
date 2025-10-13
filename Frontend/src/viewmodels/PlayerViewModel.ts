import { BehaviorSubject, Subscription } from 'rxjs';
import { PlayerService, playerState$ } from '../core/player/PlayerService';

export type PlayerState = {
  isPlaying: boolean;
  trackId?: string | null;
};

export class PlayerViewModel {
  private static instance: PlayerViewModel | null = null;

  public state$ = new BehaviorSubject<PlayerState>({
    isPlaying: false,
    trackId: null,
  });
  private subs: Subscription[] = [];

  private constructor() {
    this.subs.push(playerState$.subscribe(s => this.state$.next(s)));
  }

  static getInstance() {
    if (!this.instance) this.instance = new PlayerViewModel();
    return this.instance;
  }

  async setup() {
    await PlayerService.setup();
  }

  async playSong(title: string, audioUrl: string) {
    await PlayerService.playSong({ title, audioUrl });
  }

  async playSongByBlob(song: {
    id?: string;
    title: string;
    artist?: string;
    blobName: string;
    artwork?: string;
  }) {
    return await PlayerService.playSongByBlob(song);
  }

  dispose() {
    this.subs.forEach(s => s.unsubscribe());
    this.subs = [];
  }
}
