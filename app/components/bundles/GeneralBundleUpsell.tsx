import { BlockStack, Box, Button, Card, Checkbox, Collapsible, Divider, Grid, InlineGrid, InlineStack, RangeSlider, Select, Text, TextField, Thumbnail } from "@shopify/polaris";
import { DeleteIcon, ProductIcon, DomainNewIcon, GiftCardIcon, ProductAddIcon, SortAscendingIcon, ImageIcon, SortDescendingIcon, NoteIcon, PlusIcon } from '@shopify/polaris-icons';
import { useCallback, useState, useEffect } from "react";
import { PopUpover } from "../common/PopUpover";
import { BoxUpSellItem } from "../common/BoxUpSellItem";
import { GiftItem } from "../common/GiftItem";
import { SwitchIcon } from "../common/SwitchIcon";
import { ColorPickerPopoverItem } from "../common/ColorPickerPopoverItem";
import type { loader } from "../product/ProductList";
import { useLoaderData } from "@remix-run/react";
import { SelectableImageButton } from "../common/SelectableImageButton";

import { SelectProductModal } from "../common/SelectProductModal";
import { SelectVariantModal } from "../common/SelectVariantModal";
import { BoxProductItem } from "../common/BoxProductItem";

interface BoxUpSells {
  id: number;
}
interface Gifts {
  id: number;
}

