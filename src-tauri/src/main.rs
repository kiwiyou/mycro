#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::sync::{Arc, Mutex, mpsc::{SyncSender, sync_channel}};

use step::Step;
use tfc::Context;

mod step;

struct MacroState(Arc<Mutex<Option<SyncSender<()>>>>);

#[tauri::command]
fn run_macro(
  state: tauri::State<MacroState>,
  window: tauri::Window,
  steps: Vec<Step>,
  repeat: bool,
) -> () {
  let mut lock = state.0.lock().unwrap();
  let (sender, receiver) = sync_channel(1);
  *lock = Some(sender);
  std::thread::spawn(move || {
    let iter: Box<dyn Iterator<Item = (usize, &Step)> + Send> = if repeat {
      Box::new(steps.iter().enumerate().cycle())
    } else {
      Box::new(steps.iter().enumerate())
    };
    let mut context = Context::new().expect("Unsupported Platform");
    window.emit("started", ()).unwrap();
    iter
      .take_while(|_| receiver.try_recv().is_err())
      .for_each(|(i, s)| {
        window.emit("running", i).unwrap();
        s.run(&mut context);
      });
    window.emit("finished", ()).unwrap();
  });
}

#[tauri::command]
fn stop_macro(state: tauri::State<MacroState>) {
  let mut lock = state.0.lock().unwrap();
  if let Some(sender) =  lock.take() {
    sender.send(()).unwrap()
  }
}

fn main() {
  tauri::Builder::default()
    .manage(MacroState(Arc::new(Mutex::new(None))))
    .invoke_handler(tauri::generate_handler![run_macro, stop_macro])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
