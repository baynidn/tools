/** 教程的极简样式：颜色、间距、frame。只用基础值，保证在 Scripting 里稳。 */

export const palette = {
  label: "#000000",
  secondaryLabel: "#6b6b6b",
  tertiaryLabel: "#9a9a9a",
  accent: "#0a84ff",
  success: "#30d158",
  warning: "#ff9f0a",
  danger: "#ff453a",
  codeBackground: "#f2f2f7",
  cardBackground: "#ffffff",
} as const

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 22, xxl: 30 } as const

export const fullFillFrame = {
  width: "100%",
  height: "100%",
  alignment: "center",
} as const

export const centerFillFrame = {
  width: "100%",
  height: "100%",
  alignment: "center",
} as const

export const leadingFillFrame = {
  width: "100%",
  height: "100%",
  alignment: "leading",
} as const

/** 练习输入框的最小高度：空着也有四五行的位置，字多了会自己长高 */
export const codeInputFrame = {
  minHeight: 110,
} as const
