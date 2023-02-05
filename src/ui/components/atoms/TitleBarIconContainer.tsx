import styled from 'styled-components';

export const IconContainer = styled.div`
  height: 100%;
  width: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: #7e8185;
  }

  &:hover {
    background: #393e45;

    svg {
      fill: #f8f8f8;
    }
  }

  &.red:hover {
    background: #d02f2f;
  }
`;
