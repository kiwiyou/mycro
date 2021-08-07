import { x } from '@xstyled/emotion'
import { FunctionComponent } from 'preact'
import { useRef } from 'preact/hooks'
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from 'react-dnd'
import { LANGUAGE } from '../constants'
import { Key } from '../model/input'
import { KeyStep, MouseButtonStep, Step } from '../model/step'
import Arrow from './Arrow'

export interface StepViewProps {
  running?: boolean
  step: Step
  index: number
  draggable?: boolean
  hasArrow: boolean
  moveView: (drag: number, hover: number) => void
  deleteView?: (index: number) => void
}

interface DragItem {
  step: Step
  index: number
  moveView: (drag: number, hover: number) => void
}

const StepView: FunctionComponent<StepViewProps> = (props) => {
  const { running, step, index, hasArrow, moveView, deleteView } = props
  const ref = useRef<HTMLLIElement>(null)
  const draggable = props.draggable ?? true
  const [{ handlerId }, drop] = useDrop({
    accept: 'step',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current || !draggable) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveView(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: 'step',
    item: () => {
      return { index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const [target, action, bg] = getMessage(step)

  const onKeyDown = (e: any) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (deleteView) {
        deleteView(index)
      }
    }
  }

  drag(drop(ref))
  return (
    <>
      <x.li
        tabIndex={index + 1}
        ref={ref}
        data-handler-id={handlerId}
        borderRadius="full"
        padding={5}
        boxShadow={running && 'lg'}
        zIndex={running && '10'}
        bg={{ _: `${bg}-500`, hover: `${bg}-700` }}
        color="white"
        ring={running ? 4 : { focus: 4 }}
        ringColor={running ? '${bg}-200' : { focus: 'gray-300' }}
        cursor="pointer"
        userSelect="none"
        opacity={isDragging ? 0 : 1}
        onKeyDown={running ? undefined : onKeyDown}
      >
        <x.b>{target}</x.b> {LANGUAGE[action]}
      </x.li>
      {hasArrow ? (
        <Arrow height="4em" stroke={`${bg}-500`} fill="white" />
      ) : null}
    </>
  )
}

function getMessage(step: Step): [string, keyof typeof LANGUAGE, string] {
  let target: string
  let action = step.type
  let bg: string

  if (step.type === 'mouseMove') {
    target = `(${step.x}, ${step.y})`
    bg = 'amber'
  } else if ((step as any).button !== undefined) {
    target = LANGUAGE.mouseButton[(step as MouseButtonStep).button]
    bg = 'amber'
  } else if ((step as any).key !== undefined) {
    bg = 'purple'
    target = Key[(step as KeyStep).key]
    target += ' 키'
  } else if (step.type === 'wait') {
    bg = 'red'
    target = `${step.time / 1000}초`
  } else {
    throw Error('Unsupported step type')
  }
  return [target, action, bg]
}

export default StepView
