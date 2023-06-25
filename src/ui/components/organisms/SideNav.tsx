import styled from 'styled-components';
import { SideNavPlaceholder } from '../atoms/SideNavPlaceholder';
import { SideNavContent } from './SideNavContent';
import { SoundItemType } from 'types/sound';

const Wrapper = styled.div`
  width: 24%;
  height: 100vh;
  position: relative;
`;

interface SideNavProps {
  sound?: SoundItemType;
  onSaveSound(sound: SoundItemType): any;
}

export const SideNav: React.FC<SideNavProps> = ({ sound, onSaveSound }) => {
  return (
    <Wrapper>
      <SideNavPlaceholder opacity={sound === undefined ? 1 : 0} />
      <SideNavContent sound={sound} onSaveSound={onSaveSound} />
    </Wrapper>
  );
};
