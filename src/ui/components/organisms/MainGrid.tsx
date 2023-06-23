import { SettingOutputIcon } from "assets/icons/Icons";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Column } from "../atoms/Column";
import { Row } from "../atoms/Row";
import { Spacer } from "../atoms/Spacer";
import { BreadCrumb } from "../molecules/BreadCrumb";
import { DropdownSelect, SelectOption } from "../molecules/DropdownSelect";
import { MySwitch } from "../molecules/MySwitch";
import { NewRecordButton } from "../molecules/NewRecordButton";
import { SoundItemType } from "types/sound";
import { SoundItem } from "../molecules/SoundItem";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  gap: 24px 42px;
  overflow-y: auto;
  max-height: 64vh;
  overflow-y: auto;

  padding: 0px 42px 40px 42px;
`;

const MainGridAction = styled.div`
  display: flex;
  justify-content: space-between;

  margin: 24px 42px 32px 42px;
  padding-right: 39px;
`;

const TopSetting = styled(Row)`
  padding: 32px 0px;
  width: 100%;
  border-bottom: 1px solid #494d54;

  display: flex;
  justify-content: space-between;
`;

const HearMyselfText = styled.p`
  font-weight: 500;
  font-size: 12px;
  color: #f8f8f8;
`;

type MainGridProps = {
  sounds: SoundItemType[];
  outputs: MediaDeviceInfo[];
  onSelected(sound?: SoundItemType): any;
  selectedSound?: SoundItemType;
};

const defaultOutput: SelectOption = {
  label: "Default Ouput",
  deviceId: "default",
};

export const MainGrid: React.FC<MainGridProps> = ({
  sounds,
  outputs,
  onSelected,
  selectedSound,
}) => {
  const [checked, setChecked] = useState(false);

  const [selectedPrimaryOutput, setSelectedPrimaryOutput] =
    useState<SelectOption>(defaultOutput);

  const handleCheck = () => {
    setChecked((c) => !c);
  };

  const handlePrimaryOutputChange = (value: SelectOption) => {
    setSelectedPrimaryOutput(value);
    localStorage.setItem("primary_output", value.deviceId);
  };

  useEffect(() => {
    if (outputs.length === 0) return;

    let output_1 = localStorage.getItem("primary_output");
    if (output_1) {
      setSelectedPrimaryOutput(
        outputs.find((out) => out.deviceId === output_1) ?? defaultOutput
      );
    }
  }, [outputs]);

  return (
    <Column style={{ width: "76%" }}>
      <TopSetting>
        <Row style={{ gap: 16, paddingLeft: 42 }}>
          <SettingOutputIcon />
          <DropdownSelect
            selectedValue={selectedPrimaryOutput}
            onChange={handlePrimaryOutputChange}
            options={outputs}
          />
        </Row>
        <Row style={{ paddingRight: 42 }}>
          <HearMyselfText>Hear Myself</HearMyselfText>
          <Spacer width={15} />
          <MySwitch isChecked={checked} onChecked={handleCheck} />
        </Row>
      </TopSetting>

      <MainGridAction>
        <BreadCrumb />
        <NewRecordButton />
      </MainGridAction>

      <GridContainer>
        {sounds.map((sound, index) => (
          <SoundItem
            key={index}
            outputs={[selectedPrimaryOutput.deviceId]}
            sound={sound}
            onSelected={onSelected}
            isSelected={sound.source === selectedSound?.source}
          />
        ))}
      </GridContainer>
    </Column>
  );
};
