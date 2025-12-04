import { BlockStack, Box, InlineStack, RangeSlider, Text, TextField } from "@shopify/polaris";
import { useEffect, useState } from "react";

export function RadioWithInput({ defaultValue, title, onChange }: { defaultValue: any, title: any }) {
  const [generalRadius, setGeneralRadius] = useState<any>(defaultValue);
  useEffect(() => {
    if (onChange) {
      onChange(generalRadius);
    }
  }, [generalRadius, onChange]);

  return (
    <Box>
      <BlockStack gap="200" inlineAlign="stretch">
        <Text as="span" variant="bodySm">{title}</Text>
        <InlineStack gap="0" align="space-between" blockAlign="center">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "65%" }}>
            <RangeSlider
              value={Number(generalRadius)} // Make sure 'cornerRadius' is already a number
              onChange={(v: number) => setGeneralRadius(v)} // The 'onChange' should expect a number
              min={0}
              max={40}
              label
              output
            />
          </div>
          <Box width="30%" minHeight="32px">
            <TextField
              autoComplete="off"
              value={`${generalRadius}`} // Convert the number to a string
              onChange={setGeneralRadius} // Convert the string back to a number
              min={0}
              max={100}
              suffix="px"
              label
            />
          </Box>
        </InlineStack>
      </BlockStack>
    </Box>
  )
}