import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'assets/icons/Icons';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';

const Container = styled.div`
  min-width: 258px;
  border-radius: 4px;
  position: relative;
  background-color: #494d54;

  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-align: left;
  color: #f8f8f8;
`;

const InputContainer = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DisplayValue = styled.div`
  max-width: 210px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const MenuContainer = styled.div`
  position: absolute;
  transform: translateY(4px);
  width: 100%;
  border-radius: 4px;
  overflow: auto;
  max-height: 240px;
  background-color: #494d54;
  z-index: 99;
`;

const MenuItem = styled.div`
  padding: 12px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: #313338;
  }
`;

const ItemLabel = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;

  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  line-clamp: 1;
  -webkit-box-orient: vertical;
`;

export interface SelectOption {
  label: string;
  deviceId: string;
}

export const DropdownSelect = ({
  placeHolder,
  options,
  onChange,
  selectedValue,
}: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  useOnClickOutside(containerRef, () => setShowMenu(false));

  const handleInputClick = () => {
    setShowMenu(!showMenu);
  };

  const getDisplay = () => {
    if (!selectedValue) {
      return placeHolder;
    }
    return selectedValue.label;
  };

  const onItemClick = (option: SelectOption) => {
    setShowMenu(false);
    onChange(option);
  };

  const isSelected = (option: SelectOption) => {
    if (!selectedValue) {
      return false;
    }

    return (selectedValue as SelectOption).deviceId === option.deviceId;
  };

  return (
    <Container ref={containerRef}>
      <InputContainer onClick={handleInputClick}>
        <DisplayValue>{getDisplay()}</DisplayValue>
        {showMenu ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </InputContainer>
      {showMenu && (
        <MenuContainer>
          {options.map((option: SelectOption) => (
            <MenuItem
              onClick={() => onItemClick(option)}
              key={option.deviceId}
              className={`${isSelected(option) && 'selected'}`}
            >
              <ItemLabel>{option.label}</ItemLabel>

              {isSelected(option) && <CheckCircleIcon />}
            </MenuItem>
          ))}
        </MenuContainer>
      )}
    </Container>
  );
};
