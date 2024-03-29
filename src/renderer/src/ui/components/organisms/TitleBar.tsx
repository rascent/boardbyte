import {
  HelpIcon,
  SunIcon,
  WindowCloseIcon,
  WindowMinIcon
} from '@renderer/ui/components/atoms/Icons';
import { useState } from 'react';
import styled from 'styled-components';
import { Row } from '../atoms/Row';
import { Spacer } from '../atoms/Spacer';
import { IconContainer } from '../atoms/TitleBarIconContainer';
import { MySwitch } from '../molecules/MySwitch';
const { ipcRenderer } = window.electron;

const Container = styled(Row)`
  width: 100%;
  height: 48px;
  background-color: #131314;

  justify-content: space-between;
  align-items: center;

  -webkit-app-region: drag;
`;

const LogoContainer = styled(Row)`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  padding-left: 16px;
`;

const Logo = styled.p`
  font-weight: 700;
  font-size: 20px;

  color: #f8f8f8;
`;

const ControlContainer = styled(Row)`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  -webkit-app-region: no-drag;
`;

const Separator = styled.div`
  margin: 12px 0px;
  height: 24px;

  border: 1px solid #494d54;
`;

export const TitleBar: React.FC = () => {
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    setChecked((c) => !c);
  };

  const handleClose = () => {
    ipcRenderer.invoke('close');
  };

  const handleMin = () => {
    ipcRenderer.invoke('min');
  };

  const appName: string = import.meta.env.REACT_APP_NAME;

  return (
    <Container>
      <LogoContainer>
        <Logo>{appName}</Logo>
      </LogoContainer>
      <ControlContainer>
        <SunIcon fill={checked ? '#EAC713' : '#7E8185'} />
        <Spacer width={4} />
        <MySwitch bgColor="#3691D2" isChecked={checked} onChecked={handleCheck} />
        <Spacer width={16} />

        {/* <LinkDropdown /> */}

        <Separator />
        <IconContainer>
          <HelpIcon />
        </IconContainer>

        <IconContainer onClick={handleMin}>
          <WindowMinIcon />
        </IconContainer>

        <IconContainer onClick={handleClose} className="red">
          <WindowCloseIcon />
        </IconContainer>
      </ControlContainer>
    </Container>
  );
};
