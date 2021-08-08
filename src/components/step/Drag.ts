import { RefObject } from 'preact'
import { DragSourceMonitor, DropTargetMonitor, XYCoord } from 'react-dnd'

export interface DragProps {
  index: number
  canDrag: boolean
  hasArrow: boolean
  isRunning: boolean
  onMove: (drag: number, hover: number) => void
  onDelete: (index: number) => void
}

export interface DragItem {
  index: number
  onMove: (drag: number, hover: number) => void
}

export const dropSpec = (ref: RefObject<Element>, index: number) => {
  const collect = (monitor: DropTargetMonitor) => {
    return {
      handlerId: monitor.getHandlerId,
    }
  }
  const onHover = (item: DragItem, monitor: DropTargetMonitor) => {
    if (!ref.current) {
      return
    }
    const dragIndex = item.index
    const hoverIndex = index

    if (dragIndex === hoverIndex) {
      return
    }

    const hoverBoundingRect = ref.current.getBoundingClientRect()
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    const clientOffset = monitor.getClientOffset()
    const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }

    item.onMove(dragIndex, hoverIndex)
    item.index = hoverIndex
  }
  return {
    accept: 'step',
    collect,
    hover: onHover,
  }
}

export const dragSpec = (item: DragItem, canDrag: boolean) => ({
  type: 'step',
  item: () => {
    return item
  },
  canDrag: () => canDrag,
  collect: (monitor: DragSourceMonitor) => ({
    isDragging: monitor.isDragging(),
  }),
})
