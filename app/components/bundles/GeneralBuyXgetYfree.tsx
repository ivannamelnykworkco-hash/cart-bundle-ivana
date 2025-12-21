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
  Tooltip,
} from "@shopify/polaris";
import {
  DeleteIcon,
  MegaphoneIcon,
  ProductAddIcon,
} from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "../product/ProductList";
import { PopUpover } from "../common/PopUpover";
import { BoxUpSellItem } from "../common/BoxUpSellItem";
import { SwitchIcon } from "../common/SwitchIcon";
import { ColorPickerPopoverItem } from "../common/ColorPickerPopoverItem";
import type { BuyXGetY, } from "../../models/types";

export function createNewBuyXGetY(): BuyXGetY {
  return {
    id: Math.random().toString(36).substr(2, 9),
    buyQuantity: 3,
    getQuantity: 1,
    title: 'Buy 3 Get Y', //title
    subtitle: 'bogo', //subtitle
    badgeText: '',//badgetext
    badgeStyle: 'simple',//badgestyle
    isSelectedByDefault: false,//isSelectedByDefault
    isShowAsSoldOut: false,//isShowAsSoldOut
    labelText: '',//labelText
    labelTitle: "",//labeltitle
    opacity: 20,//opacity
    bgColor: "#eeeeee",
    textColor: "#222222",
    labelSize: 13, //labelSize
  }
}

