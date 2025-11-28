import { Box, Button, InlineGrid, InlineStack, Select, Text, TextField, Thumbnail } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { DeleteIcon } from '@shopify/polaris-icons';
import { useLoaderData } from "@remix-run/react";
import type { loader } from "../product/ProductList";
import { SelectVariantModal } from "./SelectVariantModal";
import { SelectProductModal } from "./SelectProductModal";
export function BoxProductItem({ bundleId, id, deleteSection, selectproductInfo, upAddProductItemPriceChange, }: { selectproductInfo: any, bundleId: any, id: any, upAddProductItemPriceChange: any, upBundlesBarUpsellTextChange: any, deleteSection: (id: any) => void }) {

  const { loaderData } = useLoaderData<typeof loader>();
  const [productQuantiyValue, setProductQuantiyValue] = useState('1');
  const [selected, setSelected] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productItemValue, setProductItemValue] = useState("20");
  const [barAddUpsellDefaultPrice, setBarAddUpsellDefaultPrice] = useState(
    selectproductInfo[1].price
  );
  const [barDefaultQualityalue, setBarDefaultQualityalue] = useState<number>(1);

  useEffect(() => {
    if (!selectproductInfo) return;
    const quantity = barDefaultQualityalue;
    const basePrice = Number(barAddUpsellDefaultPrice) || 0;
    const value = Number(productItemValue) || 0;

    let base = quantity * basePrice;

    let calculated = base;

    if (selected === "discounted%") {
      calculated = base * (1 - value / 100);
    } else if (selected === "discounted$") {
      calculated = base - value;
    } else if (selected === "specific") {
      calculated = value;
    }

    if (calculated < 0) calculated = 0;
    // IMPORTANT → Add upsell.id here
    if (upAddProductItemPriceChange) {
      upAddProductItemPriceChange(
        bundleId,
        id,
        calculated,
        base
      );
    }
  }, [barDefaultQualityalue, barAddUpsellDefaultPrice, productItemValue, selected, upAddProductItemPriceChange]);

  const handleChange = useCallback(
    (newValue: string) => {
      setProductItemValue(newValue);
    },
    [],
  );
  const handleUpsellSelectChange = useCallback(
    (value: string) => setSelected(value),
    [],
  );
  const handleReceiveProduct = (value) => {
    setSelectedProduct(value);
  };
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
          {selectproductInfo && selectproductInfo[0] && (
            <div style={{ marginBottom: '10px', display: 'flex', gap: '20px' }}>
              <Thumbnail
                source={selectproductInfo[0].imageUrl}
                alt={selectproductInfo[0].title}
              />
              <Text as='p' fontWeight="bold">
                {selectproductInfo[0].title}
              </Text>
            </div>
          )}
        </InlineStack>
        <InlineStack gap="200" align="end" blockAlign="center">
          <Box width='30%'>
            <TextField
              label
              type="number"
              value={barDefaultQualityalue}
              onChange={setBarDefaultQualityalue}
              autoComplete="off"
            />
          </Box>
          <Button
            variant="plain"
            textAlign="left"
            onClick={() => deleteSection(bundleId, id)}
            icon={DeleteIcon} // pass both
          ></Button>
        </InlineStack>
      </InlineStack>
      {/* {change pre-selectd variant} */}
      <SelectProductModal
        productArray={selectproductInfo}
        onSelect={handleReceiveProduct}
        title="Add variant"
        selectionMode="singleVariant"
        buttonText="Select pre-selected variant"
      />
      {/* { price and title and subtitle} */}
      <InlineGrid columns={2} gap="200">
        <Select
          label="Price"
          options={upsellsOptions}
          onChange={handleUpsellSelectChange}
          value={selected}
        />
        {selected === 'discounted%' && (
          <TextField
            label="Discount per item"
            type="number"
            value={productItemValue}
            onChange={handleChange}
            autoComplete="off"
            min={1}
            max={100}
            suffix="%"
          />
        )}
        {selected === 'discounted$' && (
          <TextField
            label="Discount per item"
            type="number"
            value={productItemValue}
            onChange={handleChange}
            autoComplete="off"
            min={1}
            max={100}
            suffix="USD"
            prefix="$"
          />
        )}
        {selected === 'specific' && (
          <TextField
            label="Total price"
            type="number"
            value={productItemValue}
            onChange={handleChange}
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