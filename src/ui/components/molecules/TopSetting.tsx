import { SettingOutputIcon } from 'assets/icons/Icons';
import styled from 'styled-components';
import { Row } from '../atoms/Row';
import { Spacer } from '../atoms/Spacer';
import { DropdownSelect, SelectOption } from './DropdownSelect';
import { MySwitch } from './MySwitch';
import { useState } from 'react';

const TopSettingContainer = styled(Row)`
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

type TopSettingProps = {
  outputs: MediaDeviceInfo[];
  selectedPrimaryOutput: SelectOption;
  setSelectedPrimaryOutput: React.Dispatch<React.SetStateAction<SelectOption>>;
};

export const TopSetting: React.FC<TopSettingProps> = ({ outputs, selectedPrimaryOutput, setSelectedPrimaryOutput }) => {
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked((c) => !c);
  };

  const handlePrimaryOutputChange = (value: SelectOption) => {
    setSelectedPrimaryOutput(value);
    localStorage.setItem('primary_output', value.deviceId);
  };

  return (
    <TopSettingContainer>
      <Row style={{ gap: 16, paddingLeft: 42 }}>
        <SettingOutputIcon />
        <DropdownSelect selectedValue={selectedPrimaryOutput} onChange={handlePrimaryOutputChange} options={outputs} />
      </Row>
      <Row style={{ paddingRight: 42 }}>
        <HearMyselfText>Hear Myself</HearMyselfText>
        <Spacer width={15} />
        <MySwitch isChecked={checked} onChecked={handleCheck} />
      </Row>
    </TopSettingContainer>
  );
};
