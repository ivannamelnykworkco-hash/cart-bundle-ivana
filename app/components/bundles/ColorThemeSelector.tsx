// app/components/bundles/ColorThemeSelector.tsx
import { InlineStack, Text } from "@shopify/polaris";

interface ColorThemeSelectorProps {
  colors: string[];
  selectedColor?: string;
  onSelectColor: (color: string) => void;
}

export function ColorThemeSelector({ colors, selectedColor, onSelectColor }: ColorThemeSelectorProps) {
  return (
    <InlineStack gap="200" blockAlign="center">
      <Text as="span">Color theme</Text>
      {colors.map((color) => (
        <button
          key={color}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: color,
            border: selectedColor === color ? "3px solid #000" : "2px solid #e1e3e5",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onClick={() => onSelectColor(color)}
          aria-label={`Select ${color} color theme`}
        />
      ))}
    </InlineStack>
  );
}