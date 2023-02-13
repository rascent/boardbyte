import { MagnifyIcon } from 'assets/icons/Icons';
import { useState } from 'react';
import styled from 'styled-components';
import { Column } from '../atoms/Column';

const SearchBox = styled.div`
  display: flex;
  align-items: center;

  padding: 4px 8px;
  border: none;
  border-radius: 2px;
  background-color: #3d4045;
  justify-content: space-between;

  &:hover {
    background-color: #494d5499;
  }
`;

const SearchTextField = styled.input`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #ffffff;
  background-color: transparent;
  border: 0;
  width: 100%;
`;

type SearchInputProps = {
  name: string;
  type: string;
};
export const SearchInput: React.FC<SearchInputProps> = ({ name, type }) => {
  const [query, setQuery] = useState<string>('');

  return (
    <Column
      style={{
        marginLeft: 16,
        marginRight: 16,
      }}
    >
      <SearchBox>
        <SearchTextField
          onChange={(e) => setQuery(e.target.value)}
          placeholder={'Search...'}
          value={query}
        />
        <MagnifyIcon style={{ cursor: 'pointer' }} />
      </SearchBox>
    </Column>
  );
};
