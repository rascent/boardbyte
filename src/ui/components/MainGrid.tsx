import { useState } from 'react';
import styled from 'styled-components';
import { BreadCrumb } from './BreadCrumb';
import { NewRecordButton } from './NewRecordButton';
import { ISoundItem, SoundItem } from './SoundItem';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto;
  gap: 24px 56px;

  margin: 40px 77px;
`;

const MainGridAction = styled.div`
  display: flex;
  justify-content: space-between;

  margin: 24px 42px 32px 42px;
`;

export const MainGrid: React.FC = () => {
  const defaultOutputs = ['default'];
  const defaultVolume = 50;
  const defaultVirtualVolume = 50;

  const [playing, setPlaying] = useState('');

  const sounds: ISoundItem[] = [
    {
      name: 'sheesh~',
      source: '1',
      keybind: 'ctrl + alt + f1',
      volume: defaultVolume,
      virtualVolume: defaultVirtualVolume,
    },
    {
      name: 'meow',
      source: '2',
      keybind: 'ctrl + alt + f1',
      volume: defaultVolume,
      virtualVolume: defaultVirtualVolume,
    },
    {
      name: 'victory song',
      source: '3',
      keybind: 'ctrl + alt + f1',
      volume: defaultVolume,
      virtualVolume: defaultVirtualVolume,
    },
    {
      name: 'defeated:(',
      source: '4',
      keybind: 'ctrl + alt + f1',
      volume: defaultVolume,
      virtualVolume: defaultVirtualVolume,
    },
    {
      name: 'SIUUUU...',
      source: '5',
      keybind: 'ctrl + alt + f1',
      volume: defaultVolume,
      virtualVolume: defaultVirtualVolume,
    },
    {
      name: '[No Name]',
      source: '6',
      keybind: 'ctrl + alt + f1',
      volume: defaultVolume,
      virtualVolume: defaultVirtualVolume,
    },
    {
      name: 'UwU',
      source: '7',
      keybind: 'ctrl + alt + f1',
      volume: defaultVolume,
      virtualVolume: defaultVirtualVolume,
    },
    {
      name: 'LMAO',
      source: '8',
      keybind: 'ctrl + alt + f1',
      volume: defaultVolume,
      virtualVolume: defaultVirtualVolume,
    },
  ];

  const playSong = (sound: ISoundItem) => {
    if (playing === sound.source) {
      setPlaying('');
      return;
    }
    setPlaying(sound.source);
  };

  return (
    <>
      <MainGridAction>
        <BreadCrumb />
        <NewRecordButton />
      </MainGridAction>

      <GridContainer>
        {sounds.map((sound, index) => (
          <SoundItem
            key={index}
            outputs={defaultOutputs}
            sound={sound}
            isPlaying={playing === sound.source}
            onClick={() => {
              playSong(sound);
            }}
          />
        ))}
      </GridContainer>
    </>
  );
};
