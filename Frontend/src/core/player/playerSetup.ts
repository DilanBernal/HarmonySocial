import { PlayerService } from './PlayerService';

export type songRequest = {
  id?: string;
  title: string;
  artist?: string;
  blobName: string;
  artwork?: string;
};

export const setupPlayer = () => PlayerService.setup();

export const playSongByBlob = (song: songRequest) =>
  PlayerService.playSongByBlob(song as any);

export const playSong = (item: { title: string; audioUrl: string }) =>
  PlayerService.playSong(item);

export * from './PlayerService';
