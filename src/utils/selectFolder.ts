import { open } from '@tauri-apps/api/dialog';
import { appConfigDir } from '@tauri-apps/api/path';

export const selectFolder = async () => {
  return await open({
    directory: true,
    multiple: false,
    defaultPath: await appConfigDir(),
  });
};
