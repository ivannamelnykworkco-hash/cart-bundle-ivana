import { Box, Button, InlineGrid, InlineStack, Select, Text, TextField, Thumbnail } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { SelectProductModal } from "./SelectProductModal";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";
import { useLoaderData } from "@remix-run/react";
import { loader } from "../product/ProductList";

export function UpsellItem({ index, upsellData, deleteId, deleteSection, productArray, onDataAddCheckboxUpsellChange }: { index: number, number: any, onDataAddCheckboxUpsellChange: any, upsellData: any, deleteId: any, deleteSection: (id: any) => void, productArray: any }) {
  const loaderData = useLoaderData<typeof loader>();
  const upsellItem = upsellData.find(obj => obj.deleteId === deleteId);
  const [selected, setSelected] = useState(upsellItem.selected);
  const [upsellTitle, setUpsellTitle] = useState(upsellItem.upsellTitle);
  const [upsellSubTitle, setUpsellSubTitle] = useState(upsellItem.upsellSubTitle);
  const [value, setValue] = useState(upsellItem.value);
  const [selectedProduct, setSelectedProduct] = useState(upsellItem.selectedProduct);




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

  const barAddUpsellDefaultPrice =
    selectedProduct?.[1]?.price ??
    selectedProduct?.variants?.[0]?.price ??
    undefined;

  useEffect(() => {
    const basePrice = Number(barAddUpsellDefaultPrice) || 10;
    const discountValue = Number(value) || 0;
    let finalPrice = basePrice;
    switch (selected) {
      case "discounted%":
        finalPrice = basePrice * (1 - discountValue / 100);
        break;
      case "discounted$":
        finalPrice = basePrice - discountValue;
        break;
      case "specific":
        finalPrice = discountValue;
        break;
      default:
        finalPrice = basePrice;
    }
    finalPrice = Math.max(0, Number(finalPrice) || 0);

    onDataAddCheckboxUpsellChange?.(index, {
      selected,
      value,
      upsellTitle,
      upsellSubTitle,
      selectedProduct: selectedProduct ?? null,
      basePrice,
      finalPrice,
    });
  }, [
    index,
    deleteId,
    selected,
    value,
    upsellTitle,
    upsellSubTitle,
    selectedProduct,
    barAddUpsellDefaultPrice,
    onDataAddCheckboxUpsellChange,
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
          <InlineStack gap="200" align="start" blockAlign="center" direction='row'>
            <Thumbnail
              source={selectedProduct[0].imageUrl}
              alt="Black choker necklace"
            />
            <Text as='h5' fontWeight="bold">{selectedProduct[0].title}</Text>
          </InlineStack>
          <InlineStack gap="200" align="end" blockAlign="center">
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