import { Button, Checkbox, Icon, InlineGrid, InlineStack, Text, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { PopUpover } from "./PopUpover";
import { ImageLoad } from "./ImageLoad";
import { GiftCardIcon } from '@shopify/polaris-icons';
export function GiftItem({ deleteId, deleteSection }: { deleteId: any, deleteSection: (id: any) => void }) {

  const [imageSizeValue, setImageSizeValue] = useState('10');
  const [isShowOriginalPrice, setIsShowOriginalPrice] = useState(true);
  const [isOnlysubscription, setIsOnlysubscription] = useState(false);


  const handleImageSizeChange = useCallback(
    (newValue: string) => setImageSizeValue(newValue),
    [],
  );
  return (
    <div style={{ borderRadius: "10px", border: '1px solid lightgrey', padding: '15px', gap: "10px", display: 'flex', flexDirection: 'column' }}>
      <InlineStack align="space-between">
        <InlineStack>
          <Icon source={GiftCardIcon}></Icon>
          <Text as="span" variant="bodyMd" fontWeight="semibold">
            Gift
          </Text>
        </InlineStack>
        <Button variant="plain" textAlign="left" onClick={() => deleteSection(deleteId)}>
          Remove free gift
        </Button>
      </InlineStack>

      {/* { select product} */}
      <Button variant="primary">Selecte a product</Button>
      {/* {Text} */}
      <PopUpover title='Text' defaultPopText='+ FREE Gift' />

      {/* {Imageload and image size} */}
      <InlineGrid columns={2}>
        <ImageLoad />
        <TextField
          label="Image size"
          type="number"
          value={imageSizeValue}
          onChange={handleImageSizeChange}
          autoComplete="off"
          min={1}
          max={50}
          suffix="px"
        />
      </InlineGrid>

      {/* {checkbox} */}
      <InlineStack gap="200">
        <Checkbox
          label="Show original price"
          checked={isShowOriginalPrice}
          onChange={setIsShowOriginalPrice}
        />
        <Checkbox
          label="Apply only for subscriptions"
          checked={isOnlysubscription}
          onChange={setIsOnlysubscription}
        />
      </InlineStack>
    </div>

  )
}