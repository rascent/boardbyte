import InputSlider from 'react-input-slider';

type MyInputSliderProps = {
  volume: number;
  onChangeValue: (value: number) => void;
};

export const MyInputSlider: React.FC<MyInputSliderProps> = ({ volume, onChangeValue }) => {
  return (
    <InputSlider
      styles={{
        track: {
          width: '100%',
          height: 7,
          backgroundColor: '#DFDFDF',
          borderRadius: 15,
        },
        active: {
          backgroundColor: '#633CD5',
        },
        thumb: {
          width: 13,
          height: 13,
          backgroundColor: '#633CD5',
          border: '2px solid #F8F8F8',
          boxShadow: '-1px 0px 5px rgba(41, 43, 48, 0.45)',
        },
        disabled: {
          opacity: 0.5,
        },
      }}
      axis="x"
      x={volume}
      onChange={({ x }) => {
        onChangeValue(x);
      }}
    />
  );
};
