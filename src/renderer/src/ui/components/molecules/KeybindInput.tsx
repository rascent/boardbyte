import { KeyboardIcon } from '@renderer/ui/components/atoms/Icons';
import styled from 'styled-components';
import { Column } from '../atoms/Column';
import { InputLabel } from '../atoms/InputLabel';

import { Spacer } from '../atoms/Spacer';
import { useKeybind } from '@renderer/hooks/useKeybind';

const KeybindButton = styled.button`
  display: flex;
  align-items: center;

  padding: 9px;
  border: none;
  border-radius: 4px;
  background-color: #494d54;
  cursor: pointer;
  justify-content: space-between;

  &:hover {
    background-color: #494d5499;
  }
`;

const KeybindText = styled.p`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #f8f8f8;
`;

type KeybindInputProps = {
  name: string;
  keybind: string;
  setKeybind(value: string): void;
};

export const KeybindInput: React.FC<KeybindInputProps> = ({ name, keybind, setKeybind }) => {
  const { keys, buttonRef, buttonFocus, toggleButtonFocus, deleteKeybind, handleKeyDown } =
    useKeybind(name, keybind, setKeybind);

  return (
    <Column
      style={{
        marginLeft: 27,
        marginRight: 27
      }}
    >
      <InputLabel style={{ cursor: 'no-drop' }} onClick={deleteKeybind}>
        Keybind
      </InputLabel>
      <Spacer height={12} />
      <KeybindButton
        ref={buttonRef}
        disabled={name === ''}
        style={{ backgroundColor: buttonFocus ? '#494d5499' : '#494d54' }}
        onClick={() => toggleButtonFocus(buttonFocus)}
        onKeyDown={handleKeyDown}
      >
        <KeybindText>{keys.join('+')}</KeybindText>
        <KeyboardIcon />
      </KeybindButton>
    </Column>
  );
};
