import SettingOutput from 'assets/icons/setting-output.svg';
import { useState } from 'react';
import styled from 'styled-components';
import { Column } from '../atoms/Column';
import { MyIcon } from '../atoms/MyIcon';
import { Row } from '../atoms/Row';
import { BreadCrumb } from '../molecules/BreadCrumb';
import { DropdownSelect, SelectOption } from '../molecules/DropdownSelect';
import { NewRecordButton } from '../molecules/NewRecordButton';
import { ISoundItem, SoundItem } from '../molecules/SoundItem';

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

const TopSetting = styled(Row)`
  gap: 16px;
  padding: 32px 42px;
  width: 100%;
  border-bottom: 1px solid #494d54;
`;

type MainGridProps = {
  sounds: ISoundItem[];
  outputs?: MediaDeviceInfo[];
  onSelected(sound: ISoundItem): any;
};

export const MainGrid: React.FC<MainGridProps> = ({
  sounds,
  outputs,
  onSelected,
}: MainGridProps) => {
  const [selectedPrimaryOutput, setSelectedPrimaryOutput] =
    useState<SelectOption>({ label: 'Default Ouput', deviceId: 'default' });
  const [selectedSecondaryOutput, setSelectedSecondaryOutput] =
    useState<SelectOption>({ label: 'Default Output', deviceId: 'default' });

  const handlePrimaryOutputChange = (value: SelectOption) => {
    setSelectedPrimaryOutput(value);
    localStorage.setItem('primary_output', value.deviceId);
  };

  const handleSecondaryOutputChange = (value: SelectOption) => {
    setSelectedSecondaryOutput(value);
    localStorage.setItem('secondary_output', value.deviceId);
  };

  return (
    <Column style={{ width: '76%' }}>
      <TopSetting>
        <MyIcon icon={SettingOutput} size={24} alt="setting-output" />
        <DropdownSelect
          selectedValue={selectedPrimaryOutput}
          onChange={handlePrimaryOutputChange}
          options={outputs}
        />
        <DropdownSelect
          selectedValue={selectedSecondaryOutput}
          onChange={handleSecondaryOutputChange}
          options={outputs}
        />
      </TopSetting>

      <MainGridAction>
        <BreadCrumb />
        <NewRecordButton />
      </MainGridAction>

      <GridContainer>
        {sounds.map((sound, index) => (
          <SoundItem
            key={index}
            outputs={[
              selectedPrimaryOutput.deviceId,
              selectedSecondaryOutput.deviceId,
            ]}
            sound={sound}
            onSelected={onSelected}
          />
        ))}
      </GridContainer>
    </Column>
  );
};
