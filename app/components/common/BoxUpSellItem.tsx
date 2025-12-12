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

interface BoxUpSellItemProps {
  id: string;
  upsellItemData: object;
  barId: number | string;
  deleteSection: (barId: number | string, upsellId: number | string) => void;
  onDataAddUpsellChange?: (
    id: number | string,
    barId: number | string,
    data: any,
  ) => void;
}

export function BoxUpSellItem({
  id,
  upsellItemData,
  barId,
  deleteSection,
  onDataAddUpsellChange,
}: BoxUpSellItemProps) {
  const loaderData = useLoaderData<typeof loader>();
  const [selectPrice, setSelectPrice] = useState(upsellItemData.selectPrice);
  const [imageSize, setImageSize] = useState(upsellItemData.imageSize);
  const [isSelectedProduct, setIsSelectedProduct] = useState(upsellItemData.isSelectedProduct);
  const [isSelectedByDefault, setIsSelectedByDefault] = useState(upsellItemData.isSelectedByDefault);
  const [isVisibleOnly, setIsVisibleOnly] = useState(upsellItemData.isVisibleOnly);
  const [selectedProduct, setSelectedProduct] = useState(upsellItemData.selectedProduct);
  const [priceText, setPriceText] = useState(upsellItemData.priceText);
  const [quantity, setQuantity] = useState(upsellItemData.quantity);
  const [discountPrice, setDiscountPrice] = useState(upsellItemData.discountPrice);
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
    const valueRaw = Number(discountPrice);
    const value = Number.isFinite(valueRaw) ? valueRaw : 0;
    let basePrice = basePerUnit * quantity;
    if (!Number.isFinite(basePrice)) basePrice = 0;
    let calculated = basePrice;

    if (selectPrice === "discounted%") {
      calculated = basePrice * (1 - value / 100);
    } else if (selectPrice === "discounted$") {
      calculated = basePrice - value * quantity;
    } else if (selectPrice === "specific") {
      calculated = value * quantity;
    }
    if (!Number.isFinite(calculated) || calculated < 0) {
      calculated = 0;
    }

    onDataAddUpsellChange?.(id, barId, {
      quantity,
      discountPrice,
      priceText,
      selectedProduct,
      isVisibleOnly,
      imageSize,
      selectPrice,
      isSelectedByDefault,
      isSelectedProduct,
      calc: Number(calculated.toFixed(2)),
      base: Number(basePrice.toFixed(2)),
    });
  }, [
    barId,
    priceText,
    selectedProduct,
    isVisibleOnly,
    imageSize,
    selectPrice,
    isSelectedProduct,
    barAddUpsellDefaultPrice,
    isSelectedByDefault,
    discountPrice,
    quantity,
    onDataAddUpsellChange,
  ]);

  const handleUpsellSelectChange = useCallback((value: string) => {
    setSelectPrice(value as any);
  }, []);

  const handleRemoveProduct = () => {
    setSelectedProduct(null);
  };

  const handleImageSizeChange = useCallback((value: string) => {
    setImageSize(value);
  }, []);

  const handleQuantityChange = useCallback((value: string) => {
    setQuantity(value);
  }, []);

  const handleDiscountPriceChange = useCallback((value: string) => {
    setDiscountPrice(value);
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
          onClick={() => deleteSection(barId, id)}
        >
          Remove upsell
        </Button>
      </InlineStack>

      {/* Select product */}
      <BlockStack gap="100">
        <RadioButton
          label="Selected product"
          checked={isSelectedProduct === "upsellSelectedproduct"}
          id="upsellSelectedproduct"
          onChange={() => setIsSelectedProduct("upsellSelectedproduct")}
        />
        <RadioButton
          label="Complementary product"
          checked={isSelectedProduct === "complementaryproduct"}
          id="complementaryproduct"
          onChange={() => setIsSelectedProduct("complementaryproduct")}
        />

        {isSelectedProduct === "upsellSelectedproduct" && (
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
                      value={quantity}
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

        {isSelectedProduct === "complementaryproduct" && (
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
      </BlockStack>

      {/* Price + type */}
      <InlineGrid columns={2} gap="200">
        <Select
          label="Price"
          options={upsellsOptions}
          onChange={handleUpsellSelectChange}
          value={selectPrice}
        />

        {selectPrice === "discounted%" && (
          <TextField
            label="Discount per item"
            type="number"
            value={discountPrice}
            onChange={handleDiscountPriceChange}
            autoComplete="off"
            min={1}
            max={100}
            suffix="%"
          />
        )}

        {selectPrice === "discounted$" && (
          <TextField
            label="Discount per item"
            type="number"
            value={discountPrice}
            onChange={handleDiscountPriceChange}
            autoComplete="off"
            min={1}
            max={100}
            suffix="USD"
            prefix="$"
          />
        )}

        {selectPrice === "specific" && (
          <TextField
            label="Total price"
            type="number"
            value={discountPrice}
            onChange={handleDiscountPriceChange}
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
        defaultPopText={priceText}
        upPopTextChange={setPriceText}
        badgeSelected=""
        dataArray={undefined}
      />

      {/* Image size */}
      <TextField
        label="Image size"
        type="number"
        value={imageSize}
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
          checked={isSelectedByDefault}
          onChange={setIsSelectedByDefault}
        />
        <Checkbox
          label="Visible only when bar is selected"
          checked={isVisibleOnly}
          onChange={setIsVisibleOnly}
        />
      </InlineStack>
    </div>
  );
}
