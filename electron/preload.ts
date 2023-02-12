import { SourcesOptions } from 'electron';

const { contextBridge, ipcRenderer, desktopCapturer } = require('electron');

const callIpcRenderer = (method: string, channel: string, ...args: any[]) => {
  if (typeof channel !== 'string' || !channel.startsWith('app/')) {
    console.log('Error: IPC channel name not allowed');
  }
  if (['invoke', 'send'].includes(method)) {
    return ipcRenderer[method](channel, ...args);
  }
  if ('on' === method) {
    const listener = args[0];
    if (!listener) console.log('Listener must be provided');

    // Wrap the given listener in a new function to avoid exposing
    // the `event` arg to our renderer.
    const wrappedListener = (_event, ...a) => listener(...a);
    ipcRenderer.on(channel, wrappedListener);

    // The returned function must not return anything (and NOT
    // return the value from `removeListener()`) to avoid exposing ipcRenderer.
    return () => {
      ipcRenderer.removeListener(channel, wrappedListener);
    };
  }
};

const callMyCapturer = (options: SourcesOptions, ...args: any[]) => {
  return desktopCapturer.getSources(options);
};

contextBridge.exposeInMainWorld('myIpcRenderer', {
  invoke: (...args: [any]) => callIpcRenderer('invoke', ...args),
  send: (...args: [any]) => callIpcRenderer('send', ...args),
  on: (...args: [any]) => callIpcRenderer('on', ...args),
  getSources: (...args: [any]) => callMyCapturer(...args),
});
