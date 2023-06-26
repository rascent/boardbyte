declare global {
  interface ExtendedAudioElement extends HTMLAudioElement {
    setSinkId: (sinkId: string) => Promise<void>;
  }
}
