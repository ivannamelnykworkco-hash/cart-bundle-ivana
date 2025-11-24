import {
  BlockStack,
  Text,
} from "@shopify/polaris";

import { ColorPickerPopover } from 'app/components/common/ColorPickerPopover'

export function SelectableColorSwatch({ title }) {
  return (
    <BlockStack gap="100">
      <Text as="p" variant="bodyMd" fontWeight="semibold">
        {title}
      </Text>
      <ColorPickerPopover />
    </BlockStack>
  )
}