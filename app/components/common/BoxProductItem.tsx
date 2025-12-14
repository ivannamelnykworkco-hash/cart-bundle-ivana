import { Box, Button, InlineGrid, InlineStack, Select, Text, TextField, Thumbnail } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { DeleteIcon } from '@shopify/polaris-icons';
import { useLoaderData } from "@remix-run/react";
import type { loader } from "../product/ProductList";
import { SelectProductModal } from "./SelectProductModal";
export function BoxProductItem({
  barId,
  id,
  deleteSection,
  selectedProduct,
  productItemData,
  onDataAddProductItemChange
}) {

  const [selectPrice, setSelectPrice] = useState(productItemData.selectPrice ?? "");
  const [selectedVariants, setSelectedVariants] = useState(productItemData.selectedVariants ?? "");
  const [discountPrice, setDiscountPrice] = useState(productItemData.discountPrice ?? 20);
  const [quantity, setQuantity] = useState(productItemData.quantity ?? 1);
  const barAddUpsellDefaultPrice = selectedProduct[1].price;
  useEffect(() => {
    if (!selectedProduct) return;
    const basePrice = Number(barAddUpsellDefaultPrice) || 0;
    const value = Number(discountPrice) || 0;
    let base = quantity * basePrice;
    let calculated = base;
    if (selectPrice === "discounted%") {
      calculated = base * (1 - value / 100);
    } else if (selectPrice === "discounted$") {
      calculated = base - value;
    } else if (selectPrice === "specific") {
      calculated = value;
    }

    if (calculated < 0)
      calculated = 0;
    // IMPORTANT → Add upsell.id here
    if (onDataAddProductItemChange) {
      onDataAddProductItemChange(id, barId, {
        selectPrice,
        quantity,
        barAddUpsellDefaultPrice,
        selectedVariants,
        selectedProduct,
        discountPrice,
        calc: Number(calculated.toFixed(2)),
        base: Number(base.toFixed(2)),
      }
      );
    }
  }, [
    id,
    barId,
    selectPrice,
    quantity,
    barAddUpsellDefaultPrice,
    selectedVariants,
    selectedProduct,
    discountPrice,
    onDataAddProductItemChange,
  ]);


  const upsellsOptions = [
    { label: "Default", value: 'default' },
    { label: "Discounted % (e.g, %20 off)", value: 'discounted%' },
    { label: "Discounted $ (e.g, $10 off)", value: 'discounted$' },
    { label: "Specific (e.g, $29)", value: 'specific' }
  ];

  return (
    <div style={{ borderRadius: "10px", border: '1px solid lightgrey', padding: '15px', gap: "10px", display: 'flex', flexDirection: 'column' }}>
      <InlineStack align="space-between" wrap={false}>
        <InlineStack gap="200">
          {selectedProduct && selectedProduct[0] && (
            <div style={{ marginBottom: '10px', display: 'flex', gap: '20px' }}>
              <Thumbnail
                source={selectedProduct[0].imageUrl}
                alt={selectedProduct[0].title}
              />
              <Text as='span' fontWeight="bold">
                {selectedProduct[0].title}
              </Text>
            </div>
          )}
        </InlineStack>
        <InlineStack gap="200" align="end" blockAlign="center">
          <Box width='30%'>
            <TextField
              label
              type="number"
              value={quantity}
              onChange={setQuantity}
              autoComplete="off"
            />
          </Box>
          <Button
            variant="plain"
            textAlign="left"
            onClick={() => deleteSection(barId, id)}
            icon={DeleteIcon} // pass both
          ></Button>
        </InlineStack>
      </InlineStack>
      {/* {change pre-selectd variant} */}
      <SelectProductModal
        productArray={selectedProduct}
        onSelect={setSelectedVariants}
        title="Add variant"
        selectionMode="singleVariant"
        buttonText="Select pre-selected variant"
      />
      {/* { price and title and subtitle} */}
      <InlineGrid columns={2} gap="200">
        <Select
          label="Price"
          options={upsellsOptions}
          onChange={setSelectPrice}
          value={selectPrice}
        />
        {selectPrice === 'discounted%' && (
          <TextField
            label="Discount per item"
            type="number"
            value={discountPrice}
            onChange={setDiscountPrice}
            autoComplete="off"
            min={1}
            max={100}
            suffix="%"
          />
        )}
        {selectPrice === 'discounted$' && (
          <TextField
            label="Discount per item"
            type="number"
            value={discountPrice}
            onChange={setDiscountPrice}
            autoComplete="off"
            min={1}
            max={100}
            suffix="USD"
            prefix="$"
          />
        )}
        {selectPrice === 'specific' && (
          <TextField
            label="Total price"
            type="number"
            value={discountPrice}
            onChange={setDiscountPrice}
            autoComplete="off"
            min={1}
            max={100}
            suffix="USD"
            prefix="$"
          />
        )}
      </InlineGrid>
    </div>

  )
}