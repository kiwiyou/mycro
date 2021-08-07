import { FillProps, StrokeProps, x } from '@xstyled/emotion'
import { FunctionalComponent, RefObject } from 'preact'

export interface ArrowProps extends FillProps, StrokeProps {
  height: string | number
}

const Arrow: FunctionalComponent<ArrowProps> = (props) => {
  const { height, fill, stroke } = props
  return (
    <x.div
      display="flex"
      flexDirection="column"
      alignItems="center"
      margin="-8px 0 -10px 5"
      zIndex={20}
    >
      <x.svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <x.path
          d="M8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1Z"
          fill={fill as any}
          stroke={stroke as any}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </x.svg>
      <x.svg
        height={`calc(${height} - 36px)`}
        width="2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <x.line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke={stroke as any}
          strokeWidth="2"
        />
      </x.svg>
      <x.svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <x.path
          d="M9.10557 18.4472C9.27496 18.786 9.62123 19 10 19C10.3788 19 10.725 18.786 10.8944 18.4472L18.8944 2.44721C19.0494 2.13723 19.0329 1.76909 18.8507 1.47427C18.6684 1.17945 18.3466 1 18 1L2 0.999999C1.65342 0.999999 1.33156 1.17945 1.14935 1.47427C0.967142 1.76908 0.950579 2.13722 1.10557 2.44721L9.10557 18.4472Z"
          fill={stroke as any}
          stroke={fill as any}
          stroke-width="2"
          stroke-linejoin="round"
        />
      </x.svg>
    </x.div>
  )
}

export default Arrow
