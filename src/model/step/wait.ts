import { Step } from './step'

export interface WaitStep extends Step {
  type: 'wait'
  time: number
}
