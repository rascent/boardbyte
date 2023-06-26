import { useState, useRef, useEffect } from 'react';
import { ExtendedAudioElement, SoundItemType } from '@renderer/types/sound';
const { ipcRenderer } = window.electron;

export const usePlaySound = (sound: SoundItemType, outputs: string[]) => {
  const [isPlaying, setIsPlaying] = useState(false);
  // eslint-disable-next-line @typescript-eslint/ban-types
  const removeListenerRef = useRef<Function>();
  const primaryAudioRef = useRef<ExtendedAudioElement>(null);

  const setPrimaryOutput = (output: string) => {
    if (!primaryAudioRef.current || !primaryAudioRef.current.setSinkId) return;
    primaryAudioRef.current?.setSinkId(output);
  };

  const play = () => {
    if (!primaryAudioRef.current) return;

    if (primaryAudioRef.current.paused) {
      setIsPlaying(true);
      primaryAudioRef.current.play();
    } else {
      setIsPlaying(false);
      primaryAudioRef.current.pause();
      primaryAudioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    setPrimaryOutput(outputs[0]);
  }, [outputs, sound]);

  useEffect(() => {
    if (removeListenerRef.current) removeListenerRef.current();

    removeListenerRef.current = ipcRenderer.on('keypressed', (_, key) => {
      if (sound.keybind === key) {
        play();
      }
    });

    sound.name && sound.keybind && localStorage.setItem(sound.name, sound.keybind);
  }, [sound]);

  useEffect(() => {
    if (!primaryAudioRef.current) return;

    primaryAudioRef.current.volume = Math.exp((Math.log(sound.volume / 100) / Math.log(10)) * 4);

    primaryAudioRef.current.addEventListener('ended', () => setIsPlaying(false));

    primaryAudioRef.current.load();
  }, [sound]);

  return {
    primaryAudioRef,
    isPlaying,
    play
  };
};
