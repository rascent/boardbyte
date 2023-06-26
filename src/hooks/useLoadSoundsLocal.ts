import { useState, useEffect } from 'react';
import { SoundItemType } from 'types/sound';
import { register as registerKeybind } from '@tauri-apps/api/globalShortcut';
import { invoke } from '@tauri-apps/api';
import { useReadLocalStorage } from 'usehooks-ts';

export const useLoadSoundsLocal = () => {
  const defaultVolume = 50;
  const [outputs, setOutputs] = useState<MediaDeviceInfo[]>([]);
  const [sounds, setSounds] = useState<SoundItemType[]>([]);

  const dir = useReadLocalStorage('dir');

  useEffect(() => {
    if (!dir || dir === '') return;
    invoke('list_audio_devices').then((devices) => {
      setOutputs(
        (devices as string[]).map(
          (d) =>
            ({
              label: d,
              deviceId: d,
            } as MediaDeviceInfo),
        ),
      );
    });

    if (dir !== '')
      invoke('list_audio_files', { dir: dir }).then((paths) => {
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
                    const index = prev.findIndex((s) => s.source === x.source);
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
          localStorage.setItem('sounds', JSON.stringify(sortedSoundList));
        });
      });
  }, [dir]);

  return { outputs, sounds, setSounds };
};
