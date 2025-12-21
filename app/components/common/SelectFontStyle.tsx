import { Select } from '@shopify/polaris';
import { useState, useCallback } from 'react';

interface SelectFontStyleProps {
  defaultLabel: any;
  upFontStyleChange: any;
}
export function SelectFontStyle({ defaultLabel, upFontStyleChange }: SelectFontStyleProps) {
  const [selected, setSelected] = useState(defaultLabel);

  const handleSelectChange = useCallback(
    (value: string) => { setSelected(value); upFontStyleChange(value); },
    [upFontStyleChange],
  );

  const options = [
    { label: "Light", value: 'styleLight' },
    { label: "Italic", value: 'styleLightItalic' },
    { label: "Regular", value: 'styleRegular' },
    { label: "Medium", value: 'styleMedium' },
    { label: "Medium Italic", value: 'styleMediumItalic' },
    { label: "Bold", value: 'styleBold' },
    { label: "Bold Italic", value: 'styleBoldItalic' }
  ];

  return (
    <div style={{ width: "100%" }}>
      <Select
        label="Font style"
        options={options}
        onChange={handleSelectChange}
        value={selected}
      />
    </div>
  );
}