export interface SoundItemType {
  name: string;
  source: string;
  volume: number;
  keybind: string;
  virtualVolume: number;
  playing: boolean;
}

export interface ExtendedAudioElement extends HTMLAudioElement {
  setSinkId: (sinkId: string) => Promise<void>;
}
