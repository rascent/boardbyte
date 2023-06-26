import {
  app,
  shell,
  BrowserWindow,
  Menu,
  Tray,
  dialog,
  desktopCapturer,
  globalShortcut
} from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { ipcMain } from 'electron';
import { promises } from 'fs';
import mime from 'mime';

interface Bind {
  key: string;
  name: string;
}

const appName = 'Boardbyte';

const bindings: Bind[] = [];

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    frame: false,
    width: 1366,
    height: 768,
    minWidth: 768,
    minHeight: 50,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#fff',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Show ${appName}`,
      click: function () {
        mainWindow.show();
      }
    },

    {
      label: 'Quit',
      click: function () {
        app.quit();
      }
    },
    { type: 'separator' },
    {
      label: app.getVersion()
    }
  ]);

  ipcMain.handle('close', () => {
    mainWindow.close();
  });

  ipcMain.handle('min', () => {
    mainWindow.hide();
  });

  const tray = new Tray(icon);
  tray.setContextMenu(contextMenu);
  tray.setToolTip(appName);
  tray.addListener('click', () => {
    mainWindow.show();
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

async function listAudioFiles(dir: string) {
  const paths: string[] = [];

  await promises.readdir(dir).then((files) => {
    for (const file of files) {
      const filePath = `${dir}/${file}`;
      if (
        mime.getType(filePath) === 'audio/mpeg' ||
        mime.getType(filePath) === 'audio/wav' ||
        mime.getType(filePath) === 'audio/ogg'
      ) {
        paths.push('file://' + filePath);
      }
    }
  });

  return paths;
}

ipcMain.handle('list_audio_files', (_event, dir) => {
  return new Promise((resolve, reject) => {
    listAudioFiles(dir)
      .then((paths) => {
        resolve(paths);
      })
      .catch((err) => {
        reject(err);
      });
  });
});

ipcMain.handle('select_folder', () => {
  return new Promise((resolve) => {
    dialog
      .showOpenDialog({ properties: ['openDirectory'] })
      .then((result) => {
        const dir = result.filePaths[0];
        if (dir) {
          resolve(dir);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

ipcMain.on('setkey', (event, key: string, title: string) => {
  let exists = false;

  if (key === '') return;

  for (const bind of bindings) {
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
      name: title
    });
  }

  try {
    globalShortcut.register(key, () => {
      event.reply('keypressed', key);
    });
  } catch (error) {
    console.log(error);
  }
});

ipcMain.on('save_recording', async (event, data) => {
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save Audio',
    defaultPath: `audio-${Date.now()}`,
    filters: [{ name: 'Audio', extensions: ['wav'] }]
  });

  if (filePath)
    promises
      .writeFile(filePath, data)
      .then(() => {
        event.reply('save_success', true);
      })
      .catch((e) => console.log(e));
});

ipcMain.handle('app_list', () => {
  return new Promise((resolve, reject) => {
    desktopCapturer
      .getSources({
        types: ['window', 'screen'],
        fetchWindowIcons: true
      })
      .then((sources) => {
        resolve(
          sources.map((source) => {
            return {
              id: source.id,
              name: source.name,
              url: source.appIcon?.toDataURL()
            };
          })
        );
      })
      .catch((error) => {
        reject(error);
      });
  });
});
