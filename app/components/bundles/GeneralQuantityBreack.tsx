import {
  BlockStack,
  Button,
  Card,
  Checkbox,
  Collapsible,
  Divider,
  Grid,
  InlineGrid,
  InlineStack,
  RangeSlider,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { DeleteIcon, DiscountIcon, ProductAddIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "../product/ProductList";
import { PopUpover } from "../common/PopUpover";
import { BoxUpSellItem } from "../common/BoxUpSellItem";
import { SwitchIcon } from "../common/SwitchIcon";
import { ColorPickerPopoverItem } from "../common/ColorPickerPopoverItem";
import type { QuantityBreak, } from "../../models/types";

export function createNewQuantityBreak(): QuantityBreak {
  return {
    id: Math.random().toString(36).substr(2, 9),
    quantity: 1,//quantity
    title: 'Single', //title
    subtitle: 'standard price', //subtitle
    selectPrice: "default", //selectPrice
    discountPrice: 20,//discountprice
    badgeText: '',//badgetext
    badgeStyle: 'simple',//badgestyle
    isSelectedByDefault: false,//isSelectedByDefault
    isShowAsSoldOut: false,//isShowAsSoldOut
    labelText: '',//labelText
    labelTitle: "",//labeltitle
    opacity: 20,//opacity
    bgColor: "#ffffff",
    textColor: "#000000",
    labelSize: 13, //labelSize
  }
}

export function GeneralQuantityBreack({
  barId,
  id,
  deleteSection,
  heading,
  open,
  itemData,
  onToggle,
  onAddUpsell,
  onDeleteUpsell,
  onDataObjChange,
  onDataAddUpsellChange,
}) {

  const [isSelectedByDefault, setIsSelectedByDefault] = useState(itemData.isSelectedByDefault);
  const [isShowAsSoldOut, setIsShowAsSoldOut] = useState(itemData.isShowAsSoldOut);
  const [opacity, setOpacity] = useState<number>(itemData.opacity);
  const [labelSize, setLabelSize] = useState(itemData.labelSize);
  const [selectPrice, setSelectPrice] = useState(itemData.selectPrice);
  const [boxUpsells, setBoxUpsells] = useState(itemData.upsellItems ?? []);
  const [title, setTitle] = useState(itemData.title);
  const [subtitle, setSubtitle] = useState(itemData.subtitle);
  const [badgeText, setBadgeText] = useState(itemData.badgeText);
  const [labelText, setLabelText] = useState(itemData.labelText);
  const [badgeStyle, setBadgeStyle] = useState(itemData.badgeStyle);
  const [quantity, setQuantity] = useState(itemData.quantity);
  const [discountPrice, setDiscountPrice] = useState(itemData.discountPrice);
  const [labelTitle, setLabelTitle] = useState(itemData.labelTitle);
  const [bgColor, setBgColor] = useState(itemData.bgColor);
  const [textColor, setTextColor] = useState(itemData.textColor);

  useEffect(() => {
    const basePrice = 500;
    const discountPercent = Number(discountPrice ?? 0);
    let base = quantity * basePrice;
    let calc = base;
    if (selectPrice === "discounted%") {
      const safeDiscount = isNaN(discountPercent) ? 0 : discountPercent;
      calc = quantity * basePrice * (1 - safeDiscount / 100);
    } else if (selectPrice === "discounted$") {
      const safeDiscount = isNaN(discountPercent) ? 0 : discountPercent;
      calc = quantity * basePrice - quantity * safeDiscount;
    } else if (selectPrice === "specific") {
      const specific = Number(discountPrice);
      calc = isNaN(specific) ? base : specific;
    } else {
      calc = quantity * basePrice;
    }
    if (isNaN(base)) base = 0;
    if (isNaN(calc)) calc = 0;

    const qbObjectData = () => ({
      id,
      quantity,
      title,
      subtitle,
      selectPrice,
      discountPrice,
      badgeText,
      badgeStyle,
      labelText,
      isSelectedByDefault,
      isShowAsSoldOut,
      labelTitle,
      opacity,
      bgColor,
      textColor,
      labelSize,
      upsellItems: boxUpsells,
      base: Number(base.toFixed(2)),
      calc: Number(calc.toFixed(2)),
    });
    onDataObjChange?.(id, qbObjectData());
  }, [
    id,
    quantity,
    title,
    subtitle,
    badgeText,
    badgeStyle,
    selectPrice,
    discountPrice,
    badgeText,
    labelText,
    isSelectedByDefault,
    isShowAsSoldOut,
    labelTitle,
    opacity,
    bgColor,
    textColor,
    boxUpsells,
    onDataObjChange,
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
      base: 10.00,
      calc: 20.00,
      selectPrice: "Discounted % (e.g. 25% off)",
      discountPrice: 20,
      priceText: "+ Add at 20% discount",
      imageSize: 20,
      isSelectedByDefault: false,
      isVisibleOnly: false,
      isShowAsSoldOut: false,
      labelTitle: "labelTitle",
      opacity: 0.5,
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

  const onBoxUpsellDataChange = useCallback(
    (childId: string | number, barId: string | number, data: any) => {
      if (!data) return;

      setBoxUpsells(prev => {
        const updated = Array.isArray(prev)
          ? prev.map(item => (item.id === childId ? { ...item, ...data } : item))
          : [];
        console.log("Updated boxUpsells:"); // log here
        return updated;
      });
    },
    []
  );

  const handleUpsellSelectChange = useCallback((value: string) => {
    setSelectPrice(value);
  }, []);
  const handleSizeChange = useCallback((newValue: string) => {
    setLabelSize(parseInt(newValue, 10));
  }, []);
  const handleDiscountPriceChange = useCallback((value: string) => {
    const numeric = Number(value);
    setDiscountPrice(Number.isFinite(numeric) ? numeric : 0);
  }, []);
  const handleBgColor = (newColor: string) => {
    setBgColor(newColor);
  };
  const handleTextColor = (newColor: string) => {
    setTextColor(newColor);
  };

  const upsellsOptions = [
    { label: "Default", value: "default" },
    { label: "Discounted % (e.g, 25% off)", value: "discounted%" },
    { label: "Discounted $ (e.g, $10 off)", value: "discounted$" },
    { label: "Specific (e.g, $29)", value: "specific" },
  ];

  const badgeStyleOption = [
    { label: "Simple", value: "simple" },
    { label: "Most Popular", value: "mostpopular" },
  ];



  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between">
          <Button
            onClick={onToggle}
            disclosure={open ? "up" : "down"}
            ariaControls="collapsible-settings"
            variant="plain"
            icon={DiscountIcon}
          >
            {heading}
          </Button>

          <InlineStack gap="100">
            {/* 
            <Button icon={SortAscendingIcon} variant="tertiary" accessibilityLabel="Sort up" />
            <Button icon={SortDescendingIcon} variant="tertiary" accessibilityLabel="Sort down" />
            */}
            <Button
              icon={DeleteIcon}
              variant="tertiary"
              accessibilityLabel="Delete quantity break"
              onClick={() => deleteSection(id)}
            />
          </InlineStack>
        </InlineStack>

        <Collapsible open={open} id="collapsible-settings" expandOnPrint>
          <BlockStack gap="300">
            {/* Quantity */}
            <Grid>
              <Grid.Cell columnSpan={{ xs: 4, sm: 2, md: 2 }}>
                <BlockStack gap="150">
                  <Text as="span">Quantity</Text>
                  <TextField
                    label=""
                    type="number"
                    value={String(quantity ?? "")}
                    onChange={(val) => {
                      const newValue = Number(val);
                      setQuantity(
                        Number.isFinite(newValue) ? newValue : 1,
                      );
                    }}
                    autoComplete="off"
                    min={1}
                    max={100}
                  />
                </BlockStack>
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 5 }}>
                <PopUpover
                  title="Title"
                  defaultPopText={title}
                  upPopTextChange={setTitle}
                  badgeSelected=""
                />
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 5 }}>
                <PopUpover
                  title="Subtitle"
                  defaultPopText={subtitle}
                  upPopTextChange={setSubtitle}
                  badgeSelected=""
                />
              </Grid.Cell>
            </Grid>

            {/* Price */}
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 7 }}>
                <Select
                  label="Price"
                  options={upsellsOptions}
                  onChange={handleUpsellSelectChange}
                  value={selectPrice}
                />
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 5 }}>
                {selectPrice === "discounted%" && (
                  <TextField
                    label="Discount per item"
                    type="number"
                    value={String(discountPrice)}
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
                    value={String(discountPrice)}
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
                    value={String(discountPrice)}
                    onChange={handleDiscountPriceChange}
                    autoComplete="off"
                    min={1}
                    max={100}
                    suffix="USD"
                    prefix="$"
                  />
                )}
              </Grid.Cell>
            </Grid>

            {/* Badge text */}
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 7 }}>
                <PopUpover
                  title="Badge text"
                  defaultPopText={badgeText}
                  upPopTextChange={setBadgeText}
                  badgeSelected={badgeStyle}
                />
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 5 }}>
                <BlockStack gap="200">
                  <Text as="span">Badge style</Text>
                  <Select
                    label=""
                    options={badgeStyleOption}
                    onChange={setBadgeStyle}
                    value={badgeStyle}
                  />
                </BlockStack>
              </Grid.Cell>
            </Grid>

            {/* Label */}
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 7 }}>
                <PopUpover
                  title="Label"
                  defaultPopText=""
                  upPopTextChange={setLabelText}
                  badgeSelected={labelText}
                />
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 6, sm: 5, lg: 5 }}>
                <Checkbox
                  label="Selected by default"
                  checked={isSelectedByDefault}
                  onChange={setIsSelectedByDefault}
                />
              </Grid.Cell>
            </Grid>

            {/* Upsell section */}
            <BlockStack gap="300">
              <Button fullWidth onClick={addBoxUpsell} icon={ProductAddIcon}>
                Add upsell
              </Button>

              <BlockStack gap="300">
                {boxUpsells.map((upsellItem) => (
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

            {/* Show as Sold out */}
            <BlockStack gap="300">
              <InlineStack align="space-between">
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Show as Sold out
                </Text>
                <SwitchIcon checked={isShowAsSoldOut} onChange={setIsShowAsSoldOut} />
              </InlineStack>

              {isShowAsSoldOut && (
                <BlockStack gap="300">
                  <PopUpover
                    title="Label title"
                    defaultPopText={labelTitle}
                    upPopTextChange={setLabelTitle}
                    badgeSelected=""
                  />

                  <Grid>
                    <Grid.Cell columnSpan={{ xs: 3, sm: 3, lg: 3 }}>
                      <BlockStack>
                        <Text as="span">Opacity</Text>
                        <RangeSlider
                          value={opacity}
                          onChange={(v: number) => setOpacity(v)}
                          min={0}
                          max={100}
                          output
                          label=""
                        />
                      </BlockStack>
                    </Grid.Cell>

                    <Grid.Cell columnSpan={{ xs: 3, sm: 3, lg: 3 }}>
                      <ColorPickerPopoverItem
                        subtitle="Background"
                        defaultColorSetting={bgColor}
                        colorWidth="100%"
                        onColorChange={handleBgColor}
                      />
                    </Grid.Cell>

                    <Grid.Cell columnSpan={{ xs: 3, sm: 3, lg: 3 }}>
                      <ColorPickerPopoverItem
                        subtitle="Text"
                        defaultColorSetting={textColor}
                        colorWidth="100%"
                        onColorChange={handleTextColor}
                      />
                    </Grid.Cell>

                    <Grid.Cell columnSpan={{ xs: 3, sm: 3, lg: 3 }}>
                      <BlockStack>
                        <Text as="span">Size</Text>
                        <TextField
                          label=""
                          type="number"
                          value={labelSize}
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
      </BlockStack>
    </Card>
  );
}

