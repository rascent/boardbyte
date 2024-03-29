import { useState } from 'react';
import { SoundItemType } from '@renderer/types/sound';
const { ipcRenderer } = window.electron;

export const useSaveSoundSettingLocal = (
  setSounds: React.Dispatch<React.SetStateAction<SoundItemType[]>>
) => {
  const [selectedSound, setSelectedSound] = useState<SoundItemType>();

  const handleSaveSound = (sound: SoundItemType) => {
    setSounds((prev) => {
      const modifiedSounds = prev.map<SoundItemType>((p) => {
        if (p.keybind === '') {
          ipcRenderer.send('setkey', p.keybind);
        }
        if (p.source === sound.source) {
          p.keybind = sound.keybind;
          p.volume = sound.volume;
          p.virtualVolume = sound.virtualVolume;
          return p;
        }
        return p;
      });
      localStorage.setItem('sounds', JSON.stringify(modifiedSounds));
      return modifiedSounds;
    });

    setSelectedSound(undefined);
    setTimeout(() => {
      setSelectedSound(sound);
    }, 1);
  };

  return { selectedSound, setSelectedSound, handleSaveSound };
};
