import {
  BlockStack,
  Box,
  Button,
  ColorPicker,
  Icon,
  InlineStack,
  Popover,
  TextField,
  hsbToHex,
} from "@shopify/polaris";
import { useState } from "react";

interface HSBColor {
  hue: number;
  saturation: number;
  brightness: number;
  alpha?: number;
}

export function ColorPickerPopover({
  defaultColor,
  onColorChange, // The callback to pass the hex value to the parent
}: {
  defaultColor: HSBColor;
  onColorChange: (hex: string) => void; // Callback function type definition
}) {
  const [color, setColor] = useState<HSBColor>(defaultColor);

  const [hexValue, setHexValue] = useState<string>(hsbToHex(color));
  const [active, setActive] = useState<boolean>(false);

  const toggleActive = () => setActive((prev) => !prev);

  /** Handle ColorPicker change */
  const handleColorChange = (hsb: HSBColor) => {
    setColor(hsb);
    setHexValue(hsbToHex(hsb));
    onColorChange(hsbToHex(hsb));
  };


  /** Convert HEX → HSB */
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

  /** Handle HEX ↔ HSB sync */
  const handleHexChange = (value: string) => {
    setHexValue(value);

    // valid hex?
    if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      try {
        const hsb = hexToHsb(value);
        setColor({ ...hsb, alpha: color.alpha });
        onColorChange(value);
      } catch {
        /* ignore invalid */
      }
    }
  };

  return (
    <Popover
      active={active}
      preferredAlignment="right"
      activator={
        <Button
          disclosure="select"
          icon={<Icon
            source={() => (
              <div
                style={{
                  background: hexValue,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                }}
              />
            )}
          />}
          onClick={toggleActive}
          fullWidth
        />
      }
      onClose={toggleActive}
    >
      <Box padding="300">
        <BlockStack gap="200">
          <ColorPicker
            color={color}
            onChange={handleColorChange}
            allowAlpha
            fullWidth
          />

          <InlineStack align="space-between" blockAlign="center">
            <Box width="60%">
              <TextField
                label="HEX"
                value={hexValue}
                onChange={handleHexChange}
                autoComplete="off"
                clearButton
              />
            </Box>

            <Box width="35%">
              <TextField
                label="Alpha"
                type="number"
                value={String(color.alpha ?? 1)}
                onChange={(val) =>
                  setColor({ ...color, alpha: parseFloat(val) })
                }
                step={0.1}
                min="0"
                max="1"
                autoComplete="off"
              />
            </Box>
          </InlineStack>
        </BlockStack>
      </Box>
    </Popover>
  );
}
