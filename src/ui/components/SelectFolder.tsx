import FolderIcon from 'assets/icons/folder.svg';
import styled from 'styled-components';
import { MyIcon } from './MyIcon';

const Container = styled.p`
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
  return (
    <Container>
      <MyIcon icon={FolderIcon} size={19} alt="select-folder" />
      <SelectText>Select folder</SelectText>
    </Container>
  );
};
