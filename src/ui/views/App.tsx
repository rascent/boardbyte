import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ISoundItem } from 'ui/components/molecules/SoundItem';
import { TitleBar } from 'ui/components/organisms/TitleBar';
import { Row } from '../components/atoms/Row';
import { MainGrid } from '../components/organisms/MainGrid';
import { SideNav } from '../components/organisms/SideNav';

const { myIpcRenderer } = window;

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const MainContainer = styled(Row)`
  align-items: start;
  justify-content: space-between;
`;

const App: React.FC = () => {
  const defaultVolume = 50;
  const [selectedSound, setSelectedSound] = useState<ISoundItem>();
  const [outputs, setOutputs] = useState<MediaDeviceInfo[]>([]);
  const [sounds, setSounds] = useState<ISoundItem[]>([]);

  useEffect(() => {
    const dir = localStorage.getItem('dir');
    if (dir) myIpcRenderer.send('app/listFiles', dir);

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      devices = devices.filter((output) => output.kind === 'audiooutput');
      setOutputs(devices);
    });

    myIpcRenderer.on('app/listedFiles', (result) => {
      const soundsString = localStorage.getItem('sounds');

      let soundList: ISoundItem[] = soundsString
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
            keybind: '',
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
              myIpcRenderer.send('app/setkey', x.keybind, x.name);
            }
            return isNotNull;
          }) as ISoundItem[]
        ).sort((a, b) => a.name.localeCompare(b.name));

        setSounds(sortedSoundList);
        localStorage.setItem('dir', result.dir);
        localStorage.setItem('sounds', JSON.stringify(sortedSoundList));
      });
    });
  }, []);

  const handleSaveSound = (sound: ISoundItem) => {
    setSounds((prev) => {
      const modifiedSounds = prev.map<ISoundItem>((p) => {
        if (p.source === sound.source) {
          p.keybind = sound.keybind;
          p.volume = sound.volume;
          p.virtualVolume = sound.virtualVolume;
          return p;
        }
        return p;
      });
      localStorage.setItem('sounds', JSON.stringify(modifiedSounds));
      const dir = localStorage.getItem('dir');
      if (dir) myIpcRenderer.send('app/listFiles', dir);
      return modifiedSounds;
    });

    setSelectedSound(undefined);
    setTimeout(() => {
      setSelectedSound(sound);
    }, 1);
  };

  return (
    <AppContainer>
      <TitleBar />
      <MainContainer>
        <MainGrid
          sounds={sounds}
          outputs={outputs}
          onSelected={setSelectedSound}
          selectedSound={selectedSound}
        />
        <SideNav sound={selectedSound} onSaveSound={handleSaveSound} />
      </MainContainer>
    </AppContainer>
  );
};

export default App;
