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

function safeJsonParse(value) {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

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
    selectPrice: "default",
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
  barId,//
  bundleId,
  deleteSection,
  heading,//
  open,//
  itemData,
  onToggle,//
  defaultVariant,
  onAddUpsell,//
  onAddProduct,
  onDeleteUpsell,//
  onDeleteProducts,//
  styleOptions,
  selectedStyle,
  onChangeStyle,
  onDataObjChange,//
  upBadgeStyleChange,
  onDataAddUpsellChange,
  onDataAddProductItemChange }) {

  const loaderData = useLoaderData<typeof loader>();
  const productArray = loaderData?.products?.map((product: any) => ({
    title: product.title,
    imageUrl: product.imageUrl,
    id: product.id,
    variants: product.variants
  }));

  const [isShowQuantitySelector, setIsShowQuantitySelector] = useState(itemData.isShowQuantitySelector ?? false);
  const [productCounts, setProductCounts] = useState(itemData.productCounts ?? 1);
  const [isSelectedByDefault, setIsSelectedByDefault] = useState(itemData.isSelectedByDefault ?? false);
  const [isShowAsSoldOut, setIsShowAsSoldOut] = useState(itemData.isShowAsSoldOut ?? false);
  const [discountPrice, setDiscountPrice] = useState(itemData.discountPrice ?? 20);//
  const [opacity, setOpacity] = useState(itemData.opacity ?? 100);//
  const [labelSize, setLabelSize] = useState(itemData.labelSize ?? 12);//
  const [selectPrice, setSelectPrice] = useState(itemData.selectPrice ?? "");//
  const [badgeStyle, setBadgeStyle] = useState(itemData.badgeStyle ?? "");//
  const [title, setTitle] = useState(itemData.title ?? "");//
  const [subtitle, setSubtitle] = useState(itemData.subtitle || "");//
  const [badgeText, setBadgeText] = useState(itemData.badgeText || "");//
  const [labelText, setLabelText] = useState(itemData.labelText || "");
  const [labelTitle, setLabelTitle] = useState(itemData.labelTitle || "");
  const [boxUpsells, setBoxUpsells] = useState(itemData.upsellItems ?? []);
  const [products, setProducts] = useState(itemData.productItems ?? []);
  const [bgColor, setBgColor] = useState(itemData.bgColor);
  const [textColor, setTextColor] = useState(itemData.textColor);
  // const [defaultVariant, setDefaultVariant] = useState(safeJsonParse(loaderData?.generalSettingConf?.setDefaultVariant));
  const parsedDefaultVariant = safeJsonParse(defaultVariant);
  const [selectedProduct, setSelectedProduct] = useState(() => {
    const initialState = {};
    itemData.productItems?.forEach(item => {
      if (item.selectedProduct) {
        initialState[item.id] = item.selectedProduct;
      }
    });
    return initialState;
  });

  const barDefaultPrice = selectedProduct;

  // { add upsellitem and delete}

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
      bundleId,
      layoutOption: "",
      title,
      subtitle,
      badgeText,
      badgeStyle,
      labelText,
      isSelectedByDefault,
      isShowQuantitySelector,
      productCounts,
      selectPrice,
      discountPrice,
      isShowAsSoldOut,
      labelTitle,
      opacity,
      bgColor,
      textColor,
      upsellItems: boxUpsells,
      productItems: products,
      base: Number(base.toFixed(2)),
      calc: Number(calc.toFixed(2)),

    })
    onDataObjChange(id, buObjectData());
  }, [
    id,
    title,
    subtitle,
    badgeText,
    badgeStyle,
    labelText,
    isSelectedByDefault,
    defaultVariant,
    isShowQuantitySelector,
    productCounts,
    selectPrice,
    discountPrice,
    isShowAsSoldOut,
    labelTitle,
    opacity,
    bgColor,
    textColor,
    boxUpsells,
    products,
    onDataObjChange
  ]);

  useEffect(() => {
    return () => {
      // cleanup: tell parent to remove this child
      onDataObjChange?.(id, null);
    };
  }, []);

  const addBoxUpsell = useCallback(() => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newUpsell = {
      id: newId,
      qbId: id,
      isSelectedProduct: "upsellSelectedproduct",
      selectedVariants: "",
      selectedProduct: "",
      selectPrice: "Specific (e.g. $29)",
      discountPrice: 20,
      priceText: "+ Add at 20% discount",
      imageSize: 20,
      isSelectedByDefault: false,
      isVisibleOnly: false,
      isShowAsSoldOut: false,
      labelTitle: "labelTitle",
      opacity: 50,
      bgColor: "#FF0000",
      textColor: "#00FF00",
      labelSize: 15,
    };
    setBoxUpsells(prev => [...prev, newUpsell]);
    onAddUpsell?.(barId, newUpsell);
  }, [onAddUpsell]);

  // Delete upsell
  const deleteBoxUpsell = useCallback((barId, upsellId) => {
    setBoxUpsells(prev => prev.filter(item => item.id !== upsellId));
    onDeleteUpsell?.(barId, upsellId);
  }, [onDeleteUpsell]);
  // Send Upselldata Change
  const onBoxUpsellDataChange = useCallback((childId, childBarId, data) => {
    setBoxUpsells(prev =>
      prev.map(item =>
        item.id === childId
          ? { ...item, ...data }
          : item
      )
    );
    console.log("bundleupsell", data);
  }, []);

  // add product select button and delete product
  const addProduct = useCallback(() => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newProduct = {
      id: newId,
      buId: id,
      quantity: 1,
      selectPrice: "Discounted % (e.g. 25% off)",
      discountPrice: 20,
      selectedVariants: "",
      selectedProduct: ""
    };
    setProducts(prev => [...prev, newProduct]); // local child state if needed
    onAddProduct?.(barId, newProduct); // send barId + new upsell to parent
  }, [onAddProduct]);

  const deleteProduct = useCallback((barId, productId) => {
    setProducts(prev => prev.filter(item => item.id !== productId));
    onDeleteProducts?.(barId, productId);
  }, [onDeleteProducts]);

  const onProductDataChange = useCallback((childId, childBarId, data) => {
    setProducts(prev =>
      prev.map(item =>
        item.id === childId
          ? { ...item, ...data }
          : item
      )
    );
  }, []);

  const handleUpsellSelectChange = useCallback(
    (value: string) => {
      setSelectPrice(value);
    },
    [],
  );
  const handleBadgeSelectChange = useCallback(
    (value: string) => {
      setBadgeStyle(value);
      if (upBadgeStyleChange) {
        upBadgeStyleChange(id, value);
      }
    },
    [id, upBadgeStyleChange],
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

  const handleReceiveProduct = (itemId) => (value) => {
    setSelectedProduct(prev => ({
      ...prev,
      [itemId]: value,
    }));

    // upSeletedProduct(barId, { [itemId]: value });
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
            <Button icon={DeleteIcon} variant="tertiary" accessibilityLabel="Delete theme" onClick={() => deleteSection(barId)} />
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
                <PopUpover title='Badge text' defaultPopText={badgeText} upPopTextChange={setBadgeText} badgeSelected={badgeStyle} />
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
                    value={badgeStyle}
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
                  <Thumbnail
                    source={parsedDefaultVariant?.imageUrl ?? NoteIcon}
                    size="small"
                    alt={parsedDefaultVariant?.title ?? "Default product"}
                  />
                  <Text as="span" fontWeight="bold">{parsedDefaultVariant?.title ?? "Default "}</Text>
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
                      barId={barId}
                      productItemData={item}
                      selectedProduct={selectedProduct[item.id]}
                      deleteSection={deleteProduct}
                      onDataAddProductItemChange={onProductDataChange}
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
              <Button onClick={addBoxUpsell} icon={ProductAddIcon}>Add upsell</Button>
              <BlockStack gap="300">
                {/* {Add upsell} */}
                {boxUpsells?.map((upsellItem) => (
                  <BoxUpSellItem
                    key={upsellItem.id}
                    id={upsellItem.id}
                    upsellItemData={upsellItem}
                    barId={barId}
                    deleteSection={deleteBoxUpsell}
                    onDataAddUpsellChange={onBoxUpsellDataChange}
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
                  <PopUpover title='Label title' defaultPopText={labelTitle} upPopTextChange={setLabelTitle} badgeSelected={""} />
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
                      <ColorPickerPopoverItem subtitle='Background' defaultColorSetting={bgColor} colorWidth="100%" onColorChange={setBgColor} />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 3, sm: 3, lg: 3 }}>
                      <ColorPickerPopoverItem subtitle='Text' defaultColorSetting={textColor} colorWidth="100%" onColorChange={setTextColor} />
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

