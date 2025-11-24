import { TextField } from '@shopify/polaris';
import { useState, useCallback } from 'react';

interface SelectFontSizeProps {
  defaulSize: any;
  upSizeChange: any
}


export function SelectFontSize({ defaulSize, upSizeChange }: SelectFontSizeProps) {
  const [value, setValue] = useState(defaulSize);

  const handleChange = useCallback(
    (newValue: string) => {setValue(newValue);
     upSizeChange(newValue);},
    [upSizeChange],
  );

  return (
    <div style={{ width: "100%" }}>
      <TextField
        label="Font size"
        type="number"
        value={value}
        onChange={handleChange}
        autoComplete="off"
        min={10}
        max={72}
        suffix="px"
      />
    </div>
  );
}