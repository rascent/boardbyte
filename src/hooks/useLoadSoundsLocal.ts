import { useState, useEffect } from "react";
import { SoundItemType } from "types/sound";

export const useLoadSoundsLocal = () => {
  const defaultVolume = 50;
  const [outputs, setOutputs] = useState<MediaDeviceInfo[]>([]);
  const [sounds, setSounds] = useState<SoundItemType[]>([]);

  useEffect(() => {
    const dir = localStorage.getItem("dir");
    if (dir) window.myIpcRenderer.send("app/listFiles", dir);

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      devices = devices.filter((output) => output.kind === "audiooutput");
      setOutputs(devices);
    });

    window.myIpcRenderer.on("app/listedFiles", (result) => {
      const soundsString = localStorage.getItem("sounds");

      let soundList: SoundItemType[] = soundsString
        ? JSON.parse(soundsString)
        : [];

      (result.paths as []).forEach((_, index) => {
        if (
          soundList.length === 0 ||
          soundList.findIndex((s) => s.source === result.paths[index]) === -1
        ) {
          soundList.push({
            name: result.fileNames[index],
            source: result.paths[index],
            keybind: "",
            volume: defaultVolume,
            virtualVolume: defaultVolume,
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
              window.myIpcRenderer.send("app/setkey", x.keybind, x.name);
            }
            return isNotNull;
          }) as SoundItemType[]
        ).sort((a, b) => a.name.localeCompare(b.name));

        setSounds(sortedSoundList);
        localStorage.setItem("dir", result.dir);
        localStorage.setItem("sounds", JSON.stringify(sortedSoundList));
      });
    });
  }, []);

  return { outputs, sounds, setSounds };
};
