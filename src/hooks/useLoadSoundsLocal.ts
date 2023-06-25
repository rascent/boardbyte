import { useState, useEffect } from 'react';
import { SoundItemType } from 'types/sound';
import { register as registerKeybind } from '@tauri-apps/api/globalShortcut';
import { invoke } from '@tauri-apps/api';

export const useLoadSoundsLocal = () => {
  const defaultVolume = 50;
  const [outputs, setOutputs] = useState<MediaDeviceInfo[]>([]);
  const [sounds, setSounds] = useState<SoundItemType[]>([]);

  useEffect(() => {
    const dir = localStorage.getItem('dir');

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      devices = devices.filter((output) => output.kind === 'audiooutput');
      setOutputs(devices);
    });

    if (dir)
      invoke('list_audio_files', { dir }).then((paths) => {
        const soundsString = localStorage.getItem('sounds');

        let soundList: SoundItemType[] = soundsString ? JSON.parse(soundsString) : [];

        (paths as string[]).forEach((path) => {
          if (soundList.length === 0 || soundList.findIndex((s) => s.source === path) === -1) {
            soundList.push({
              name: path.split('\\').pop()!.split('/').pop()!.split('.')[0],
              source: path,
              keybind: '',
              volume: defaultVolume,
              virtualVolume: defaultVolume,
              playing: false,
            });
          }
        });

        const soundPromises = soundList.map(async (s) => {
          let response = null;

          try {
            response = await fetch(s.source);
          } catch {}

          return response && s;
        });

        Promise.all(soundPromises).then((data) => {
          const sortedSoundList = (
            data.filter((x) => {
              const isNotNull = x != null;
              if (isNotNull) {
                registerKeybind(x.keybind, () => {
                  setSounds((prev) => {
                    const index = prev.findIndex((s) => s.source === x!.source);
                    const sound = prev[index];
                    sound.playing = true;
                    prev[index] = sound;
                    return [...prev];
                  });
                });
              }
              return isNotNull;
            }) as SoundItemType[]
          ).sort((a, b) => a.name.localeCompare(b.name));

          setSounds(sortedSoundList);
          localStorage.setItem('dir', dir);
          localStorage.setItem('sounds', JSON.stringify(sortedSoundList));
        });
      });
  }, []);

  return { outputs, sounds, setSounds };
};
