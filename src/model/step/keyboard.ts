import { Key } from '../input'
import { Step } from './step'

interface KeyStep extends Step {
  key: Key
}

type ConcreteKeyStep = KeyDownStep | KeyReleaseStep | KeyPressStep

export type { ConcreteKeyStep as KeyStep }

export interface KeyDownStep extends KeyStep {
  type: 'keyPress'
}

export interface KeyReleaseStep extends KeyStep {
  type: 'keyRelease'
}

export interface KeyPressStep extends KeyStep {
  type: 'keyClick'
}
