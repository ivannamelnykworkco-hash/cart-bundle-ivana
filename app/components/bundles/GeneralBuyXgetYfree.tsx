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

export function GeneralBuyXgetYfree({
  id,
  bundleId,
  deleteSection,
  open,
  onToggle,
  heading,
  onAddUpsell,
  onDeleteUpsell,
  onDataObjChange,
  onDataAddUpsellChange,
}) {

  const GeneralBuyXgetYfreeDB = {
    showPriceDecimal: false,
    isShowLowAlert: false,
    buyQualityalue: 3,
    getQualityalue: 1,
    opacity: 20,
    sizeValue: 13,
    selected: 'default',
    badgeSelected: 'simple',
    title: '',
    subtitle: '',
    bagdeText: '',
    barLabelText: '',
    boxUpSells: [],
  }

  const [showPriceDecimal, setShowPriceDecimal] = useState(GeneralBuyXgetYfreeDB.showPriceDecimal);
  const [isShowLowAlert, setIsShowLowAlert] = useState(GeneralBuyXgetYfreeDB.isShowLowAlert);
  const [buyQualityalue, setBuyQualityalue] = useState(GeneralBuyXgetYfreeDB.buyQualityalue);
  const [getQualityalue, setGetQualityalue] = useState(GeneralBuyXgetYfreeDB.getQualityalue);
  const [opacity, setOpacity] = useState(GeneralBuyXgetYfreeDB.opacity);
  const [sizeValue, setSizeValue] = useState(GeneralBuyXgetYfreeDB.sizeValue);
  const [selected, setSelected] = useState(GeneralBuyXgetYfreeDB.selected);
  const [badgeSelected, setBadgeSelected] = useState(GeneralBuyXgetYfreeDB.badgeSelected);
  const [title, setTitle] = useState(GeneralBuyXgetYfreeDB.title);
  const [subtitle, setSubtitle] = useState(GeneralBuyXgetYfreeDB.subtitle);
  const [bagdeText, setBagdeText] = useState(GeneralBuyXgetYfreeDB.bagdeText);
  const [barLabelText, setBarLabelText] = useState(GeneralBuyXgetYfreeDB.barLabelText);
  const [boxUpSells, setBoxUpSells] = useState(GeneralBuyXgetYfreeDB.boxUpSells);

  const barDefaultPrice = 204.32;

  useEffect(() => {
    const bQuantity = buyQualityalue;
    const gQuantity = getQualityalue;
    const tQuantity = bQuantity + gQuantity;
    const basePrice = barDefaultPrice;

    const base = tQuantity * basePrice;
    const calc = bQuantity * basePrice;

    const xyObjectData = () => ({
      id,
      title,
      subtitle,
      badgeSelected,
      bagdeText,
      barLabelText,
      buyQualityalue,
      getQualityalue,
      base: Number(base.toFixed(2)),
      calc: Number(calc.toFixed(2)),
    });

    onDataObjChange?.(id, xyObjectData());
  }, [
    id,
    title,
    subtitle,
    badgeSelected,
    bagdeText,
    barLabelText,
    buyQualityalue,
    getQualityalue,
    onDataObjChange,
  ]);

  // add / delete upsell items
  const addBoxUpSell = () => {
    const newId = Date.now();
    const newUpsell = { id: newId };

    setBoxUpSells((prev) => [...prev, newUpsell]);
    onAddUpsell(bundleId, newUpsell);
  };

  const deleteBoxUpsell = (bundleIdValue: string | number, upsellId: any) => {
    setBoxUpSells((prev) => prev.filter((item) => item.id !== upsellId));
    onDeleteUpsell(bundleIdValue, upsellId);
  };

  const handleSizeChange = useCallback((newValue: string) => {
    setSizeValue(newValue);
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

  const QuantityBackground = "#FF0000";
  const handleColorQuantityBackground = (newColor: string) => {
    void newColor;
  };

  const QuantityText = "#FF0000";
  const handleColorQuantityText = (newColor: string) => {
    void newColor;
  };

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
                    value={String(buyQualityalue)}
                    onChange={(val) => {
                      const newValue = Number(val);
                      setBuyQualityalue(
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
                    value={String(getQualityalue)}
                    onChange={(val) => {
                      const newValue = Number(val);
                      setGetQualityalue(
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
                  defaultPopText={bagdeText}
                  upPopTextChange={setBagdeText}
                  badgeSelected={badgeSelected}
                />
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 6 }}>
                <BlockStack gap="200">
                  <Text as="span">Badge style</Text>
                  <Select
                    label=""
                    options={badgeStyleOption}
                    onChange={setBadgeSelected}
                    value={badgeSelected}
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
                  upPopTextChange={setBarLabelText}
                  badgeSelected={barLabelText}
                />
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 6, sm: 5, lg: 5 }}>
                <Checkbox
                  label="Selected by default"
                  checked={showPriceDecimal}
                  onChange={setShowPriceDecimal}
                />
              </Grid.Cell>
            </Grid>

            {/* Upsells */}
            <BlockStack gap="300">
              <InlineGrid columns={1} gap="200">
                <Button onClick={addBoxUpSell} icon={ProductAddIcon}>
                  Add upsell
                </Button>
              </InlineGrid>

              <BlockStack gap="300">
                {boxUpSells.map((upsellItem) => (
                  <BoxUpSellItem
                    key={upsellItem.id}
                    id={upsellItem.id}
                    bundleId={bundleId}
                    deleteSection={deleteBoxUpsell}
                    onDataAddUpsellChange={onDataAddUpsellChange}
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
                  checked={isShowLowAlert}
                  onChange={setIsShowLowAlert}
                />
              </InlineStack>

              {isShowLowAlert && (
                <BlockStack gap="300">
                  <PopUpover
                    title="Label title"
                    defaultPopText="Sold out"
                    upPopTextChange={undefined}
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
                        defaultColorSetting={QuantityBackground}
                        colorWidth="100%"
                        onColorChange={handleColorQuantityBackground}
                      />
                    </Grid.Cell>

                    <Grid.Cell columnSpan={{ xs: 3, sm: 3, lg: 3 }}>
                      <ColorPickerPopoverItem
                        subtitle="Text"
                        defaultColorSetting={QuantityText}
                        colorWidth="100%"
                        onColorChange={handleColorQuantityText}
                      />
                    </Grid.Cell>

                    <Grid.Cell columnSpan={{ xs: 3, sm: 3, lg: 3 }}>
                      <BlockStack>
                        <Text as="span">Size</Text>
                        <TextField
                          label=""
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
      </BlockStack>
    </Card>
  );
}
