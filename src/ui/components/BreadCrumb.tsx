import ChevronRight from 'assets/icons/chevron-right.svg';
import styled from 'styled-components';
import { MyIcon } from './MyIcon';
import { Row } from './Row';
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
      <MyIcon icon={ChevronRight} size={19} alt="breadcrumb-right" />
      <FolderText>Saved</FolderText>
    </Row>
  );
};
