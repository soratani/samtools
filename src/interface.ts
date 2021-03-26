export type BaseType = "string" |
  "function" |
  "object" |
  "array" |
  "bigint" |
  "boolean" |
  "symbol" |
  "number" |
  "undefined" |
  "null"

export type TreeChildren<P = any> = P & {
  children: TreeChildren<P>[]
}
