import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ISoundItem } from 'ui/components/molecules/SoundItem';
import { Row } from '../components/atoms/Row';
import { MainGrid } from '../components/organisms/MainGrid';
import { SideNav } from '../components/organisms/SideNav';
const { myIpcRenderer } = window;

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const App: React.FC = () => {
  const defaultVolume = 50;
  const [selectedSound, setSelectedSound] = useState<ISoundItem>();
  const [outputs, setOutputs] = useState<MediaDeviceInfo[]>();
  const [sounds, setSounds] = useState<ISoundItem[]>([]);

  useEffect(() => {
    const dir = localStorage.getItem('dir');
    if (dir) myIpcRenderer.send('APP_listFiles', dir);

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      devices = devices.filter((output) => output.kind === 'audiooutput');
      setOutputs(devices);
    });

    myIpcRenderer.on('APP_listedFiles', (result) => {
      const soundsString = localStorage.getItem('sounds');

      let soundsList: ISoundItem[] = soundsString
        ? JSON.parse(soundsString)
        : [];

      (result.paths as []).forEach((_, index) => {
        if (
          soundsList.length === 0 ||
          soundsList.findIndex((s) => s.source === result.paths[index]) === -1
        ) {
          soundsList.push({
            name: result.fileNames[index],
            source: result.paths[index],
            keybind: '',
            volume: defaultVolume,
            virtualVolume: defaultVolume,
          });
        }
      });

      setSounds(soundsList);
      localStorage.setItem('dir', result.dir);
      // localStorage.setItem('sounds', JSON.stringify(soundsList));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (dir) myIpcRenderer.send('APP_listFiles', dir);
      return modifiedSounds;
    });
  };

  return (
    <AppContainer>
      <Row style={{ alignItems: 'start', justifyContent: 'space-between' }}>
        <MainGrid
          sounds={sounds}
          outputs={outputs}
          onSelected={setSelectedSound}
        />
        <SideNav sound={selectedSound} onSaveSound={handleSaveSound} />
      </Row>
    </AppContainer>
  );
};

export default App;
