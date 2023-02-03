import { FolderIcon } from 'assets/icons/Icons';
import styled from 'styled-components';
const { myIpcRenderer } = window;

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  cursor: pointer;
`;

const SelectText = styled.p`
  margin-left: 12px;

  font-weight: 700;
  font-size: 12px;
  text-decoration-line: underline;
  color: #f8f8f8;
`;

export const SelectFolder = () => {
  const handlePathSelection = () => {
    myIpcRenderer.invoke('APP_showDialog');
  };

  return (
    <Container onClick={handlePathSelection}>
      <FolderIcon />
      <SelectText>Select folder</SelectText>
    </Container>
  );
};
