use serde::Deserialize;
use tfc::{Context, Enum, Key, KeyboardContext, MouseButton, MouseContext};

#[derive(Deserialize, PartialEq, Debug)]
#[serde(untagged)]
pub enum Step {
  MouseMove {
    x: f64,
    y: f64,
  },
  MouseButton(MouseButtonStep),
  Key(KeyboardStep),
  Wait { time: f64 },
}

impl Step {
  pub fn run(&self, ctx: &mut Context) {
    match self {
      Self::MouseMove{ x, y } => {
        ctx.mouse_move_abs(*x as i32, *y as i32).unwrap();
      }
      Self::MouseButton(mouse) => mouse.run(ctx),
      Self::Key(key) => key.run(ctx),
      Self::Wait { time } => {
        let duration = std::time::Duration::from_millis(*time as u64);
        std::thread::sleep(duration);
      }
    }
  }
}

#[derive(Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct MouseButtonStep {
  #[serde(deserialize_with = "deserialize_mouse_button")]
  button: MouseButton,
  #[serde(rename = "type")]
  kind: MouseButtonStepKind,
}

impl MouseButtonStep {
  fn run(&self, ctx: &mut Context) {
    match self.kind {
      MouseButtonStepKind::MousePress => ctx.mouse_down(self.button).unwrap(),
      MouseButtonStepKind::MouseRelease => ctx.mouse_up(self.button).unwrap(),
      MouseButtonStepKind::MouseClick => ctx.mouse_click(self.button).unwrap(),
    }
  }
}

fn deserialize_mouse_button<'de, D>(deserializer: D) -> Result<MouseButton, D::Error>
where
  D: serde::Deserializer<'de>,
{
  let repr = i32::deserialize(deserializer)?;
  MouseButton::from_u8(repr as u8).ok_or_else(|| serde::de::Error::custom("Invalid MouseButton"))
}

#[derive(Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
enum MouseButtonStepKind {
  MousePress,
  MouseRelease,
  MouseClick,
}

#[derive(Deserialize, PartialEq, Debug)]
pub struct KeyboardStep {
  #[serde(deserialize_with = "deserialize_key")]
  key: Key,
  #[serde(rename = "type")]
  kind: KeyboardStepKind,
}

fn deserialize_key<'de, D>(deserializer: D) -> Result<Key, D::Error>
where
  D: serde::Deserializer<'de>,
{
  let repr = i32::deserialize(deserializer)?;
  Key::from_u8(repr as u8).ok_or_else(|| serde::de::Error::custom("Invalid Key"))
}

impl KeyboardStep {
  fn run(&self, ctx: &mut Context) {
    match self.kind {
      KeyboardStepKind::KeyPress => ctx.key_down(self.key).unwrap(),
      KeyboardStepKind::KeyRelease => ctx.key_up(self.key).unwrap(),
      KeyboardStepKind::KeyClick => ctx.key_click(self.key).unwrap(),
    }
  }
}

#[derive(Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
enum KeyboardStepKind {
  KeyPress,
  KeyRelease,
  KeyClick,
}

#[cfg(test)]
mod test {
    use serde_json::{from_value, json};
    use tfc::MouseButton;

    use super::*;

  #[test]
  fn test_wait() {
    let wait = json!({
      "type": "wait",
      "time": 3
    });
    let _: Step = from_value(wait).unwrap();
  }

  #[test]
  fn test_wait_float() {
    let wait = json!({
      "type": "wait",
      "time": 1.5
    });
    let _: Step = from_value(wait).unwrap();
  }

  #[test]
  fn test_mouse_move() {
    let data = json!({
      "type": "mouseMove",
      "x": 2,
      "y": 3
    });
    let ser: Step = from_value(data).unwrap();
    assert_eq!(ser, Step::MouseMove{ x: 2f64, y: 3f64})
  }

  #[test]
  fn test_mouse_move_float() {
    let data = json!({
      "type": "mouseMove",
      "x": 2.2,
      "y": 3.3,
    });
    let ser: Step = from_value(data).unwrap();
    assert_eq!(ser, Step::MouseMove{x: 2.2, y: 3.3});
  }

  #[test]
  fn test_mouse_press() {
    let data_press = json!({
      "type": "mousePress",
      "button": 1
    });
    let ser: Step = from_value(data_press).unwrap();
    assert_eq!(ser, Step::MouseButton(MouseButtonStep {
      button: MouseButton::Right,
      kind: MouseButtonStepKind::MousePress
    }));
  }

  #[test]
  fn test_mouse_release() {
    let data_release = json!({
      "type": "mouseRelease",
      "button": 0
    });
    let ser: Step = from_value(data_release).unwrap();
    assert_eq!(ser, Step::MouseButton(MouseButtonStep {
      button: MouseButton::Left,
      kind: MouseButtonStepKind::MouseRelease
    }));
  }

  #[test]
  fn test_mouse_click() {
    let data_click = json!({
      "type": "mouseClick",
      "button": 2
    });
    let ser: Step = from_value(data_click).unwrap();
    assert_eq!(ser, Step::MouseButton(MouseButtonStep {
      button: MouseButton::Middle,
      kind: MouseButtonStepKind::MouseClick
    }));
  }

  #[test]
  fn test_key_press() {
    let data_press = json!({
      "type": "keyPress",
      "key": 13
    });
    let ser: Step = from_value(data_press).unwrap();
    assert_eq!(ser, Step::Key(KeyboardStep {
      key: Key::Escape,
      kind: KeyboardStepKind::KeyPress,
    }));
  }

  #[test]
  fn test_key_release() {
    let data_release = json!({
      "type": "keyRelease",
      "key": 52
    });
    let ser: Step = from_value(data_release).unwrap();
    assert_eq!(ser, Step::Key(KeyboardStep {
      key: Key::P,
      kind: KeyboardStepKind::KeyRelease,
    }));
  }

  #[test]
  fn test_key_click() {
    let data_click = json!({
      "type": "keyClick",
      "key": 72
    });
    let ser: KeyboardStep = from_value(data_click).unwrap();
    assert_eq!(ser, KeyboardStep {
      key: Key::N9,
      kind: KeyboardStepKind::KeyClick,
    });
  }
}
