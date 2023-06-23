import { useState, useRef, useEffect } from "react";
import { SoundItemType } from "ui/components/molecules/SoundItem";

export const usePlaySound = (sound: SoundItemType, outputs: string[]) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const removeListenerRef = useRef<Function>();
  const primaryAudioRef = useRef<ExtendedAudioElement>(null);

  const setPrimaryOutput = (output: string) => {
    primaryAudioRef.current?.setSinkId(output);
  };

  const play = () => {
    if (primaryAudioRef.current?.paused) {
      setIsPlaying(true);
      primaryAudioRef.current?.play();
    } else {
      setIsPlaying(false);
      primaryAudioRef.current?.pause();
      primaryAudioRef.current!.currentTime = 0;
    }
  };

  useEffect(() => {
    setPrimaryOutput(outputs[0]);
  }, [outputs, sound]);

  useEffect(() => {
    if (removeListenerRef.current) removeListenerRef.current();

    removeListenerRef.current = window.myIpcRenderer.on(
      "app/keypressed",
      (args: string) => {
        if (sound.keybind === args) {
          play();
        }
      }
    );

    sound.name &&
      sound.keybind &&
      localStorage.setItem(sound.name, sound.keybind);
  }, [sound]);

  useEffect(() => {
    primaryAudioRef.current!.volume = Math.exp(
      (Math.log(sound.volume / 100) / Math.log(10)) * 4
    );

    primaryAudioRef.current!.addEventListener("ended", () =>
      setIsPlaying(false)
    );

    primaryAudioRef.current?.load();
  }, [sound]);

  return {
    primaryAudioRef,
    isPlaying,
    play,
  };
};
