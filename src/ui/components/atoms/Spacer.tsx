import styled from 'styled-components';

type SpacerProps = {
  width?: number;
  height?: number;
};

export const Spacer = styled.div<SpacerProps>`
  width: ${(p) => p.width ?? 0}px;
  height: ${(p) => p.height ?? 0}px;
`;
