import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Column } from '../atoms/Column';
import { BreadCrumb } from '../molecules/BreadCrumb';
import { SelectOption } from '../molecules/DropdownSelect';
import { NewRecordButton } from '../molecules/NewRecordButton';
import { SoundItemType } from 'types/sound';
import { SoundItem } from '../molecules/SoundItem';
import { TopSetting } from '../molecules/TopSetting';

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

type MainGridProps = {
  sounds: SoundItemType[];
  outputs: MediaDeviceInfo[];
  onSelected: (sound?: SoundItemType) => void;
  selectedSound?: SoundItemType;
};

const defaultOutput: SelectOption = {
  label: 'Default Ouput',
  deviceId: 'default',
};

export const MainGrid: React.FC<MainGridProps> = ({ sounds, outputs, onSelected, selectedSound }) => {
  const [selectedPrimaryOutput, setSelectedPrimaryOutput] = useState<SelectOption>(defaultOutput);

  useEffect(() => {
    if (outputs.length === 0) return;

    const output_1 = localStorage.getItem('primary_output');
    if (output_1) {
      setSelectedPrimaryOutput(outputs.find((out) => out.deviceId === output_1) ?? defaultOutput);
    }
  }, [outputs]);

  return (
    <Column style={{ width: '76%' }}>
      <TopSetting
        outputs={outputs}
        selectedPrimaryOutput={selectedPrimaryOutput}
        setSelectedPrimaryOutput={setSelectedPrimaryOutput}
      />

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
