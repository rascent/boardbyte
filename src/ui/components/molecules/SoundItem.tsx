import { PauseIcon, PlayIcon } from 'assets/icons/Icons';
import styled from 'styled-components';
import { Column } from '../atoms/Column';
import { usePlaySound } from 'hooks/usePlaySound';
import { SoundItemType } from 'types/sound';

const Wrapper = styled(Column)`
  align-items: center;
  width: fit-content;
  max-width: 156px;
`;

const PlayContainer = styled.div`
  cursor: pointer;
  padding: 43px 56px;
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

type SoundItemProps = {
  sound: SoundItemType;
  outputs: string[];
  onSelected(sound?: SoundItemType): any;
  isSelected: boolean;
};

export const SoundItem: React.FC<SoundItemProps> = ({ sound, outputs, onSelected, isSelected }) => {
  const { primaryAudioRef, isPlaying, play } = usePlaySound(sound, outputs);

  return (
    <Wrapper>
      <audio ref={primaryAudioRef} src={sound.source} />
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
        <Subtitle>{sound.keybind === '' ? '<Add keybind>' : sound.keybind}</Subtitle>
      </CursorContainer>
    </Wrapper>
  );
};
