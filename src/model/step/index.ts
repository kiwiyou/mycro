import { Key, MouseButton } from '../input'
import { KeyDownStep, KeyPressStep, KeyReleaseStep } from './keyboard'
import {
  MouseClickStep,
  MouseDownStep,
  MouseMoveStep,
  MouseReleaseStep,
} from './mouse'
import { WaitStep } from './wait'

export * from './mouse'
export * from './keyboard'
export * from './wait'

export type Step =
  | MouseMoveStep
  | MouseDownStep
  | MouseReleaseStep
  | MouseClickStep
  | KeyDownStep
  | KeyReleaseStep
  | KeyPressStep
  | WaitStep

export const Mouse = {
  move: (x: number, y: number): MouseMoveStep => ({
    type: 'mouseMove',
    x,
    y,
  }),
  press: (button: MouseButton): MouseDownStep => ({
    type: 'mousePress',
    button,
  }),
  release: (button: MouseButton): MouseReleaseStep => ({
    type: 'mouseRelease',
    button,
  }),
  click: (button: MouseButton): MouseClickStep => ({
    type: 'mouseClick',
    button,
  }),
}

export const Keyboard = {
  press: (key: Key): KeyDownStep => ({
    type: 'keyPress',
    key,
  }),
  release: (key: Key): KeyReleaseStep => ({
    type: 'keyRelease',
    key,
  }),
  click: (key: Key): KeyPressStep => ({
    type: 'keyClick',
    key,
  }),
}

export const Wait = {
  sec: (sec: number): WaitStep => ({
    type: 'wait',
    time: sec * 1000,
  }),
}
