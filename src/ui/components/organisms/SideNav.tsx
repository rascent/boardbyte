import MusicIcon from 'assets/icons/music.svg';
import PencilIcon from 'assets/icons/pencil.svg';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, ButtonType } from '../atoms/Button';
import { Column } from '../atoms/Column';
import { MyIcon } from '../atoms/MyIcon';
import { Row } from '../atoms/Row';
import { Spacer } from '../atoms/Spacer';
import { KeybindInput } from '../molecules/KeybindInput';
import { ISoundItem } from '../molecules/SoundItem';
import { VolumeSlider } from '../molecules/VolumeSlider';

const Container = styled.div`
  width: 322px;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #202123;
  padding-top: 52px;
`;

const Title = styled.div`
  margin-right: 4px;

  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: #f8f8f8;
`;

type SideNavProps = {
  sound?: ISoundItem;
  onSaveSound(sound: ISoundItem): any;
};

export const SideNav: React.FC<SideNavProps> = ({
  sound,
  onSaveSound,
}: SideNavProps) => {
  const [volume, setVolume] = useState(50);
  const [virtualVolume, setVirtualVolume] = useState(50);
  const [keybind, setKeybind] = useState('');

  useEffect(() => {
    if (sound) {
      setVolume(sound.volume);
      setVirtualVolume(sound.virtualVolume);
      setKeybind(sound.keybind);
    }
  }, [sound]);

  const handleSaveValue = () => {
    onSaveSound({
      name: sound?.name!,
      source: sound?.source!,
      keybind: keybind,
      volume: volume,
      virtualVolume: virtualVolume,
    });
  };

  const handleResetValue = () => {
    setKeybind('');
    setVolume(0);
    setVirtualVolume(0);

    onSaveSound({
      name: sound?.name!,
      source: sound?.source!,
      keybind: '',
      volume: 0,
      virtualVolume: 0,
    });
  };

  const handleResetDefaultValue = () => {
    setKeybind('Control+Alt+1');
    setVolume(50);
    setVirtualVolume(50);

    onSaveSound({
      name: sound?.name!,
      source: sound?.source!,
      keybind: 'Control+Alt+1',
      volume: 50,
      virtualVolume: 50,
    });
  };

  const isSoundSettingDirty = () => {
    if (!sound) return false;

    return (
      sound.keybind !== keybind ||
      sound.volume !== volume ||
      sound.virtualVolume !== virtualVolume
    );
  };

  return (
    <Container>
      <MyIcon icon={MusicIcon} size={92} alt="music-icon" />
      <Row style={{ marginTop: 24 }}>
        <Title>{sound?.name ?? '<Sound Name>'}</Title>
        <MyIcon icon={PencilIcon} size={16} alt="edit-name" />
      </Row>

      <Column
        style={{
          width: '100%',
          marginTop: 55,
        }}
      >
        <VolumeSlider
          title="Sound Volume"
          volume={volume}
          onChangeValue={setVolume}
        />

        <Spacer height={27} />

        <VolumeSlider
          title="Virtual Volume"
          volume={virtualVolume}
          onChangeValue={setVirtualVolume}
        />

        <Spacer height={32} />

        <KeybindInput
          name={sound?.name ?? ''}
          keybind={keybind}
          onChange={sound ? setKeybind : (value) => {}}
        />

        <Spacer height={61} />

        <Column style={{ padding: '0px 27px', gap: 13 }}>
          <Button
            disabled={!sound}
            type={
              isSoundSettingDirty() ? ButtonType.filled : ButtonType.outline
            }
            onClick={handleSaveValue}
          >
            Save
          </Button>
          <Button
            disabled={!sound}
            type={ButtonType.outline}
            onClick={handleResetValue}
          >
            Reset
          </Button>
          <Button
            disabled={!sound}
            type={ButtonType.outline}
            onClick={handleResetDefaultValue}
          >
            Reset Default
          </Button>
        </Column>
      </Column>
    </Container>
  );
};
