import styled from 'styled-components';

export type OpacityProps = {
  opacity: number;
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  transition: all 1s ease;

  display: flex;
  align-items: center;
  justify-content: center;
  background: #202123;

  font-weight: 500;
  font-size: 16px;
  text-align: center;
  color: #7e8185;
`;
export const SideNavPlaceholder: React.FC<OpacityProps> = ({ opacity }) => {
  return (
    <Container style={{ opacity: opacity }}>
      Select your sound
      <br />
      to setting here
    </Container>
  );
};
