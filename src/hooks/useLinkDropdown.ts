import { invoke } from '@tauri-apps/api';
import { useEffect, useRef, useState } from 'react';
import { ActiveAppProcess, KNOWN_APPS } from 'types/apps';
import { useOnClickOutside } from 'usehooks-ts';

export const useLinkDropdown = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeApps, setActiveApps] = useState<ActiveAppProcess[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const [knownApps, setKnownApps] = useState(KNOWN_APPS);
  const [isAdd, setIsAdd] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);
  const [blacklistedApps, setBlacklistedApps] = useState<ActiveAppProcess[]>([]);

  useOnClickOutside(containerRef, () => setShowLinkMenu(false));

  const getSimpleName = (app: ActiveAppProcess) => {
    return knownApps.find((ka) => app.name.toLowerCase().includes(ka)) ?? '';
  };

  const addKnownApps = (value: string) => {
    if (value && !knownApps.includes(value)) {
      setKnownApps((prev) => [...prev, value]);
    }
  };

  useEffect(() => {
    let localKnownApps = localStorage.getItem('known_apps');
    if (localKnownApps) {
      setKnownApps(JSON.parse(localKnownApps));
    }
  }, []);

  useEffect(() => {
    if (knownApps !== KNOWN_APPS) {
      localStorage.setItem('known_apps', JSON.stringify(knownApps));
    }
  }, [knownApps]);

  useEffect(() => {
    // TODO: tauri haven't supported desktop capturer
    invoke('app_list').then((result) => {
      const pl = result as ActiveAppProcess[];

      if (pl.length === 0) return;

      const knownAppProcesses = pl
        .filter(
          (p, index) =>
            knownApps.findIndex((ka) => p.name.toLowerCase().includes(ka)) !== -1 &&
            !blacklistedApps.find((bl) => bl.id === p.id) &&
            pl.findIndex((item) => getSimpleName(item) === getSimpleName(p)) === index,
        )
        .sort((a, b) => getSimpleName(a).localeCompare(getSimpleName(b)));
      setActiveApps(knownAppProcesses);
    });
  }, [knownApps, blacklistedApps]);

  return {
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
    setBlacklistedApps,
  };
};
