import { Box, InlineGrid, Text } from '@shopify/polaris';
import { SelectFontStyle } from "./SelectFontStyle";
import { SelectFontSize } from "../common/SelectFontSize";

interface SelectFontProps {
  subtitle: any;
  defaultFontSize: any;
  defaultFontLabel: any;
  onSizeChange: any;
  onFontStytleChange: any;
}

export function SelectFont({ subtitle, defaultFontSize, defaultFontLabel, onSizeChange, onFontStytleChange }: SelectFontProps) {
  return (
    <Box width="100%">
      <Text variant="headingSm" as="h6">
        {subtitle}
      </Text>
      <InlineGrid columns={2} gap="200">
        <SelectFontSize defaulSize={defaultFontSize} upSizeChange={onSizeChange}/>
        <SelectFontStyle defaultLabel={defaultFontLabel} upFontStyleChange={onFontStytleChange} />
      </InlineGrid>

    </Box>
  )
}
