/// Tauri desktop wrapper for the Water-Display showcase.
/// The entire UI is the pre-built web bundle; no native commands needed.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