export function GeneralBuyXgetYfree({
  id,
  barId,
  bundleId,
  open,
  itemData,
  onToggle,
  heading,
  onAddUpsell,
  onDeleteUpsell,
  onDataObjChange,
  deleteSection
}) {

  const GeneralBuyXgetYfreeDB = {
    isSelectedByDefault: false,//isSelectedByDefault
    isShowAsSoldOut: false,//isShowAsSoldOut
    buyQuantity: 3,//buyQuantity
    getQuantity: 1,//getQuantity
    opacity: 20,//opacity
    labelSize: 13,//labelSize
    selected: 'default',
    badgeStyle: 'simple',//badgeStyle
    title: '',//
    subtitle: '',//
    badgeText: '',//badgeText
    labelText: '',//labelText
    labelTitle: "",//
    bgColor: "#eeeeee",
    textColor: "#222222",
    boxUpsells: [],
  }
  const [isSelectedByDefault, setIsSelectedByDefault] = useState(itemData.isSelectedByDefault);
  const [isShowAsSoldOut, setIsShowAsSoldOut] = useState(itemData.isShowAsSoldOut);
  const [buyQuantity, setBuyQuantity] = useState(itemData.buyQuantity);
  const [getQuantity, setGetQuantity] = useState(itemData.getQuantity);
  const [opacity, setOpacity] = useState(itemData.opacity);
  const [labelSize, setLabelSize] = useState(itemData.labelSize);
  const [selected, setSelected] = useState(itemData.selected);
  const [badgeStyle, setBadgeStyle] = useState(itemData.badgeStyle);
  const [title, setTitle] = useState(itemData.title);
  const [subtitle, setSubtitle] = useState(itemData.subtitle);
  const [badgeText, setBadgeText] = useState(itemData.badgeText);
  const [labelText, setLabelText] = useState(itemData.labelText);
  const [labelTitle, setLabelTitle] = useState(itemData.labelTitle);
  const [boxUpsells, setBoxUpsells] = useState(itemData?.upsellItems ?? []);
  const [bgColor, setBgColor] = useState(itemData.bgColor);
  const [textColor, setTextColor] = useState(itemData.textColor);

  const barDefaultPrice = 204.32;

  useEffect(() => {
    const bQuantity = buyQuantity;
    const gQuantity = getQuantity;
    const tQuantity = bQuantity + gQuantity;
    const basePrice = barDefaultPrice;
    const base = tQuantity * basePrice;
    const calc = bQuantity * basePrice;

    const xyObjectData = () => ({
      id,
      bundleId,
      buyQuantity,
      getQuantity,
      title,
      subtitle,
      badgeText,
      badgeStyle,
      isSelectedByDefault,
      isShowAsSoldOut,
      labelText,
      labelTitle,
      opacity,
      bgColor,
      textColor,
      labelSize,
      upsellItems: boxUpsells,
      base: Number(base.toFixed(2)),
      calc: Number(calc.toFixed(2)),
    });
    onDataObjChange?.(id, xyObjectData());
  }, [
    buyQuantity,
    getQuantity,
    title,
    subtitle,
    badgeText,
    badgeStyle,
    isSelectedByDefault,
    isShowAsSoldOut,
    labelText,
    labelTitle,
    opacity,
    bgColor,
    textColor,
    labelSize,
    boxUpsells,
    onDataObjChange,
  ]);

  useEffect(() => {
    return () => {
      // cleanup: tell parent to remove this child
      onDataObjChange?.(id, null);
    };
  }, []);
  // add / delete upsell items
  const addBoxUpsell = useCallback(() => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newUpsell = {
      id: newId,
      bxGyId: id,
      isSelectedProduct: "upsellSelectedproduct",
      selectedVariants: "[]",
      selectedProduct: "[]",
      base: 10.00,
      calc: 20.00,
      selectPrice: "Specific (e.g. $29)",
      discountPrice: 20,
      priceText: "+ Add at 20% discount",
      imageSize: 40,
      isSelectedByDefault: false,
      isVisibleOnly: false,
      isShowAsSoldOut: false,
      labelTitle: "labelTitle",
      opacity: 0.5,
      bgColor: "#FF0000",
      textColor: "#00FF00",
      labelSize: 15,
    };
    setBoxUpsells((prev) => [...prev, newUpsell]);
    onAddUpsell?.(barId, newUpsell);
  }, [onAddUpsell]);

  // Delete upsell
  const deleteBoxUpsell = useCallback((barId, upsellId) => {
    setBoxUpsells(prev => prev.filter(item => item.id !== upsellId));
    onDeleteUpsell?.(barId, upsellId);
  }, [onDeleteUpsell]);

  const onBoxUpsellDataChange = useCallback((childId, childBarId, data) => {
    setBoxUpsells(prev =>
      prev.map(item =>
        item.id === childId
          ? { ...item, ...data }
          : item
      )
    );

  }, []);

  const handleSizeChange = useCallback((newValue: string) => {
    setLabelSize(newValue);
  }, []);

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
            icon={MegaphoneIcon}
          >
            {heading}
          </Button>

          <InlineStack gap="100">
            <Button
              icon={DeleteIcon}
              variant="tertiary"
              accessibilityLabel="Delete bar"
              onClick={() => deleteSection(id)}
            />
          </InlineStack>
        </InlineStack>

        <Collapsible open={open} id="collapsible-settings" expandOnPrint>
          <BlockStack gap="300">
            {/* Buy / Get quantities */}
            <Grid>
              <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 3 }}>
                <InlineStack
                  gap="200"
                  align="end"
                  blockAlign="end"
                  wrap={false}
                >
                  <Text as="h6" fontWeight="bold">
                    Buy
                  </Text>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={String(buyQuantity)}
                    onChange={(val) => {
                      const newValue = Number(val);
                      setBuyQuantity(
                        Number.isFinite(newValue) ? newValue : 1,
                      );
                    }}
                    autoComplete="off"
                    min={1}
                    max={100}
                  />
                </InlineStack>
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 3 }}>
                <InlineStack
                  gap="200"
                  align="end"
                  blockAlign="end"
                  wrap={false}
                >
                  <Text as="h6" fontWeight="bold">
                    , Get
                  </Text>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={String(getQuantity)}
                    onChange={(val) => {
                      const newValue = Number(val);
                      setGetQuantity(
                        Number.isFinite(newValue) ? newValue : 1,
                      );
                    }}
                    autoComplete="off"
                    min={1}
                    max={100}
                  />
                </InlineStack>
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6 }}>
                <InlineStack
                  gap="300"
                  align="end"
                  blockAlign="end"
                  wrap={false}
                >
                  <Text as="h6" fontWeight="bold">
                    free!
                  </Text>
                  <div style={{ width: "100%" }}>
                    <Tooltip content="You can't set the price for Buy X, Get Y free bar as the discount is auto applied based on quantities set. For volume discount please scroll down, click Add bar and select Quantity break.">
                      <Select
                        label="Price"
                        options={upsellsOptions}
                        onChange={setSelected}
                        value={selected}
                        disabled
                      />
                    </Tooltip>
                  </div>
                </InlineStack>
              </Grid.Cell>
            </Grid>

            {/* Title and subtitle */}
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6 }}>
                <PopUpover
                  title="Title"
                  defaultPopText={title}
                  upPopTextChange={setTitle}
                  badgeSelected=""
                />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6 }}>
                <PopUpover
                  title="Subtitle"
                  defaultPopText={subtitle}
                  upPopTextChange={setSubtitle}
                  badgeSelected=""
                />
              </Grid.Cell>
            </Grid>

            {/* Badge text */}
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 6 }}>
                <PopUpover
                  title="Badge text"
                  defaultPopText={badgeText}
                  upPopTextChange={setBadgeText}
                  badgeSelected={badgeStyle}
                />
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 6 }}>
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

              </Grid.Cell>
            </Grid>

            {/* Upsells */}
            <BlockStack gap="300">
              <InlineGrid columns={1} gap="200">
                <Button onClick={addBoxUpsell} icon={ProductAddIcon}>
                  Add upsell
                </Button>
              </InlineGrid>

              <BlockStack gap="300">
                {boxUpsells.map((upsellItem) => (
                  <BoxUpSellItem
                    key={upsellItem.id}
                    id={upsellItem.id}
                    barId={barId}
                    upsellItemData={upsellItem}
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
                <SwitchIcon
                  checked={isShowAsSoldOut}
                  onChange={setIsShowAsSoldOut}
                />
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
                        onColorChange={setBgColor}
                      />
                    </Grid.Cell>

                    <Grid.Cell columnSpan={{ xs: 3, sm: 3, lg: 3 }}>
                      <ColorPickerPopoverItem
                        subtitle="Text"
                        defaultColorSetting={textColor}
                        colorWidth="100%"
                        onColorChange={setTextColor}
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
