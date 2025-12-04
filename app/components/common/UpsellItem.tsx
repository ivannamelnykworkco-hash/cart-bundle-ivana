import { Box, Button, InlineGrid, InlineStack, Select, Text, TextField, Thumbnail } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { SelectProductModal } from "./SelectProductModal";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";
import { useLoaderData } from "@remix-run/react";
import { loader } from "../product/ProductList";

export function UpsellItem({ index, upsellData, deleteId, deleteSection, productArray, onChange }: { index: number, number: any, upsellData: any, deleteId: any, deleteSection: (id: any) => void, productArray: any }) {
  const loaderData = useLoaderData<typeof loader>();
  // const upsellData = JSON.parse(loaderData?.checkboxUpsellConf?.upsellData);
  const upsellItem = upsellData.find(obj => obj.deleteId === deleteId);
  const [selected, setSelected] = useState(upsellItem.selected);
  const [upsellTitle, setUpsellTitle] = useState(upsellItem.upsellTitle);
  const [upsellSubTitle, setUpsellSubTitle] = useState(upsellItem.upsellSubTitle);
  const [value, setValue] = useState(upsellItem.value);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const upsellsOptions = [
    { label: "Default", value: 'default' },
    { label: "Discounted % (e.g, %20 off)", value: 'discounted%' },
    { label: "Discounted $ (e.g, $10 off)", value: 'discounted$' },
    { label: "Specific (e.g, $29)", value: 'specific' }
  ];

  const handleUpsellSelectChange = useCallback(
    (value: string) => setSelected(value),
    [],
  );

  const handleChange = useCallback(
    (newValue: string) => setValue(newValue),
    [],
  );

  const handleReceiveProduct = (value) => {
    setSelectedProduct(value); // get products array from product modal
  };

  const handleRemoveProduct = () => {
    setSelectedProduct(null)
  }

  const upsellItemData = () => ({
    index,
    deleteId,
    selected,
    value,
    upsellTitle,
    upsellSubTitle
  });

  useEffect(() => {
    if (upsellItemData) {
      onChange(index, upsellItemData());
    }
  }, [
    selected,
    value,
    upsellTitle,
    upsellSubTitle,
    deleteId
  ]);


  return (
    <div style={{ borderRadius: "10px", border: '1px solid lightgrey', padding: '15px', gap: "10px", display: 'flex', flexDirection: 'column' }}>
      <InlineStack align="space-between">
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          Upsell # {index + 1}
        </Text>
        <Button variant="plain" textAlign="left" onClick={() => deleteSection(deleteId)}>
          Remove upsell
        </Button>
      </InlineStack>

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
            <Button icon={EditIcon}>Edit image</Button>
            <Button icon={DeleteIcon} onClick={handleRemoveProduct} />
          </InlineStack>
        </InlineGrid>
      )}
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
            value={value}
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
            value={value}
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
            value={value}
            onChange={handleChange}
            autoComplete="off"
            min={1}
            max={100}
            suffix="USD"
            prefix="$"
          />
        )}
      </InlineGrid>
      <InlineGrid columns={2} gap="200">
        <TextField
          label="Title"
          value={upsellTitle}
          onChange={setUpsellTitle}
          autoComplete="off"
        />
        <TextField
          label="Subtitle"
          value={upsellSubTitle}
          onChange={setUpsellSubTitle}
          autoComplete="off"
        />
      </InlineGrid>
    </div>
  )
}