import styled from 'styled-components';
import { TitleBar } from 'ui/components/organisms/TitleBar';
import { Row } from '../components/atoms/Row';
import { MainGrid } from '../components/organisms/MainGrid';
import { SideNav } from '../components/organisms/SideNav';
import { useSaveSoundSettingLocal } from 'hooks/useSaveSoundSettingLocal';
import { useLoadSoundsLocal } from 'hooks/useLoadSoundsLocal';

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const MainContainer = styled(Row)`
  align-items: start;
  justify-content: space-between;
`;

const App: React.FC = () => {
  const { outputs, sounds, setSounds } = useLoadSoundsLocal();
  const { selectedSound, setSelectedSound, handleSaveSound } = useSaveSoundSettingLocal(setSounds);

  return (
    <AppContainer>
      <TitleBar />
      <MainContainer>
        <MainGrid sounds={sounds} outputs={outputs} onSelected={setSelectedSound} selectedSound={selectedSound} />
        <SideNav sound={selectedSound} onSaveSound={handleSaveSound} />
      </MainContainer>
    </AppContainer>
  );
};

export default App;
