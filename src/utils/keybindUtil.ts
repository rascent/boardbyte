export const registerKeybind = (keybind: string, name: string) => {
  window.myIpcRenderer.send("app/setkey", keybind, name);
};

export const unregisterKeybind = (name: string) => {
  window.myIpcRenderer.send("app/setkey", "", name);
};
