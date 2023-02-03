import { ChevronRightIcon } from 'assets/icons/Icons';
import styled from 'styled-components';
import { Row } from '../atoms/Row';
import { SelectFolder } from './SelectFolder';

const FolderText = styled.p`
  margin-left: 12px;

  font-weight: 500;
  font-size: 12px;
  color: #b5b8bc;
`;

export const BreadCrumb: React.FC = () => {
  return (
    <Row>
      <SelectFolder />
      <ChevronRightIcon />
      <FolderText>Saved</FolderText>
    </Row>
  );
};
