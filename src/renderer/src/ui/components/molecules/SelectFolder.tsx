import { FolderIcon } from '@renderer/ui/components/atoms/Icons';
import styled from 'styled-components';
import { useLocalStorage } from 'usehooks-ts';
const { ipcRenderer } = window.electron;

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
  const [, setDir] = useLocalStorage('dir', '');

  const handlePathSelection = () => {
    ipcRenderer.invoke('select_folder').then((dir) => {
      setDir(dir as string);
    });
  };

  return (
    <Container onClick={handlePathSelection}>
      <FolderIcon />
      <SelectText>Select folder</SelectText>
    </Container>
  );
};
