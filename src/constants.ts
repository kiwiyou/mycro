import { MouseButton } from './model/input'

export const LANGUAGE = {
  mouseMove: '위치로 커서를 움직이기',
  mouseButton: {
    [MouseButton.Left]: '마우스 왼쪽 버튼',
    [MouseButton.Right]: '마우스 오른쪽 버튼',
    [MouseButton.Middle]: '마우스 휠',
  },
  mousePress: '누르고 있기',
  mouseRelease: '떼기',
  mouseClick: '클릭하기',
  keyPress: '누르고 있기',
  keyRelease: '떼기',
  keyClick: '눌렀다 떼기',
  wait: '기다리기',
}
