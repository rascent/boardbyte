import { useState, useEffect } from 'react';
import { SoundItemType } from '@renderer/types/sound';
import { useReadLocalStorage } from 'usehooks-ts';
const { ipcRenderer } = window.electron;

export const useLoadSoundsLocal = () => {
  const defaultVolume = 50;
  const [outputs, setOutputs] = useState<MediaDeviceInfo[]>([]);
  const [sounds, setSounds] = useState<SoundItemType[]>([]);

  const dir = useReadLocalStorage('dir');

  useEffect(() => {
    if (!dir || dir === '') return;
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      devices = devices.filter((output) => output.kind === 'audiooutput');
      setOutputs(devices);
    });

    if (dir !== '')
      ipcRenderer.invoke('list_audio_files', dir).then((paths) => {
        const soundsString = localStorage.getItem('sounds');

        const soundList: SoundItemType[] = soundsString ? JSON.parse(soundsString) : [];

        (paths as string[]).forEach((path) => {
          if (soundList.length === 0 || soundList.findIndex((s) => s.source === path) === -1) {
            soundList.push({
              name: path.split('\\').pop()?.split('/').pop()?.split('.')[0] ?? '',
              source: path,
              keybind: '',
              volume: defaultVolume,
              virtualVolume: defaultVolume,
              playing: false
            });
          }
        });

        const soundPromises = soundList.map(async (s) => {
          let response: Response | null = null;

          try {
            response = await fetch(s.source);
          } catch {
            console.error(`Failed to fetch sound file: ${s.source}`);
          }

          return response && s;
        });

        Promise.all(soundPromises).then((data) => {
          const sortedSoundList = (
            data.filter((x) => {
              const isNotNull = x != null;
              if (isNotNull) {
                ipcRenderer.send('setkey', x.keybind, x.name);
              }
              return isNotNull;
            }) as SoundItemType[]
          ).sort((a, b) => a.name.localeCompare(b.name));

          setSounds(sortedSoundList);
          localStorage.setItem('sounds', JSON.stringify(sortedSoundList));
        });
      });
  }, [dir]);

  return { outputs, sounds, setSounds };
};
