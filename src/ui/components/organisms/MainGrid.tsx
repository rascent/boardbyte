import { useState } from 'react';
import styled from 'styled-components';
import { Column } from '../atoms/Column';
import { Row } from '../atoms/Row';
import { BreadCrumb } from '../molecules/BreadCrumb';
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
  const [playing, setPlaying] = useState<string>();
  const [selectedPrimaryOutput, setSelectedPrimaryOutput] =
    useState<string>('default');
  const [selectedSecondaryOutput, setSelectedSecondaryOutput] =
    useState<string>('default');

  const handlePrimaryOutputChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPrimaryOutput(event.currentTarget.value);
    localStorage.setItem('primary_output', event.currentTarget.value);
  };

  const handleSecondaryOutputChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSecondaryOutput(event.currentTarget.value);
    localStorage.setItem('secondary_output', event.currentTarget.value);
  };

  const playSound = (source: string) => {
    setPlaying(source);
  };

  return (
    <Column>
      <Row>
        <select onChange={handlePrimaryOutputChange}>
          {outputs &&
            outputs.map((output, index) => (
              <option key={index} value={output.deviceId}>
                {output.label}
              </option>
            ))}
        </select>

        <select onChange={handleSecondaryOutputChange}>
          {outputs &&
            outputs.map((output, index) => (
              <option key={index} value={output.deviceId}>
                {output.label}
              </option>
            ))}
        </select>
      </Row>

      <MainGridAction>
        <BreadCrumb />
        <NewRecordButton />
      </MainGridAction>

      <GridContainer>
        {sounds.map((sound, index) => (
          <SoundItem
            key={index}
            outputs={[selectedPrimaryOutput, selectedSecondaryOutput]}
            sound={sound}
            isPlaying={playing === sound.source}
            onPlay={playSound}
            onSelected={onSelected}
          />
        ))}
      </GridContainer>
    </Column>
  );
};
