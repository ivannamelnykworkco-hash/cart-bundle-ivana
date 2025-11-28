import { Text } from "@shopify/polaris";
import { ColorPickerPopover } from "../common/ColorPickerPopover";

interface SelectColorProps {
  subtitle: any;
  defaultColorSetting: any;
  colorWidth: any;
  onColorChange: any;
}
interface HSBColor {
  hue: number;
  saturation: number;
  brightness: number;
  alpha?: number;
}


export function ColorPickerPopoverItem({ subtitle, defaultColorSetting, colorWidth, onColorChange }: SelectColorProps) {

  console.log('defaultColorSetting==>', defaultColorSetting);

  const hexToHsb = (hex: string): HSBColor => {
    let stripped = hex.replace("#", "");
    if (stripped.length === 3) {
      stripped = stripped
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const r = parseInt(stripped.substring(0, 2), 16) / 255;
    const g = parseInt(stripped.substring(2, 4), 16) / 255;
    const b = parseInt(stripped.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let hue = 0;
    if (diff !== 0) {
      if (max === r) hue = ((g - b) / diff) % 6;
      else if (max === g) hue = (b - r) / diff + 2;
      else hue = (r - g) / diff + 4;

      hue *= 60;
      if (hue < 0) hue += 360;
    }

    const saturation = max === 0 ? 0 : diff / max;
    const brightness = max;

    return { hue, saturation, brightness };
  };

  const defaultHexColor = hexToHsb(defaultColorSetting);

  return (
    <div style={{ width: colorWidth }}>
      <Text as="span">
        {subtitle}
      </Text>
      <ColorPickerPopover defaultColor={defaultHexColor} onColorChange={onColorChange} />
    </div>
  )
}