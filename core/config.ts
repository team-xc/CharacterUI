import { renderForConsole } from './render'

export default {
  MATERIAL: {
    TOP_RIGHT: '╮',
    TOP_LEFT: '╭',
    BOTTOM_RIGHT: '╯',
    BOTTOM_LEFT: '╰',
    HORIZONTAL: '─',
    VERTICAL: '│',
    NEW_LINE: '\n',
    BLANK: '\x1b[90m·\x1b[0m',
    SPACE: ' '
  },
  SIZE: {
    CONTAINER_SPACE: 0,
    BORDER_SIZE: 1
  },
  RENDER_METHOD: renderForConsole,
  RENDER_FPS: 20
}