export function GeneralBundleUpsell({
  id,
  bundleId,
  deleteSection,
  heading,
  open,
  onToggle,
  upBundlesChooseTitleChange,
  upBundlesChooseSubTitleChange,
  upBunlesBarLabelTextChange,
  upBundlesBadgeTextChange,
  upBundlesBarUpsellTextChange,
  upSelectedProductChange,
  upAddUpsellImageChange,
  upAddProductItemPriceChange,
  onAddUpsell,
  onAddProduct,
  onDeleteUpsell,
  onDeleteProducts,
  upSeletedProduct,
  upAddUpsellPriceChange,
  upPriceChange,
  upBadgeSelectedChange,
  styleOptions,
  selectedStyle,
  onChangeStyle, }:
  {
    id: any,
    bundleId: any,
    deleteSection: any
    heading: any,
    open: any,
    onToggle: any,
    upBundlesChooseTitleChange: any,
    upBundlesChooseSubTitleChange: any,
    upBunlesBarLabelTextChange: any,
    upBundlesBarUpsellTextChange: any,
    upAddProductItemPriceChange: (id: string, price: string, defaultBasePrice?: string) => void,
    onAddUpsell: any,
    onAddProduct: any,
    onDeleteUpsell: any,
    onDeleteProducts: any,
    upSeletedProduct: any,
    upAddUpsellPriceChange: (price: string, defaultBasePrice?: string) => void,
    upPriceChange?: (price: string, defaultBasePrice?: string) => void,
    upBadgeSelectedChange?: (value: string) => void,
    styleOptions: any,
    selectedStyle: any,
    onChangeStyle: any,
  }) {

  const loaderData = useLoaderData<typeof loader>();

  const productArray = loaderData?.products?.map((product: any) => ({
    title: product.title,
    imageUrl: product.imageUrl,
    id: product.id,
    variants: product.variants
  }));
  const [showQuantityChecked, setShowQuantityChecked] = useState(false);
  const [defaultQuantityValue, setDefaultQuantityValue] = useState(1);
  const [showPriceDecimal, setShowPriceDecimal] = useState(false);
  const [isShowLowAlert, setIsShowLowAlert] = useState(false);
  const [barDefaultQualityalue, setBarDefaultQualityalue] = useState<number>(
    (loaderData as any).barDefaultQuality
  );
  // barDefaultPrice can be updated via setBarDefaultPrice, and the useEffect will recalculate the price
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [barDefaultPrice, setBarDefaultPrice] = useState((loaderData as any).barDefaultPrice);
  const [upsellValue, setUpsellValue] = useState('20');
  const [opacity, setOpacity] = useState<number>(20);
  const [sizeValue, setSizeValue] = useState('13');
  const [selected, setSelected] = useState("default");
  const [badgeSelected, setBadgeSelected] = useState("simple");

  const [title, setTitle] = useState((loaderData as any).bundleUpsellTitle || "");
  const handleTitleChange = (v: string) => {
    setTitle(v);
    upBundlesChooseTitleChange(id, v);
  };
  const [subtitle, setSubtitle] = useState((loaderData as any).bundleUpsellSubtitle || "");
  const handleSubtitleChange = (v: string) => {
    setSubtitle(v);
    upBundlesChooseSubTitleChange(id, v);
  };
  const [bagdeText, setBagdeText] = useState((loaderData as any).bundleUpsellBagdeText || "");
  const handleBadgeTextChange = (v: string) => {
    setBagdeText(v);
    upBundlesBadgeTextChange(id, v);
  };
  const [barLabelText, setBarLabelText] = useState((loaderData as any).bunldeUpsellLabelText || "");
  const handlesBarLabelTextChange = (v: string) => {
    setBarLabelText(v);
    upBunlesBarLabelTextChange(id, v);
  };
  const [boxUpSells, setBoxUpSells] = useState<BoxUpSells[]>([]);
  const [gifts, setGifts] = useState<Gifts[]>([]);
  // { add upsellitem and delete}
  const addBoxUpSell = () => {
    const newId = Date.now();
    const newUpsell = { id: newId };

    setBoxUpSells(prev => [...prev, newUpsell]); // local child state if needed
    onAddUpsell(bundleId, newUpsell); // send bundleId + new upsell to parent
  };
  const deleteBoxUpsell = (bundleId: string | number, upsellId: any) => {
    setBoxUpSells(prev => prev.filter(item => item.id !== upsellId)); // remove from child array
    onDeleteUpsell(bundleId, upsellId);
  };
  // add product select button and delete product
  const [products, setProducts] = useState<BoxUpSells[]>([]);
  const addProduct = () => {
    const newId = Date.now();
    const newUpsell = { id: newId };
    setProducts(prev => [...prev, newUpsell]); // local child state if needed
    onAddProduct(bundleId, newUpsell); // send bundleId + new upsell to parent
  };
  const deleteProduct = (bundleId: string | number, upsellId: any) => {
    setProducts(prev => prev.filter(item => item.id !== upsellId)); // remove from child array
    onDeleteProducts(bundleId, upsellId);
  };

  const addGift = () => {
    setGifts(prev => [...prev, { id: Date.now() }])
  }
  const deleteGift = (id: any) => {
    setGifts(prev => prev.filter(item => item.id !== id))
  }
  const handleUpsellSelectChange = useCallback(
    (value: string) => {
      setSelected(value);
    },
    [],
  );
  const handleBadgeSelectChange = useCallback(
    (value: string) => {
      setBadgeSelected(value);
      if (upBadgeSelectedChange) {
        upBadgeSelectedChange(id, value);
      }
    },
    [id, upBadgeSelectedChange],
  );

  // Calculate price based on the formula: barDefaultQualityalue * barDefaultPrice * (1 - upsellValue / 100)
  useEffect(() => {
    const quantity = barDefaultQualityalue;
    const basePrice = parseFloat(barDefaultPrice || "0");
    const discountPercent = parseFloat(upsellValue || "0");

    let calculatedPrice = 0;
    let defaulBasePrice = quantity * basePrice;

    if (selected === 'discounted%') {
      calculatedPrice = quantity * basePrice * (1 - discountPercent / 100);
    } else if (selected === 'discounted$') {
      calculatedPrice = quantity * basePrice - (quantity * discountPercent);
    } else if (selected === 'specific') {
      calculatedPrice = parseFloat(upsellValue || "0");
    } else {
      calculatedPrice = quantity * basePrice;
    }

    if (upPriceChange) {
      upPriceChange(bundleId, calculatedPrice.toFixed(2), defaulBasePrice.toFixed(2));
    }
  }, [barDefaultQualityalue, barDefaultPrice, upsellValue, selected, upPriceChange, bundleId]);

  const handleChange = useCallback(
    (newValue: string) => {
      setUpsellValue(newValue);
    },
    [],
  );

  const handleSizeChange = useCallback(
    (newValue: string) => setSizeValue(newValue),
    [],
  );

  const upsellsOptions = [
    { label: "Default", value: 'default' },
    { label: "Discounted % (e.g, %25 off)", value: 'discounted%' },
    { label: "Discounted $ (e.g, $10 off)", value: 'discounted$' },
    { label: "Specific (e.g, $29)", value: 'specific' }
  ];

  const badgeStyleOption = [
    { label: "Simple", value: 'simple' },
    { label: "Most Popular", value: 'mostpopular' },
  ]

  const QuantityBackground = "#FF0000";
  const handleColorQuantityBackground = (newColor: string) => {
    void newColor; // kept for ColorPickerPopoverItem callback; state not needed here
  };
  const QuantityText = "#FF0000";
  const handleColorQuantityText = (newColor: string) => {
    void newColor; // kept for ColorPickerPopoverItem callback; state not needed here
  };
  const [selectedProduct, setSelectedProduct] = useState({});
  const handleReceiveProduct = (itemId) => (value) => {
    setSelectedProduct(prev => ({
      ...prev,
      [itemId]: value,   // store product for that item
    }));
    upSeletedProduct(bundleId, { [itemId]: value });
  };


  return (
    < Card >
      <BlockStack gap="400">
        <InlineStack align="space-between">
          <Button
            onClick={onToggle}
            disclosure={open ? 'up' : 'down'}
            ariaControls="collapsible-settings"
            variant="plain"
            icon={ProductIcon}
          >
            {heading}
          </Button>
          <InlineStack gap="100">
            {/* <Button icon={SortAscendingIcon} variant="tertiary" accessibilityLabel="Sort up" />
            <Button icon={SortDescendingIcon} variant="tertiary" accessibilityLabel="Sort down" /> */}
            <Button icon={DomainNewIcon} variant="tertiary" accessibilityLabel="Add theme" />
            <Button icon={DeleteIcon} variant="tertiary" accessibilityLabel="Delete theme" onClick={() => deleteSection(bundleId)} />
          </InlineStack>
        </InlineStack>
        <Collapsible
          open={open}
          id="collapsible-settings"
          expandOnPrint
        >

          <BlockStack gap="300">
            <InlineGrid columns={2}>
              {styleOptions.map((opt) => (
                <SelectableImageButton
                  key={opt.id}
                  src={opt.src}
                  selected={selectedStyle === opt.id}
                  onClick={() => onChangeStyle(opt.id)}
                />
              ))}
            </InlineGrid>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6 }}>
                <PopUpover title='Title' defaultPopText={title} upPopTextChange={handleTitleChange} badgeSelected={""} />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6 }}>
                <PopUpover title='Subitle' defaultPopText={subtitle} upPopTextChange={handleSubtitleChange} badgeSelected={""} />
              </Grid.Cell>
            </Grid>
            {/* {Badge text} */}
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 6 }}>
                <PopUpover title='Badge text' defaultPopText={bagdeText} upPopTextChange={handleBadgeTextChange} badgeSelected={badgeSelected} />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 6 }}>
                <BlockStack gap='200'>
                  <Text as='span'>
                    Badge style
                  </Text>
                  <Select
                    label=""
                    options={badgeStyleOption}
                    onChange={handleBadgeSelectChange}
                    value={badgeSelected}
                  />
                </BlockStack>
              </Grid.Cell>
            </Grid>

            {/* {Label} */}
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 7 }}>
                <PopUpover title='Label' defaultPopText='' upPopTextChange={handlesBarLabelTextChange} badgeSelected={barLabelText} />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 5, lg: 5 }}>
                <Checkbox
                  label="Selected by default"
                  checked={showPriceDecimal}
                  onChange={setShowPriceDecimal}
                />
              </Grid.Cell>
            </Grid>
            <Checkbox
              label="Show quantity selector"
              checked={showQuantityChecked}
              onChange={setShowQuantityChecked}
            />

            <Divider />

            {/* { default product && add product} */}
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <InlineStack align="center" blockAlign="center" gap='200'>
                  <Thumbnail source={NoteIcon} size="small" alt="Small document" />
                  <Text as="span" fontWeight="bold">Default product</Text>
                </InlineStack>
                <Box width='20%'>
                  <TextField
                    label
                    type="number"
                    value={String(defaultQuantityValue)}
                    onChange={(value: string) => setDefaultQuantityValue(Number(value))}
                    autoComplete="off"
                  />
                </Box>
              </InlineStack>

              {/* {Price} */}
              <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 6 }}>
                  <Select
                    label="Price"
                    options={upsellsOptions}
                    onChange={handleUpsellSelectChange}
                    value={selected}
                  />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 6 }}>
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
                </Grid.Cell>
              </Grid>
            </BlockStack>

            <Divider />

            {products.map((item) => (
              <BlockStack key={item.id}>
                <SelectProductModal
                  productArray={productArray}
                  onSelect={handleReceiveProduct(item.id)}
                  title="Select products"
                  selectionMode="nestedProduct"
                  buttonText='Select a product'
                />
                {selectedProduct[item.id] && (
                  <Box>
                    <BoxProductItem
                      id={item.id}
                      key={item.id}
                      bundleId={bundleId}
                      upBundlesBarUpsellTextChange={upBundlesBarUpsellTextChange}
                      upAddProductItemPriceChange={upAddProductItemPriceChange}
                      deleteSection={deleteProduct}
                      selectproductInfo={selectedProduct[item.id]}
                    />
                  </Box>
                )}
              </BlockStack>
            ))}
            <Divider />
            <Button icon={PlusIcon} onClick={addProduct}>Add product</Button>
            <Divider />
            {/* {three button} */}
            <BlockStack gap="300">
              <InlineGrid columns={3} gap='200'>
                <Button icon={ImageIcon} >Add theme</Button>
                <Button onClick={addBoxUpSell} icon={ProductAddIcon}>Add upsell</Button>
                {/* <Button onClick={addGift} icon={GiftCardIcon} >Add theme</Button> */}
              </InlineGrid>
              <BlockStack gap="300">
                {/* {Add upsell} */}
                {boxUpSells.map((item) => (
                  <BoxUpSellItem id={item.id} key={item.id}
                    bundleId={bundleId}
                    upBundlesBarUpsellTextChange={upBundlesBarUpsellTextChange}
                    upAddUpsellPriceChange={upAddUpsellPriceChange}
                    upSelectedProductChange={upSelectedProductChange}
                    upAddUpsellImageChange={upAddUpsellImageChange}
                    deleteSection={deleteBoxUpsell} />
                ))}
              </BlockStack>
              <BlockStack gap="300">
                {/* {Add upsell} */}
                {gifts.map((item) => (
                  <GiftItem key={item.id} deleteId={item.id} deleteSection={deleteGift} />
                ))}
              </BlockStack>
            </BlockStack>
            <Divider />
            {/* {Show as Sold out} */}
            <BlockStack gap="300">
              <InlineStack align="space-between">
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Show as Sold out
                </Text>
                <SwitchIcon checked={isShowLowAlert} onChange={setIsShowLowAlert} />
              </InlineStack>
              {isShowLowAlert && (
                <BlockStack gap="300">
                  <PopUpover title='Label title' defaultPopText='Sold out' upPopTextChange={undefined} badgeSelected={""} />
                  <Grid>
                    <Grid.Cell columnSpan={{ xs: 3, sm: 3, lg: 3 }}>
                      <BlockStack>
                        <Text as='span'>
                          Opacity

                        </Text>
                        <RangeSlider
                          value={opacity}
                          onChange={(v: number) => setOpacity(v)}
                          min={0}
                          max={100}
                          output
                          label
                        />
                      </BlockStack>
                    </Grid.Cell>

                    <Grid.Cell columnSpan={{ xs: 3, sm: 3, lg: 3 }}>
                      <ColorPickerPopoverItem subtitle='Background' defaultColorSetting={QuantityBackground} colorWidth="100%" onColorChange={handleColorQuantityBackground} />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 3, sm: 3, lg: 3 }}>
                      <ColorPickerPopoverItem subtitle='Text' defaultColorSetting={QuantityText} colorWidth="100%" onColorChange={handleColorQuantityText} />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 3, sm: 3, lg: 3 }}>
                      <BlockStack>
                        <Text as="span">
                          Size
                        </Text>
                        <TextField
                          label
                          type="number"
                          value={sizeValue}
                          onChange={handleSizeChange}
                          autoComplete="off"
                          min={10}
                          max={50}
                          suffix="px"
                        />
                      </BlockStack>
                    </Grid.Cell>
                  </Grid>
                </BlockStack>
              )}
            </BlockStack>
          </BlockStack>
        </Collapsible>
      </BlockStack >
    </Card >
  )
}

