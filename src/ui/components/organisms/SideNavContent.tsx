import { MusicIcon, PencilIcon } from "assets/icons/Icons";
import styled from "styled-components";
import { registerKeybind, unregisterKeybind } from "utils/keybindUtil";
import { Button, ButtonType } from "../atoms/Button";
import { Column } from "../atoms/Column";
import { Row } from "../atoms/Row";
import { Spacer } from "../atoms/Spacer";
import { KeybindInput } from "../molecules/KeybindInput";
import { VolumeSlider } from "../molecules/VolumeSlider";
import { useState, useEffect } from "react";
import { SoundItemType } from "types/sound";

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  position: absolute;
  top: 0;

  background-color: #202123;
  padding-top: 52px;
  transition: all 1s ease;
`;

const Title = styled.div`
  margin-right: 4px;

  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: #f8f8f8;
`;

type SideNavContentProps = {
  sound?: SoundItemType;
  onSaveSound(sound: SoundItemType): any;
};

export const SideNavContent: React.FC<SideNavContentProps> = ({
  sound,
  onSaveSound,
}) => {
  const [keybind, setKeybind] = useState("");
  const [volume, setVolume] = useState(50);
  const [virtualVolume, setVirtualVolume] = useState(50);
  const [transform, setTransform] = useState("translateX(100%)");

  const handleSaveValue = () => {
    if (!sound) return;

    registerKeybind(keybind, sound.name);

    onSaveSound({
      name: sound.name,
      source: sound.source,
      keybind: keybind,
      volume: volume,
      virtualVolume: virtualVolume,
    });
  };

  const handleResetValue = () => {
    if (!sound) return;

    setKeybind(sound.keybind);
    setVolume(sound.volume);
    setVirtualVolume(sound.virtualVolume);

    onSaveSound({
      name: sound.name,
      source: sound.source,
      keybind: sound.keybind,
      volume: sound.volume,
      virtualVolume: sound.virtualVolume,
    });
  };

  const handleResetDefaultValue = () => {
    if (!sound) return;

    setKeybind("");
    setVolume(50);
    setVirtualVolume(50);

    onSaveSound({
      name: sound.name,
      source: sound.source,
      keybind: "",
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

  useEffect(() => {
    if (sound) {
      setTransform("translateX(0)");
      setVolume(sound.volume);
      setVirtualVolume(sound.virtualVolume);
      setKeybind(sound.keybind);
    } else {
      setTransform("translateX(100%)");
    }
  }, [sound]);

  return (
    <Container
      style={{
        transform: transform,
      }}
    >
      <MusicIcon />
      <Row style={{ marginTop: 24 }}>
        <Title>{sound?.name ?? "<Sound Name>"}</Title>
        <PencilIcon />
      </Row>

      <Column
        style={{
          width: "100%",
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
          name={sound?.name ?? ""}
          keybind={sound?.keybind ?? ""}
          setKeybind={(value) => setKeybind(value)}
          registerKeybind={() => registerKeybind(keybind, sound?.name ?? "")}
          unregisterKeybind={() => unregisterKeybind(sound?.name ?? "")}
        />
        <Spacer height={61} />

        <Column style={{ padding: "0px 27px", gap: 13 }}>
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
