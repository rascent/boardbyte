import { PropsWithChildren } from 'react';
import styled from 'styled-components';

export enum ButtonType {
  filled,
  outline,
}

type ButtonProps = {
  disabled: boolean;
  type: ButtonType;
  onClick(): any;
};

const StyledButton = styled.button`
  padding: 12px 0;
  width: 100%;

  cursor: pointer;
  border: none;
  border-radius: 4px;

  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  color: #f8f8f8;
`;

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({ children, disabled, type, onClick }) => {
  return (
    <StyledButton
      disabled={disabled}
      style={{
        backgroundColor: type === ButtonType.filled ? '#633CD4' : '#2D2E31',
      }}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};
