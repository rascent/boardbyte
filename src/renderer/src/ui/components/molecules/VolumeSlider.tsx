import styled from 'styled-components';
import { Column } from '../atoms/Column';
import { InputLabel } from '../atoms/InputLabel';
import { MyInputSlider } from '../atoms/MyInputSlider';
import { Row } from '../atoms/Row';

const VolumeValue = styled.div`
  padding: 4px 9px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: #ffffff;

  background: #464a50;
  border-radius: 2px;
`;

type VolumeSliderProps = {
  title: string;
  volume: number;
  onChangeValue: (value: number) => void;
};

export const VolumeSlider: React.FC<VolumeSliderProps> = ({ title, volume, onChangeValue }) => {
  return (
    <Column
      style={{
        marginLeft: 27,
        marginRight: 27
      }}
    >
      <Row
        style={{
          marginBottom: 11,
          justifyContent: 'space-between'
        }}
      >
        <InputLabel>{title}</InputLabel>
        <VolumeValue>{volume}</VolumeValue>
      </Row>

      <MyInputSlider volume={volume} onChangeValue={onChangeValue} />
    </Column>
  );
};
