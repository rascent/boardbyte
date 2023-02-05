import { LinkIcon, StopCircleIcon } from 'assets/icons/Icons';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import { Spacer } from '../atoms/Spacer';
import { IconContainer } from '../atoms/TitleBarIconContainer';

const { myIpcRenderer } = window;

const Container = styled.div`
  height: 100%;

  position: relative;

  border-radius: 4px;

  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-align: left;
  color: #f8f8f8;
`;

const HeaderContainer = styled.div`
  height: 42px;

  gap: 10px;
  padding: 0px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #633cd5;
  font-weight: 700;
  border-radius: 4px 4px 0px 0px;
`;

const MenuContainer = styled.div`
  width: 175px;
  max-height: 240px;
  border-radius: 4px;

  top: 48px;
  right: 0px;
  z-index: 99;
  overflow: auto;
  position: absolute;
  transform: translateY(4px);

  background: #292b30;
`;

const ItemsWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.div`
  cursor: pointer;
  padding: 8px 16px;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  &:hover {
    background-color: #313338;
  }
`;

const AppIcon = styled.img`
  width: 17px;
  height: 17px;
`;

const AppLabel = styled.p`
  color: #f8f8f8;
  font-size: 10px;
  font-weight: 500;
  text-overflow: ellipsis;
  text-transform: capitalize;

  display: -webkit-box;
  overflow: hidden;
  line-clamp: 1;
  -webkit-line-clamp: 1; /* number of lines to show */
  -webkit-box-orient: vertical;
`;

const DisconnectButton = styled.div`
  height: 34px;
  margin-top: 12px;

  gap: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;

  border-top: 1px solid #3d4045;
  border-radius: 0px 0px 4px 4px;

  &.connected {
    background: #d02f2f;
  }
`;

interface ActiveAppProcess {
  id: string;
  name: string;
  url: string;
}

const KNOWN_APPS = [
  'chrome',
  'discord',
  'twitch',
  'valorant',
  'apex legends',
  'pubg',
];

export const LinkDropdown = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeApps, setActiveApps] = useState<ActiveAppProcess[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showLinkMenu, setShowLinkMenu] = useState(false);

  useOnClickOutside(containerRef, () => setShowLinkMenu(false));

  const getSimpleName = (app: ActiveAppProcess) => {
    return KNOWN_APPS.find((ka) => app.name.toLowerCase().includes(ka)) ?? '';
  };

  useEffect(() => {
    myIpcRenderer.invoke('APP_ps').then((pl: ActiveAppProcess[]) => {
      if (pl.length === 0) return;

      const knownAppProcesses = pl
        .filter(
          (p) =>
            KNOWN_APPS.findIndex((ka) => p.name.toLowerCase().includes(ka)) !==
            -1
        )
        .sort((a, b) => getSimpleName(a).localeCompare(getSimpleName(b)));
      setActiveApps(knownAppProcesses);
    });
  }, []);

  return (
    <Container ref={containerRef}>
      <IconContainer onClick={() => setShowLinkMenu((s) => !s)}>
        <LinkIcon />
      </IconContainer>
      {showLinkMenu && (
        <MenuContainer>
          <HeaderContainer>Connected</HeaderContainer>

          <Spacer height={12} />

          <ItemsWrap>
            {activeApps.map((app) => (
              <MenuItem key={app.id} onClick={() => {}}>
                <AppIcon src={app.url} alt="" />
                <Spacer width={8} />
                <AppLabel>{getSimpleName(app)}</AppLabel>
              </MenuItem>
            ))}
          </ItemsWrap>

          <DisconnectButton
            onClick={() => setIsConnected((i) => !i)}
            className={isConnected ? 'connected' : ''}
          >
            <StopCircleIcon />
            Disconnected
          </DisconnectButton>
        </MenuContainer>
      )}
    </Container>
  );
};
