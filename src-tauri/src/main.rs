// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

#[tauri::command]
fn list_audio_files(dir: String) -> Vec<String> {
    let mut files: Vec<String> = Vec::new();
    for entry in fs::read_dir(dir).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        let path_str = path.to_str().unwrap().to_string();
        if path_str.ends_with(".mp3")
            || path_str.ends_with(".wav")
            || path_str.ends_with(".ogg")
            || path_str.ends_with(".flac")
        {
            files.push(path_str);
        }
    }
    files
}

fn app_list() {
    // list apps running on the system
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_audio_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
