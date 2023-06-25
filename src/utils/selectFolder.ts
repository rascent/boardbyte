import { open } from '@tauri-apps/api/dialog';
import { appConfigDir } from '@tauri-apps/api/path';
// Open a selection dialog for directories

export const selectFolder = async () => {
  const selected = await open({
    directory: true,
    multiple: true,
    defaultPath: await appConfigDir(),
  });
  if (Array.isArray(selected)) {
    // user selected multiple directories
  } else if (selected === null) {
    // user cancelled the selection
  } else {
    // user selected a single directory
  }
};
