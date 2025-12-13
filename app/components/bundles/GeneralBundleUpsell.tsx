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
import type { BundleUpsell } from "../../models/types";

export function createNewBundleUpsell(): BundleUpsell {
  return {
    id: Math.random().toString(36).substr(2, 9),
    layoutOption: "",
    title: 'Single', //title
    subtitle: 'standard price', //subtitle
    badgeText: '',//badgetext
    badgeStyle: 'simple',//badgestyle
    labelText: '',//labelText
    isSelectedByDefault: false,//isSelectedByDefault
    isShowQuantitySelector: false,
    productCounts: 1,
    selectPrice: "Disocounted %",
    discountPrice: 20,
    isShowAsSoldOut: false,//isShowAsSoldOut
    labelTitle: "",//labeltitle
    opacity: 20,//opacity
    bgColor: "#ffffff",
    textColor: "#000000",
    labelSize: 13, //labelSize
  }
}

export function GeneralBundleUpsell({
  id,//
  bundleId,//
  deleteSection,
  heading,//
  open,//
  onToggle,//
  onAddUpsell,//
  onAddProduct,
  onDeleteUpsell,//
  onDeleteProducts,//
  upSeletedProduct,//
  upBadgeSelectedChange,
  styleOptions,
  selectedStyle,
  onChangeStyle,
  onDataObjChange,//
  onDataAddUpsellChange,
  onDataAddProductItemChange }) {

  const initData = {
    layoutOption: "",
    title: 'Single', //title
    subtitle: 'standard price', //subtitle
    badgeText: '',//bagdeText
    badgeStyle: 'simple',//badgeSelected
    labelText: '',//barLabelText
    isSelectedByDefault: false,//
    isShowQuantitySelector: false,//showQuantityChecked
    productCounts: 1,//barDefaultQualityalue
    selectPrice: "Disocounted %",//selected
    discountPrice: 20,//discountValue
    isShowAsSoldOut: false,//isShowLowAlert
    labelTitle: "",//
    opacity: 20,//*
    bgColor: "#ffffff",
    textColor: "#000000",
    labelSize: 13, //sizeValue
    boxUpsells: [],
    productItems: []
  }

  const loaderData = useLoaderData<typeof loader>();

  const productArray = loaderData?.products?.map((product: any) => ({
    title: product.title,
    imageUrl: product.imageUrl,
    id: product.id,
    variants: product.variants
  }));
  const [isShowQuantitySelector, setIsShowQuantitySelector] = useState(false);
  const [productCounts, setProductCounts] = useState(1);
  const [isSelectedByDefault, setIsSelectedByDefault] = useState(false);
  const [isShowAsSoldOut, setIsShowAsSoldOut] = useState(false);

  // barDefaultPrice can be updated via setBarDefaultPrice, and the useEffect will recalculate the price
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [discountPrice, setDiscountPrice] = useState('20');//
  const [opacity, setOpacity] = useState<number>(20);//
  const [labelSize, setLabelSize] = useState('13');//
  const [selectPrice, setSelectPrice] = useState("default");//
  const [badgeSelected, setBadgeSelected] = useState("simple");//
  const [title, setTitle] = useState((loaderData as any).bundleUpsellTitle || "");//
  const [subtitle, setSubtitle] = useState((loaderData as any).bundleUpsellSubtitle || "");//
  const [bagdeText, setBagdeText] = useState((loaderData as any).bundleUpsellBagdeText || "");//
  const [labelText, setLabelText] = useState((loaderData as any).bunldeUpsellLabelText || "");
  const [boxUpSells, setBoxUpSells] = useState<BoxUpSells[]>([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const barDefaultPrice = selectedProduct;

  // { add upsellitem and delete}
  const addBoxUpSell = () => {
    const newId = Date.now();
    const newUpsell = { id: newId };

    setBoxUpSells(prev => [...prev, newUpsell]); // local child state if needed
    onAddUpsell(bundleId, newUpsell); // send bundleId + new upsell to parent
  };
  const deleteBoxUpsell = (barId: string | number, upsellId: any) => {
    setBoxUpSells(prev => prev.filter(item => item.id !== upsellId)); // remove from child array
    onDeleteUpsell(barId, upsellId);
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

  useEffect(() => {
    const quantity = productCounts;
    const basePrice = parseFloat(barDefaultPrice || "0");
    const discountPercent = parseFloat(discountPrice || "0");

    let calc = 0;
    let base = quantity * basePrice;

    if (selectPrice === 'discounted%') {
      calc = quantity * basePrice * (1 - discountPercent / 100);
    } else if (selectPrice === 'discounted$') {
      calc = quantity * basePrice - (quantity * discountPercent);
    } else if (selectPrice === 'specific') {
      calc = parseFloat(discountPrice || "0");
    } else {
      calc = quantity * basePrice;
    }

    const buObjectData = () => ({
      id,
      title,
      subtitle,
      badgeSelected,
      bagdeText,
      labelText,
      productCounts,
      selectedProduct,
      base: Number(base.toFixed(2)),
      calc: Number(calc.toFixed(2)),

    })
    onDataObjChange(id, buObjectData());
  }, [
    id,
    title,
    subtitle,
    badgeSelected,
    bagdeText,
    productCounts,
    labelText,
    selectedProduct,
    onDataObjChange
  ]);


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
                <PopUpover title='Title' defaultPopText={title} upPopTextChange={setTitle} badgeSelected={""} />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6 }}>
                <PopUpover title='Subitle' defaultPopText={subtitle} upPopTextChange={setSubtitle} badgeSelected={""} />
              </Grid.Cell>
            </Grid>
            {/* {Badge text} */}
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 6 }}>
                <PopUpover title='Badge text' defaultPopText={bagdeText} upPopTextChange={setBagdeText} badgeSelected={badgeSelected} />
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
                <PopUpover title='Label' defaultPopText='' upPopTextChange={setLabelText} badgeSelected={labelText} />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 5, lg: 5 }}>
                <Checkbox
                  label="Selected by default"
                  checked={isSelectedByDefault}
                  onChange={setIsSelectedByDefault}
                />
              </Grid.Cell>
            </Grid>
            <Checkbox
              label="Show quantity selector"
              checked={isShowQuantitySelector}
              onChange={setIsShowQuantitySelector}
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
                    value={String(productCounts)}
                    onChange={(value: string) => setProductCounts(Number(value))}
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
                    value={selectPrice}
                  />
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 6 }}>
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
                      selectproductInfo={selectedProduct[item.id]}
                      deleteSection={deleteProduct}
                      onDataAddProductItemChange={onDataAddProductItemChange}
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
              <Button onClick={addBoxUpSell} icon={ProductAddIcon}>Add upsell</Button>
              <BlockStack gap="300">
                {/* {Add upsell} */}
                {boxUpSells.map((item) => (
                  <BoxUpSellItem
                    key={item.id}
                    id={item.id}
                    bundleId={bundleId} // important
                    deleteSection={deleteBoxUpsell}
                    onDataAddUpsellChange={onDataAddUpsellChange}
                  />
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
                <SwitchIcon checked={isShowAsSoldOut} onChange={setIsShowAsSoldOut} />
              </InlineStack>
              {isShowAsSoldOut && (
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
                          value={labelSize}
                          onChange={setLabelSize}
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

