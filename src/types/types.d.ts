import { DesktopCapturerSource, SourcesOptions } from "electron";

declare global {
  interface Window {
    myIpcRenderer: MyIpcRenderer;
  }

  interface ExtendedAudioElement extends HTMLAudioElement {
    setSinkId: (sinkId: string) => Promise<void>;
  }
}

export interface MyIpcRenderer {
  invoke(channel: string, ...args: any[]): Promise<any>;
  send(channel: string, ...args: any[]): void;
  on(channel: string, listener: (...args: any[]) => void): () => void;
  getSources(options: SourcesOptions): Promise<DesktopCapturerSource[]>;
}
