declare type ViewProps = {
  width: number,
  height: number,
  border?: boolean
}

declare type ResizeViewProps = {
  width?: number,
  height?: number,
  border?: boolean
}

declare type TextViewProps = {
  text?: string,
  border?: boolean,
  paddingX?: number,
  style?: string,
  color?: string | number
}

declare type EditTextProps = {
  hint?: string,
} & TextViewProps

declare type Container = string[][]

declare type ViewId = string