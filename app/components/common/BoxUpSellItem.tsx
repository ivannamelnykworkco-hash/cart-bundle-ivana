import { Banner, BlockStack, Box, Button, Checkbox, InlineGrid, InlineStack, RadioButton, Select, Text, TextField, Thumbnail } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { PopUpover } from "./PopUpover";
import { ImageLoad } from "./ImageLoad";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "../product/ProductList";
import { SelectProductModal } from "./SelectProductModal";
import { DeleteIcon } from '@shopify/polaris-icons';
export function BoxUpSellItem({ bundleId, id, deleteSection, upBundlesBarUpsellTextChange, upAddUpsellPriceChange, upSelectedProductChange, upAddUpsellImageChange }: { bundleId: any, id: any, upAddUpsellPriceChange: any, upAddUpsellImageChange: any, upBundlesBarUpsellTextChange: any, deleteSection: any, upSelectedProductChange: any }) {

  const loaderData = useLoaderData<typeof loader>();
  const [selected, setSelected] = useState("default");
  const [imageSizeValue, setImageSizeValue] = useState<any>(50);
  const [visibility, setVisibility] = useState("upsellSelectedproduct");
  const [isSelectedDefault, setIsSelectedDefault] = useState(true);
  const [isVisibleSelected, setIsVisibleSelected] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const productArray = loaderData?.products?.map((product: any) => ({
    title: product.title,
    imageUrl: product.imageUrl,
    id: product.id,
    variants: product.variants
  }));

  const [upsellValue, setUpsellValue] = useState("20");
  const barAddUpsellDefaultPrice = selectedProduct?.[1]?.price;
  useEffect(() => {
    const base = Number(barAddUpsellDefaultPrice) || 10;
    const quantity = Number(upsellProductQuantitValue);
    const basePrice = base * quantity;
    const value = Number(upsellValue) || 0;

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
    setSelectedProduct(null)
  }

  const upsellsOptions = [
    { label: "Default", value: 'default' },
    { label: "Discounted % (e.g, %20 off)", value: 'discounted%' },
    { label: "Discounted $ (e.g, $10 off)", value: 'discounted$' },
    { label: "Specific (e.g, $29)", value: 'specific' }
  ];
  return (
    <div style={{ borderRadius: "10px", border: '1px solid lightgrey', padding: '15px', gap: "10px", display: 'flex', flexDirection: 'column' }}>
      <InlineStack align="space-between">
        <Text as="p" variant="bodyMd" fontWeight="semibold">
          Upsell
        </Text>
        <Button
          variant="plain"
          textAlign="left"
          onClick={() => deleteSection(bundleId, id)} // pass both
        >
          Remove upsell
        </Button>
      </InlineStack>

      {/* { select product} */}
      <BlockStack gap="100">
        <RadioButton
          label="Selected Product"
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
              <SelectProductModal productArray={productArray} onSelect={handleReceiveProduct} title="Select a product" selectionMode="nestedProduct" buttonText='Select a product' />
            )}
            {selectedProduct && (
              <InlineGrid columns={2}>
                <InlineStack gap="200" align="start" blockAlign="center">
                  <Thumbnail
                    source={selectedProduct[0].imageUrl}
                    alt="Black choker necklace"
                  />
                  <Text as='h5' fontWeight="bold">{selectedProduct[0].title}</Text>
                </InlineStack>
                <InlineStack gap="200" align="end" blockAlign="center">
                  <Box width="60px">
                    <TextField
                      label
                      type="number"
                      min={0}
                      max={100}
                      value={upsellProductQuantitValue}
                      onChange={setUpsellProductQuantitValue}
                      autoComplete="off" />
                  </Box>
                  <Button icon={DeleteIcon} onClick={handleRemoveProduct} />
                </InlineStack>
              </InlineGrid>
            )}
          </>
        )
        }
        {
          visibility === "complementaryproduct" && (
            <BlockStack gap="200">
              <Banner
                tone="info"
              >
                <BlockStack gap="200">
                  <p>Set complementary products in Shopify Search & Discovery app.</p>
                  <InlineGrid columns={2}>
                    <Button>Open Search && Discovery</Button>
                  </InlineGrid>
                </BlockStack>
              </Banner>
            </BlockStack>

          )
        }

        {
          visibility === "specific" && (
            <Button variant="primary" fullWidth>Select products</Button>
          )
        }

        {
          visibility === "collections" && (
            <Button variant="primary" fullWidth>Select collections</Button>
          )
        }
      </BlockStack>
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
            value={upsellValue}
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
            value={upsellValue}
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
            value={upsellValue}
            onChange={handleChange}
            autoComplete="off"
            min={1}
            max={100}
            suffix="USD"
            prefix="$"
          />
        )}
      </InlineGrid>
      {/* {Text} */}
      <PopUpover title='Text' defaultPopText={barUpsellText} upPopTextChange={handlesBarUpsellTextChange} badgeSelected={""} dataArray={undefined} />

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
          max={70}
          suffix="px"
        />
      </InlineGrid>

      {/* {checkbox} */}
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

  )
}