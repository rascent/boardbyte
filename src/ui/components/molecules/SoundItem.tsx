import PauseIcon from 'assets/icons/pause.svg';
import PlayIcon from 'assets/icons/play.svg';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Column } from '../atoms/Column';
import { MyIcon } from '../atoms/MyIcon';

const { myIpcRenderer } = window;

const Container = styled.div`
  cursor: pointer;
  padding: 52px 68px;
  border-radius: 18px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const CursorContainer = styled.div`
  cursor: pointer;
`;

const Title = styled.p`
  margin-top: 19px;
  margin-bottom: 1px;

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
  isPlaying: boolean;
  sound: ISoundItem;
  onPlay(source: string): any;
  onSelected(sound: ISoundItem): any;
};

export const SoundItem: React.FC<SoundItemProps> = ({
  outputs,
  isPlaying,
  sound,
  onPlay,
  onSelected,
}: SoundItemProps) => {
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
      onPlay(sound.source);
      primaryAudioRef.current?.play();
      secondaryAudioRef.current?.play();
    } else {
      onPlay('');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sound]);

  useEffect(() => {
    primaryAudioRef.current!.volume = Math.exp(
      (Math.log(sound.volume / 100) / Math.log(10)) * 4
    );
    secondaryAudioRef.current!.volume = Math.exp(
      (Math.log(sound.virtualVolume / 100) / Math.log(10)) * 4
    );
  }, [sound]);

  return (
    <Column>
      <audio ref={primaryAudioRef} src={sound.source} preload="auto" />
      <audio ref={secondaryAudioRef} src={sound.source} preload="auto" />
      <Container
        onClick={() => {
          play();
        }}
        style={{
          backgroundColor: isPlaying ? '#DFDFDF' : 'rgba(217, 217, 217, 0.34)',
        }}
      >
        <MyIcon
          icon={!isPlaying ? PlayIcon : PauseIcon}
          size={40}
          alt="play-pause"
        />
      </Container>
      <CursorContainer
        onClick={() => {
          onSelected(sound);
        }}
      >
        <Title>{sound.name}</Title>
        <Subtitle>{sound.keybind}</Subtitle>
      </CursorContainer>
    </Column>
  );
};
