import { MouseButton } from '../input'
import { Step } from './step'

export interface MouseMoveStep extends Step {
  type: 'mouseMove'
  x: number
  y: number
}

interface MouseButtonStep extends Step {
  button: MouseButton
}

type ConcreteMouseButtonStep = MouseDownStep | MouseReleaseStep | MouseClickStep

export type { ConcreteMouseButtonStep as MouseButtonStep }

export interface MouseDownStep extends MouseButtonStep {
  type: 'mousePress'
}

export interface MouseReleaseStep extends MouseButtonStep {
  type: 'mouseRelease'
}

export interface MouseClickStep extends MouseButtonStep {
  type: 'mouseClick'
}
