import { Box, Button, InlineGrid, InlineStack, Select, Text, TextField, Thumbnail } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { SelectProductModal } from "./SelectProductModal";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";
export function UpsellItem({ number, deleteId, deleteSection, productArray }: { number: any, deleteId: any, deleteSection: (id: any) => void, productArray: any }) {

  const [selected, setSelected] = useState("default");
  const [upsellTitle, setUpsellTitle] = useState("{{product}}");
  const [upsellSubTitle, setUpsellSubTitle] = useState("Save {{saved_amount}}!");
  const [value, setValue] = useState('20');
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

  console.log("selectedProduct==>", selectedProduct);
  return (
    <div style={{ borderRadius: "10px", border: '1px solid lightgrey', padding: '15px', gap: "10px", display: 'flex', flexDirection: 'column' }}>
      <InlineStack align="space-between">
        <Text as="p" variant="bodyMd" fontWeight="semibold">
          Upsell # {number}
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