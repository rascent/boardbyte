// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rodio::{
    cpal::{self, traits::HostTrait},
    DeviceTrait,
};
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
            files.push(format!("file://{}", path_str));
        }
    }
    files
}

#[tauri::command]
fn list_audio_devices() -> Vec<String> {
    let host = cpal::default_host();
    let devices = host.output_devices().unwrap();

    let mut devices_string: Vec<String> = Vec::new();
    for device in devices {
        devices_string.push(device.name().unwrap().to_string());
    }
    devices_string
}

// TODO: implement
#[tauri::command]
fn app_list() {
    // list apps running on the system
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            list_audio_files,
            list_audio_devices,
            app_list,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
