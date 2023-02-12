import {
  App,
  app,
  BrowserWindow,
  desktopCapturer,
  dialog,
  globalShortcut,
  ipcMain,
  Menu,
  Tray,
} from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import isDev from 'electron-is-dev';
import { autoUpdater } from 'electron-updater';
import { IpcMainEvent } from 'electron/main';
import fs from 'fs';
import mime from 'mime';
import path from 'path';

const fspromise = fs.promises;

interface Bind {
  key: string;
  name: string;
}

const appName: string = 'Boardbyte';

export default class Main {
  static mainWindow: BrowserWindow;
  static application: App;
  static BrowserWindow;
  static HotkeyEvent: IpcMainEvent;
  static tray: Tray;
  static Menu: Menu;

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      Main.application.quit();
    }
  }

  private static onClose() {
    Main.application.exit(0);
  }

  private static onReady() {
    Main.mainWindow = new Main.BrowserWindow({
      frame: false,
      width: 1366,
      height: 768,
      minWidth: 768,
      minHeight: 50,
      webPreferences: {
        webSecurity: false,
        // nodeIntegration: false,
        // contextIsolation: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      backgroundColor: '#fff',
    });
    Main.mainWindow.loadURL(
      isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`
    );
    Main.mainWindow.on('closed', Main.onClose);

    Main.mainWindow.on('minimize', (e) => {
      e.preventDefault();
    });

    // ? Hot Reloading
    if (isDev) {
      try {
        require('electron-reloader')(module, {
          debug: true,
          watchRenderer: true,
        });
      } catch (_) {
        console.log('Error reloader');
      }
    }

    // ? DevTools
    installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));

    const log = require('electron-log');
    log.transports.file.level = 'debug';
    autoUpdater.logger = log;

    autoUpdater.on('error', (error) => {
      dialog.showErrorBox(
        'Error: ',
        error === null ? 'unknown' : (error.stack || error).toString()
      );
    });
    if (!isDev) {
      autoUpdater.checkForUpdatesAndNotify();
    }

    var contextMenu = Menu.buildFromTemplate([
      {
        label: `Show ${appName}`,
        click: function () {
          Main.mainWindow.show();
        },
      },

      {
        label: 'Quit',
        click: function () {
          Main.application.quit();
        },
      },
      { type: 'separator' },
      {
        label: app.getVersion(),
      },
    ]);

    Main.tray = new Tray(path.join(__dirname, '../build/icon.png'));
    Main.tray.setContextMenu(contextMenu);
    Main.tray.setToolTip(`${appName}`);
    Main.tray.addListener('click', (e) => {
      Main.mainWindow.show();
    });
  }

  private static listenerVersion() {
    ipcMain.on('app/getVersion', (event) => {
      if (!isDev) {
        autoUpdater.on('update-available', (info) => {
          event.reply('app/currentVersion', info);
        });
        autoUpdater.checkForUpdates();
        event.reply('app/currentVersion', app.getVersion());
      } else {
        event.reply('app/currentVersion', 'DEV');
      }
    });
  }

  private static async listAudioFiles(dir: string) {
    let paths: string[] = [];
    let fileNames: string[] = [];

    await fspromise.readdir(dir).then((files) => {
      for (const file of files) {
        let filePath = path.join(dir, file);
        if (
          mime.getType(filePath) === 'audio/mpeg' ||
          mime.getType(filePath) === 'audio/wav' ||
          mime.getType(filePath) === 'audio/ogg'
        ) {
          paths.push(path.join(dir, file));
          fileNames.push(file);
        }
      }
    });

    return [paths, fileNames];
  }

  private static listenerListFiles() {
    ipcMain.on('app/listFiles', (event, dir) => {
      this.listAudioFiles(dir).then(([paths, files]) => {
        let load = {
          dir: dir,
          paths: paths,
          fileNames: files,
        };

        event.sender.send('app/listedFiles', load);
      });
    });
  }

  private static listenerFileSelection() {
    // ? For selecting directory
    ipcMain.handle('app/showDialog', (event, ...args) => {
      return new Promise((resolve, reject) => {
        dialog
          .showOpenDialog({ properties: ['openDirectory'] })
          .then((result) => {
            let dir = result.filePaths[0];
            if (dir) {
              this.listAudioFiles(dir).then(([paths, files]) => {
                let load = {
                  dir: dir,
                  paths: paths,
                  fileNames: files,
                };

                resolve(load);

                event.sender.send('app/listedFiles', load);
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  }

  private static listenerClose() {
    ipcMain.handle('app/close', (event, ...args) => {
      Main.mainWindow.close();
    });
  }

  private static listenerMin() {
    ipcMain.handle('app/min', (event, ...args) => {
      Main.mainWindow.hide();
    });
  }

  private static listenerHotkey() {
    let bindings: Bind[] = [];

    ipcMain.on('app/setkey', (event, key: string, title: string, ...args) => {
      let exists = false;

      if (key === '') return;

      for (let bind of bindings) {
        if (bind.name === title) {
          exists = true;
          try {
            globalShortcut.unregister(bind.key);
          } catch (e) {
            console.log('Failed to set keybind', e);
          }
          bind.key = key;
        }
      }

      if (!exists) {
        bindings.push({
          key: key,
          name: title,
        });
      }

      try {
        globalShortcut.register(key, () => {
          event.reply('app/keypressed', key);
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  private static listenerRecording() {
    ipcMain.on('app/saveRecording', async (event, data) => {
      const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save Audio',
        defaultPath: `audio-${Date.now()}`,
        filters: [{ name: 'Audio', extensions: ['wav'] }],
      });

      if (filePath)
        fspromise
          .writeFile(filePath, data)
          .then(event.reply('app/saveSuccess', true))
          .catch((e) => console.log(e));
    });
  }

  private static listenerPs() {
    ipcMain.handle('app/ps', (event, ...args) => {
      return new Promise((resolve, reject) => {
        desktopCapturer
          .getSources({
            types: ['window', 'screen'],
            fetchWindowIcons: true,
          })
          .then((sources) => {
            return resolve(
              sources.map((source) => {
                return {
                  id: source.id,
                  name: source.name,
                  url: source.appIcon?.toDataURL(),
                };
              })
            );
          });
      });
    });
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // ? Makes the code easier to write tests for
    Main.BrowserWindow = browserWindow;

    Main.application = app;
    Main.application.on('window-all-closed', Main.onWindowAllClosed);
    Main.application.on('ready', Main.onReady);

    this.listenerFileSelection();
    this.listenerHotkey();
    this.listenerClose();
    this.listenerMin();
    this.listenerRecording();
    this.listenerListFiles();
    this.listenerVersion();
    this.listenerPs();
  }
}

Main.main(app, BrowserWindow);
