import styled from 'styled-components';

import PauseIcon from 'assets/icons/pause.svg';
import PlayIcon from 'assets/icons/play.svg';
import { Column } from './Column';
import { MyIcon } from './MyIcon';

const Container = styled.div`
  padding: 52px 68px;
  border-radius: 18px;

  display: flex;
  justify-content: center;
  align-items: center;
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
  onClick(): any;
};

export const SoundItem: React.FC<SoundItemProps> = (props: SoundItemProps) => {
  return (
    <Column>
      <Container
        onClick={props.onClick}
        style={{
          backgroundColor: props.isPlaying
            ? '#DFDFDF'
            : 'rgba(217, 217, 217, 0.34)',
        }}
      >
        <MyIcon
          icon={!props.isPlaying ? PlayIcon : PauseIcon}
          size={40}
          alt="play-pause"
        />
      </Container>
      <Title>{props.sound.name}</Title>
      <Subtitle>{props.sound.keybind}</Subtitle>
    </Column>
  );
};
