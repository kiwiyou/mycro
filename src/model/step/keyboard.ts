import { Key } from '../input'
import { Step } from './step'

export interface KeyStep extends Step {
  key: Key
}

export interface KeyDownStep extends KeyStep {
  type: 'keyPress'
}

export interface KeyReleaseStep extends KeyStep {
  type: 'keyRelease'
}

export interface KeyPressStep extends KeyStep {
  type: 'keyClick'
}
