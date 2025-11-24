import { Text } from "@shopify/polaris";
import { ColorPickerPopover } from "../common/ColorPickerPopover";

interface SelectColorProps {
  subtitle: any;
  defaultColorSetting: any;
  colorWidth: any;
  onColorChange: any;
}

export function ColorPickerPopoverItem({ subtitle, defaultColorSetting, colorWidth, onColorChange }: SelectColorProps) {
  return (
    <div style={{ width: colorWidth }}>
      <Text as="span">
        {subtitle}
      </Text>
      <ColorPickerPopover defaultColor={defaultColorSetting} onColorChange={onColorChange} />
    </div>
  )
}