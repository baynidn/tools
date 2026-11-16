import { Text, VStack, type Color } from "scripting"
import { centerFillFrame, motion, palette } from "../design/AllPatternDesign"

/** 概览里的单个指标 */
export function StatTile({
  label,
  value,
  tint = palette.secondaryLabel,
}: {
  label: string
  value: number
  tint?: Color
}): ReturnType<typeof VStack> {
  return (
    <VStack alignment="center" spacing={2} frame={centerFillFrame}>
      <Text
        font="caption2"
        foregroundStyle={palette.secondaryLabel}
        multilineTextAlignment="center"
        contentTransition="opacity"
        animation={{ animation: motion.quick, value: label }}
      >
        {label}
      </Text>
      <Text
        font="title"
        fontWeight="bold"
        monospacedDigit
        foregroundStyle={tint}
        multilineTextAlignment="center"
        contentTransition="numericText"
        animation={{ animation: motion.number, value }}
      >
        {value}
      </Text>
    </VStack>
  )
}
