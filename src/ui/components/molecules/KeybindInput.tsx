import KeyboardIcon from 'assets/icons/keyboard.svg';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { Column } from '../atoms/Column';
import { InputLabel } from '../atoms/InputLabel';
import { MyIcon } from '../atoms/MyIcon';

import { Spacer } from '../atoms/Spacer';

const { myIpcRenderer } = window;

const KeybindButton = styled.button`
  display: flex;
  align-items: center;

  padding: 14px;
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
  onChange(value: string): any;
};

export const KeybindInput: React.FC<KeybindInputProps> = ({
  name,
  keybind,
  onChange,
}: KeybindInputProps) => {
  let keys = useRef<string[]>([]);
  const [buttonFocus, setButtonFocus] = useState<boolean>(false);

  const setKey = () => {
    let shortcutString = keys.current.join('+');
    myIpcRenderer.send('APP_setkey', shortcutString, name);
    onChange(shortcutString);
  };

  const clearKey = () => {
    keys.current = [];
    onChange('');
    myIpcRenderer.send('APP_setkey', '', name);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!buttonFocus) return;

    if (event.key === 'Escape') {
      clearKey();
      return;
    }

    if (keys.current.length === 3) {
      clearKey();
    }

    if (keys.current.length < 3) {
      keys.current.push(event.key);

      if (keys.current.length === 3) {
        setKey();
        setButtonFocus(false);
      }
    }
  };

  return (
    <Column
      style={{
        marginLeft: 27,
        marginRight: 27,
      }}
    >
      <InputLabel>Keybind</InputLabel>
      <Spacer height={12} />
      <KeybindButton
        disabled={name === ''}
        style={{ backgroundColor: buttonFocus ? '#494d5499' : '#494d54' }}
        onClick={() => {
          setButtonFocus((value) => !value);
        }}
        onDoubleClick={() => {
          clearKey();
          setButtonFocus(true);
        }}
        onKeyDown={handleKeyDown}
      >
        <KeybindText>{keybind}</KeybindText>
        <MyIcon icon={KeyboardIcon} size={24} alt="input-keybind" />
      </KeybindButton>
    </Column>
  );
};
