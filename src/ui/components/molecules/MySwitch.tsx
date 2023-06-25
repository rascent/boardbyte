import styled from 'styled-components';

type MySwitchStyleProps = {
  bgColor?: string;
};

interface MySwitchProps extends MySwitchStyleProps {
  isChecked: boolean;
  onChecked(): any;
}

const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const SwitchSpan = styled.span`
  position: absolute;
  cursor: pointer;
  background-color: #dfdfdf;
  border-radius: 25px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: background-color 0.2s ease;
  &::before {
    position: absolute;
    content: '';
    left: 3px;
    top: 3px;
    width: 18px;
    height: 18px;
    background-color: #313338;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }
`;

const InputCheckbox = styled.input.attrs<MySwitchStyleProps>({
  type: 'checkbox',
})`
  display: none;

  &:checked {
    + {
      .switch {
        &::before {
          transform: translateX(25px);
          background-color: #f8f8f8;
        }
        background-color: ${(props: MySwitchStyleProps) => props.bgColor ?? '#633CD5'};
      }
    }
  }
`;

export const MySwitch: React.FC<MySwitchProps> = ({ bgColor, isChecked, onChecked }) => {
  return (
    <SwitchLabel>
      <InputCheckbox checked={isChecked} onChange={() => onChecked()} bgColor={bgColor} />
      <SwitchSpan className="switch"></SwitchSpan>
    </SwitchLabel>
  );
};
