import { MagnifyIcon } from 'ui/components/atoms/Icons';
import { KeyboardEvent, useState } from 'react';
import styled from 'styled-components';
import { Column } from './Column';
import { Row } from './Row';

const SearchBox = styled.div`
  display: flex;
  align-items: center;

  margin-top: 16px;
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
  border: none;
  outline: none;
  width: 100%;
`;

type SearchInputProps = {
  name: string;
  type: string;
  submit: (query: string) => void;
};
export const SearchInput: React.FC<SearchInputProps> = ({ submit }) => {
  const [query, setQuery] = useState<string>('');

  const submitHandler = () => {
    submit(query);
    setQuery('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitHandler();
    }
  };

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
          onKeyDown={handleKeyPress}
        />
        <Row style={{ cursor: 'pointer' }} onClick={submitHandler}>
          <MagnifyIcon />
        </Row>
      </SearchBox>
    </Column>
  );
};
