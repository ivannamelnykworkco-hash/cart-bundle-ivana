import { Banner, BlockStack, Button, Checkbox, InlineGrid, InlineStack, RadioButton, Select, Text, TextField } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { PopUpover } from "./PopUpover";
import { ImageLoad } from "./ImageLoad";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "../product/ProductList";
export function BoxUpSellItem({ bundleId, id, deleteSection, upBundlesBarUpsellTextChange, upAddUpsellPriceChange, }: { bundleId: any, id: any, upAddUpsellPriceChange: any, upBundlesBarUpsellTextChange: any, deleteSection: (id: any) => void }) {

  const loaderData = useLoaderData<typeof loader>();
  const [selected, setSelected] = useState("default");
  const [imageSizeValue, setImageSizeValue] = useState('10');
  const [visibility, setVisibility] = useState("selectedproduct");
  const [isSelectedDefault, setIsSelectedDefault] = useState(true);
  const [isVisibleSelected, setIsVisibleSelected] = useState(false);

  const [barAddUpsellDefaultPrice, setBarAddUpsellDefaultPrice] = useState(
    (loaderData as any).barAddUpsellDefaultPrice
  );
  const [upsellValue, setUpsellValue] = useState("20");

  useEffect(() => {
    const base = Number(barAddUpsellDefaultPrice) || 0;
    const value = Number(upsellValue) || 0;

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
    if (upAddUpsellPriceChange) {
      upAddUpsellPriceChange(
        bundleId,
        id,
        calculated.toFixed(2),
        base.toFixed(2)
      );
    }
  }, [barAddUpsellDefaultPrice, upsellValue, selected, upAddUpsellPriceChange]);


  const handleChange = useCallback(
    (newValue: string) => {
      setUpsellValue(newValue);
    },
    [],
  );
  const handleImageSizeChange = useCallback(
    (newValue: string) => setImageSizeValue(newValue),
    [],
  );


  const handleUpsellSelectChange = useCallback(
    (value: string) => setSelected(value),
    [],
  );

  const [barUpsellText, setBarUpsellText] = useState('+ Add at 20% discount');

  const handlesBarUpsellTextChange = (v: string) => {
    setBarUpsellText(v);
    upBundlesBarUpsellTextChange(bundleId, id, v);
  };


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
          checked={visibility === "selectedproduct"}
          id="selectedproduct"
          onChange={() => setVisibility("selectedproduct")}
        />
        <RadioButton
          label="Complementary product"
          checked={visibility === "complementaryproduct"}
          id="complementaryproduct"
          onChange={() => setVisibility("complementaryproduct")}
        />
        {visibility === "selectedproduct" && (
          <Button variant="primary">Selecte a product</Button>
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
      <PopUpover title='Text' defaultPopText={barUpsellText} upPopTextChange={handlesBarUpsellTextChange} badgeSelected={""} />

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