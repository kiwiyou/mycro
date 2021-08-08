import { x } from '@xstyled/emotion'
import { FunctionalComponent } from 'preact'
import { useDrag, useDrop } from 'react-dnd'
import { useClickOutside } from '../../lib/hooks/useClickOutside'
import Arrow from './Arrow'
import { DragProps, dragSpec, dropSpec } from './Drag'

export interface NodeProps extends DragProps {
  color: string
  isEditing: boolean
  onEditChange: (newEdit: boolean) => void
}

const Node: FunctionalComponent<NodeProps> = (props) => {
  const {
    color,
    index,
    canDrag,
    isRunning,
    isEditing,
    hasArrow,
    onMove,
    onDelete,
    onEditChange,
    children,
  } = props
  const [ref] = useClickOutside(() => onEditChange(false))
  const [{ handlerId }, drop] = useDrop(dropSpec(ref, index))
  const [{ isDragging }, drag] = useDrag(dragSpec({ index, onMove }, canDrag))

  drag(drop(ref))

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault()
      onDelete(index)
    }
  }

  const onDoubleClick = () => {
    onEditChange(true)
  }

  return (
    <>
      <x.div
        gridArea="auto / 2 / auto / 2"
        borderRadius="full"
        padding={5}
        color="white"
        cursor="pointer"
        userSelect="none"
        bg={isRunning ? `${color}-700` : `${color}-500`}
        boxShadow={isRunning && 'xl'}
        tabIndex={index + 1}
        ref={ref}
        data-handler-id={handlerId}
        ring={isRunning ? 4 : { focus: 4 }}
        ringColor={isRunning ? `${color}-300` : { focus: `${color}-300` }}
        opacity={isDragging ? 0 : 1}
        onKeyDown={isRunning || isEditing ? undefined : onKeyDown}
        onDblClick={onDoubleClick}
      >
        {children}
      </x.div>
      {hasArrow ? (
        <Arrow height="4rem" stroke={`${color}-500`} fill="white" />
      ) : null}
    </>
  )
}

export default Node
