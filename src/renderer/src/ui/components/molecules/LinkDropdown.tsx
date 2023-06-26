import { LinkIcon, LinkPlusIcon, TrashCanIcon } from '@renderer/ui/components/atoms/Icons';
import styled from 'styled-components';
import { Spacer } from '../atoms/Spacer';
import { IconContainer } from '../atoms/TitleBarIconContainer';
import { SearchInput } from '../atoms/SearchInput';
import { Row } from '../atoms/Row';
import { useLinkDropdown } from '@renderer/hooks/useLinkDropdown';

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
  max-height: 90vh;
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
  justify-content: space-between;

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

// const DisconnectButton = styled.div`
//   height: 34px;
//   margin-top: 12px;

//   gap: 8px;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   font-weight: 700;
//   text-transform: capitalize;

//   border-top: 1px solid #3d4045;
//   border-radius: 0px 0px 4px 4px;

//   &.connect {
//     background: #25732c;
//   }
//   &.disconnect {
//     background: #d02f2f;
//   }
// `;

const ItemHeader = styled(Row)`
  padding: 0px 16px;
  display: flex;
  justify-content: space-between;
  height: 16px;
`;

const RegisteredLabel = styled.p`
  color: #7e8185;
  font-size: 10px;
  font-weight: 500;
  line-height: 15px;
`;

const DoneLabel = styled.p`
  color: #633cd4;
  font-size: 8px;
  font-weight: 500;
  line-height: 12px;
`;

const ItemFooter = styled(Row)`
  justify-content: center;
`;

const ShowLabel = styled.p`
  color: #168ade;
  font-weight: 600;
  font-size: 10px;
  line-height: 15px;
  cursor: pointer;
`;

export const LinkDropdown = () => {
  const {
    containerRef,
    showLinkMenu,
    setShowLinkMenu,
    isAdd,
    setIsAdd,
    addKnownApps,
    isRemove,
    setIsRemove,
    activeApps,
    isShowMore,
    setIsShowMore,
    getSimpleName,
    setBlacklistedApps
  } = useLinkDropdown();

  return (
    <Container ref={containerRef}>
      <IconContainer
        onClick={() => {
          setShowLinkMenu((s) => !s);
        }}
      >
        <LinkIcon />
      </IconContainer>
      {showLinkMenu && (
        <MenuContainer>
          <HeaderContainer>
            Connected
            <Row
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setIsAdd((prev) => !prev);
              }}
            >
              <LinkPlusIcon />
            </Row>
          </HeaderContainer>

          {isAdd && <SearchInput name="query" type="text" submit={addKnownApps} />}

          <Spacer height={12} />

          <ItemHeader>
            <RegisteredLabel>Registered Apps</RegisteredLabel>
            <Row
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setIsRemove((prev) => !prev);
              }}
            >
              {!isRemove ? (
                <TrashCanIcon fill="#7E8185" style={{ width: 16, height: 16 }} />
              ) : (
                <DoneLabel>Done</DoneLabel>
              )}
            </Row>
          </ItemHeader>

          <Spacer height={12} />

          <ItemsWrap>
            {activeApps.slice(0, isShowMore ? activeApps.length : 2).map((app) => (
              <MenuItem key={app.id}>
                <Row>
                  <AppIcon src={app.url} alt="" />
                  <Spacer width={8} />
                  <AppLabel>{getSimpleName(app)}</AppLabel>
                </Row>
                {isRemove && (
                  <Row
                    onClick={() => {
                      setBlacklistedApps((prev) => [...prev, app]);
                    }}
                  >
                    <TrashCanIcon fill="#7E8185" style={{ width: 16, height: 16 }} />
                  </Row>
                )}
              </MenuItem>
            ))}
          </ItemsWrap>

          <Spacer height={12} />

          {activeApps.length > 2 && (
            <ItemFooter>
              <ShowLabel
                onClick={() => {
                  setIsShowMore((prev) => !prev);
                }}
              >
                Show {!isShowMore ? 'more' : 'less'}
              </ShowLabel>
            </ItemFooter>
          )}

          <Spacer height={16} />

          {/* <DisconnectButton
            onClick={() => setIsConnected((i) => !i)}
            className={isConnected ? 'disconnect' : 'connect'}
          >
            <StopCircleIcon />
            {isConnected ? 'disconnect' : 'connect'}
          </DisconnectButton> */}
        </MenuContainer>
      )}
    </Container>
  );
};
