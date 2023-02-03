import { PauseIcon, PlayIcon } from 'assets/icons/Icons';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Column } from '../atoms/Column';

const { myIpcRenderer } = window;

const Wrapper = styled(Column)`
  align-items: center;
  width: fit-content;
`;

const PlayContainer = styled.div`
  cursor: pointer;
  padding: 43px 59px;
  border-radius: 18px;

  display: flex;
  width: fit-content;
  justify-content: center;
  align-items: center;
`;

const CursorContainer = styled.div`
  cursor: pointer;
`;

const Title = styled.p`
  margin-top: 19px;
  margin-bottom: 1px;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  max-width: 156px;

  font-weight: bold;
  font-size: 16px;
  text-align: center;
  color: #ffffff;
`;

const Subtitle = styled.p`
  font-weight: 500;
  font-size: 12px;
  text-align: center;

  color: rgba(255, 255, 255, 0.5);
`;

export interface ISoundItem {
  name: string;
  source: string;
  volume: number;
  keybind: string;
  virtualVolume: number;
}

type SoundItemProps = {
  outputs: string[];
  sound: ISoundItem;
  onSelected(sound?: ISoundItem): any;
  isSelected: boolean;
};

export const SoundItem: React.FC<SoundItemProps> = ({
  outputs,
  sound,
  onSelected,
  isSelected,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const removeListenerRef = useRef<Function>();
  const primaryAudioRef = useRef<ExtendedAudioElement>(null);
  const secondaryAudioRef = useRef<ExtendedAudioElement>(null);

  const setPrimaryOutput = (output: string) => {
    primaryAudioRef.current?.setSinkId(output);
  };

  const setSecondaryOutput = (output: string) => {
    secondaryAudioRef.current?.setSinkId(output);
  };

  const play = () => {
    if (primaryAudioRef.current?.paused) {
      setIsPlaying(true);
      primaryAudioRef.current?.play();
      secondaryAudioRef.current?.play();
    } else {
      setIsPlaying(false);
      primaryAudioRef.current?.pause();
      primaryAudioRef.current!.currentTime = 0;
      secondaryAudioRef.current?.pause();
      secondaryAudioRef.current!.currentTime = 0;
    }
  };

  useEffect(() => {
    setPrimaryOutput(outputs[0]);
    setSecondaryOutput(outputs[1]);
  }, [outputs, sound]);

  useEffect(() => {
    if (removeListenerRef.current) removeListenerRef.current();

    removeListenerRef.current = myIpcRenderer.on(
      'APP_keypressed',
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
    secondaryAudioRef.current!.volume = Math.exp(
      (Math.log(sound.virtualVolume / 100) / Math.log(10)) * 4
    );

    primaryAudioRef.current!.addEventListener('ended', () =>
      setIsPlaying(false)
    );
    secondaryAudioRef.current!.addEventListener('ended', () =>
      setIsPlaying(false)
    );
  }, [sound]);

  return (
    <Wrapper>
      <audio ref={primaryAudioRef} src={sound.source} preload="auto" />
      <audio ref={secondaryAudioRef} src={sound.source} preload="auto" />
      <PlayContainer
        onClick={() => {
          play();
        }}
        style={{
          backgroundColor: isPlaying ? '#633CD5' : '#7E8185',
        }}
      >
        {!isPlaying ? <PlayIcon /> : <PauseIcon />}
      </PlayContainer>
      <CursorContainer
        onClick={() => {
          if (isSelected) {
            onSelected(undefined);
          } else {
            onSelected(sound);
          }
        }}
      >
        <Title>{sound.name}</Title>
        <Subtitle>
          {sound.keybind === '' ? '<Add keybind>' : sound.keybind}
        </Subtitle>
      </CursorContainer>
    </Wrapper>
  );
};
