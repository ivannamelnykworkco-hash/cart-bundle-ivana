import {
  Banner,
  BlockStack,
  Box,
  Button,
  Checkbox,
  InlineGrid,
  InlineStack,
  RadioButton,
  Select,
  Text,
  TextField,
  Thumbnail,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { DeleteIcon } from "@shopify/polaris-icons";

import type { loader } from "../product/ProductList";
import { PopUpover } from "./PopUpover";
import { SelectProductModal } from "./SelectProductModal";
import { DeleteIcon } from '@shopify/polaris-icons';
export function BoxUpSellItem({ bundleId, id, deleteSection, upBundlesBarUpsellTextChange, upAddUpsellPriceChange, upSelectedProductChange, upAddUpsellImageChange }: { bundleId: any, id: any, upAddUpsellPriceChange: any, upAddUpsellImageChange: any, upBundlesBarUpsellTextChange: any, deleteSection: any, upSelectedProductChange: any }) {

  const loaderData = useLoaderData<typeof loader>();

  const BoxUpsellDB = {
    selected: 'default',
    imageSizeValue: 40,
    visibility: 'upsellSelectedproduct',
    isSelectedDefault: true,
    isVisibleSelected: false,
    selectedProduct: null,
    barUpsellText: '+ Add at 20% discount',
    upsellProductQuantitValue: 1,
    upsellValue: 20,
  }

  const [selected, setSelected] = useState(BoxUpsellDB.selected);
  const [imageSizeValue, setImageSizeValue] = useState(BoxUpsellDB.imageSizeValue);
  const [visibility, setVisibility] = useState(BoxUpsellDB.visibility);
  const [isSelectedDefault, setIsSelectedDefault] = useState(BoxUpsellDB.isSelectedDefault);
  const [isVisibleSelected, setIsVisibleSelected] = useState(BoxUpsellDB.isVisibleSelected);
  const [selectedProduct, setSelectedProduct] = useState(BoxUpsellDB.selectedProduct);
  const [barUpsellText, setBarUpsellText] = useState(BoxUpsellDB.barUpsellText);
  const [upsellProductQuantitValue, setUpsellProductQuantitValue] = useState(BoxUpsellDB.upsellProductQuantitValue);
  const [upsellValue, setUpsellValue] = useState(BoxUpsellDB.upsellValue);

  const productArray =
    loaderData?.products?.map((product: any) => ({
      title: product.title,
      imageUrl: product.imageUrl,
      id: product.id,
      variants: product.variants,
    })) ?? [];

  // price of first variant of the selected product
  const barAddUpsellDefaultPrice =
    selectedProduct?.[0]?.variants?.[0]?.price ??
    selectedProduct?.variants?.[0]?.price ??
    undefined;

  useEffect(() => {
    const basePerUnitRaw = Number(barAddUpsellDefaultPrice);
    const basePerUnit = Number.isFinite(basePerUnitRaw) ? basePerUnitRaw : 10;

    const quantityRaw = Number(upsellProductQuantitValue);
    const quantity = Number.isFinite(quantityRaw) && quantityRaw > 0 ? quantityRaw : 1;

    const valueRaw = Number(upsellValue);
    const value = Number.isFinite(valueRaw) ? valueRaw : 0;

    let basePrice = basePerUnit * quantity;
    if (!Number.isFinite(basePrice)) basePrice = 0;

    let calculated = basePrice;

    if (selected === "discounted%") {
      calculated = basePrice * (1 - value / 100);
    } else if (selected === "discounted$") {
      calculated = basePrice - value * quantity;
    } else if (selected === "specific") {
      calculated = value * quantity;
    }

    if (calculated < 0) calculated = 0;

    // IMPORTANT → Add upsell.id here
    if (upAddUpsellPriceChange) {
      upAddUpsellPriceChange(
        bundleId,
        id,
        calculated.toFixed(2),
        basePrice.toFixed(2)
      );
    }
  }, [barAddUpsellDefaultPrice, upsellValue, selected, upAddUpsellPriceChange, bundleId, id]);


  const handleChange = useCallback(
    (newValue: string) => {
      setUpsellValue(newValue);
    },
    [],
  );
  const handleImageSizeChange = (v: any) => {
    setImageSizeValue(v);
    upAddUpsellImageChange(bundleId, id, v);
  }

  const handleUpsellSelectChange = useCallback(
    (value: string) => setSelected(value),
    [],
  );

  const [barUpsellText, setBarUpsellText] = useState('+ Add at 20% discount');
  const [upsellProductQuantitValue, setUpsellProductQuantitValue] = useState<any>(1);

  const handlesBarUpsellTextChange = (v: string) => {
    setBarUpsellText(v);
    upBundlesBarUpsellTextChange(bundleId, id, v);
  };
  const handleReceiveProduct = (value: string) => {
    setSelectedProduct(value);
    upSelectedProductChange(bundleId, id, value); // get products array from product modal
  };
  const handleRemoveProduct = () => {
    setSelectedProduct(null);
  };

  const handleImageSizeChange = useCallback((value: string) => {
    setImageSizeValue(value);
  }, []);

  const handleQuantityChange = useCallback((value: string) => {
    setUpsellProductQuantitValue(value);
  }, []);

  const handleUpsellValueChange = useCallback((value: string) => {
    setUpsellValue(value);
  }, []);

  const upsellsOptions = [
    { label: "Default", value: "default" },
    { label: "Discounted % (e.g, 20% off)", value: "discounted%" },
    { label: "Discounted $ (e.g, $10 off)", value: "discounted$" },
    { label: "Specific (e.g, $29)", value: "specific" },
  ];

  return (
    <div
      style={{
        borderRadius: "10px",
        border: "1px solid lightgrey",
        padding: "15px",
        gap: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <InlineStack align="space-between">
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          Upsell
        </Text>
        <Button
          variant="plain"
          textAlign="left"
          onClick={() => deleteSection(bundleId, id)}
        >
          Remove upsell
        </Button>
      </InlineStack>

      {/* Select product */}
      <BlockStack gap="100">
        <RadioButton
          label="Selected product"
          checked={visibility === "upsellSelectedproduct"}
          id="upsellSelectedproduct"
          onChange={() => setVisibility("upsellSelectedproduct")}
        />
        <RadioButton
          label="Complementary product"
          checked={visibility === "complementaryproduct"}
          id="complementaryproduct"
          onChange={() => setVisibility("complementaryproduct")}
        />

        {visibility === "upsellSelectedproduct" && (
          <>
            {!selectedProduct && (
              <SelectProductModal
                productArray={productArray}
                onSelect={setSelectedProduct}
                title="Select a product"
                selectionMode="nestedProduct"
                buttonText="Select a product"
              />
            )}

            {selectedProduct && (
              <InlineGrid columns={2}>
                <InlineStack gap="200" align="start" blockAlign="center">
                  <Thumbnail
                    source={selectedProduct?.[0]?.imageUrl}
                    alt={selectedProduct?.[0]?.title ?? "Selected product"}
                  />
                  <Text as="h5" fontWeight="bold">
                    {selectedProduct?.[0]?.title ?? ""}
                  </Text>
                </InlineStack>

                <InlineStack gap="200" align="end" blockAlign="center">
                  <Box width="60px">
                    <TextField
                      label=""
                      type="number"
                      min={0}
                      max={100}
                      value={upsellProductQuantitValue}
                      onChange={handleQuantityChange}
                      autoComplete="off"
                    />
                  </Box>
                  <Button icon={DeleteIcon} onClick={handleRemoveProduct} />
                </InlineStack>
              </InlineGrid>
            )}
          </>
        )}

        {visibility === "complementaryproduct" && (
          <BlockStack gap="200">
            <Banner tone="info">
              <BlockStack gap="200">
                <span>
                  Set complementary products in the Shopify Search &amp; Discovery app.
                </span>
                <InlineGrid columns={2}>
                  <Button>Open Search &amp; Discovery</Button>
                </InlineGrid>
              </BlockStack>
            </Banner>
          </BlockStack>
        )}

        {visibility === "specific" && (
          <Button variant="primary" fullWidth>
            Select products
          </Button>
        )}

        {visibility === "collections" && (
          <Button variant="primary" fullWidth>
            Select collections
          </Button>
        )}
      </BlockStack>

      {/* Price + type */}
      <InlineGrid columns={2} gap="200">
        <Select
          label="Price"
          options={upsellsOptions}
          onChange={handleUpsellSelectChange}
          value={selected}
        />

        {selected === "discounted%" && (
          <TextField
            label="Discount per item"
            type="number"
            value={upsellValue}
            onChange={handleUpsellValueChange}
            autoComplete="off"
            min={1}
            max={100}
            suffix="%"
          />
        )}

        {selected === "discounted$" && (
          <TextField
            label="Discount per item"
            type="number"
            value={upsellValue}
            onChange={handleUpsellValueChange}
            autoComplete="off"
            min={1}
            max={100}
            suffix="USD"
            prefix="$"
          />
        )}

        {selected === "specific" && (
          <TextField
            label="Total price"
            type="number"
            value={upsellValue}
            onChange={handleUpsellValueChange}
            autoComplete="off"
            min={1}
            max={100}
            suffix="USD"
            prefix="$"
          />
        )}
      </InlineGrid>

      {/* Text */}
      <PopUpover
        title="Text"
        defaultPopText={barUpsellText}
        upPopTextChange={setBarUpsellText}
        badgeSelected=""
        dataArray={undefined}
      />

      {/* Image size */}
      <TextField
        label="Image size"
        type="number"
        value={imageSizeValue}
        onChange={handleImageSizeChange}
        autoComplete="off"
        min={1}
        max={70}
        suffix="px"
      />

      {/* Checkboxes */}
      <InlineStack gap="200">
        <Checkbox
          label="Selected by default"
          checked={isSelectedDefault}
          onChange={setIsSelectedDefault}
        />
        <Checkbox
          label="Visible only when bar is selected"
          checked={isVisibleSelected}
          onChange={setIsVisibleSelected}
        />
      </InlineStack>
    </div>
  );
}
