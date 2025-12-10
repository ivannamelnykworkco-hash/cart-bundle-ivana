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

export function GeneralQuantityBreack({
  bundleId,
  id,
  deleteSection,
  heading,
  open,
  onToggle,
  onAddUpsell,
  onDeleteUpsell,
  onDataObjChange,
  onDataAddUpsellChange,
}) {
  const GeneralQuantityBreakDB = {
    showPriceDecimal: false,
    isShowLowAlert: false,
    opacity: 20,
    sizeValue: 13,
    selected: "default",
    boxUpSells: [],
    title: 'Single',
    subtitle: 'standard price',
    bagdeText: '',
    barLabelText: '',
    badgeSelected: 'simple',
    barDefaultQualityalue: 1,
    discountValue: 20,
  }

  const [showPriceDecimal, setShowPriceDecimal] = useState(GeneralQuantityBreakDB.showPriceDecimal);
  const [isShowLowAlert, setIsShowLowAlert] = useState(GeneralQuantityBreakDB.isShowLowAlert);
  const [opacity, setOpacity] = useState<number>(GeneralQuantityBreakDB.opacity);
  const [sizeValue, setSizeValue] = useState(GeneralQuantityBreakDB.sizeValue);
  const [selected, setSelected] = useState(GeneralQuantityBreakDB.selected);
  const [boxUpSells, setBoxUpSells] = useState(GeneralQuantityBreakDB.boxUpSells);
  // send parent component(choose.tsx) by onDataObjChange
  const [title, setTitle] = useState(GeneralQuantityBreakDB.title);
  const [subtitle, setSubtitle] = useState(GeneralQuantityBreakDB.subtitle);
  const [bagdeText, setBagdeText] = useState(GeneralQuantityBreakDB.bagdeText);
  const [barLabelText, setBarLabelText] = useState(GeneralQuantityBreakDB.barLabelText);
  const [badgeSelected, setBadgeSelected] = useState(GeneralQuantityBreakDB.badgeSelected);
  const [barDefaultQualityalue, setBarDefaultQualityalue] = useState(GeneralQuantityBreakDB.barDefaultQualityalue);
  const [discountValue, setDiscountValue] = useState(GeneralQuantityBreakDB.discountValue);

  useEffect(() => {
    const quantity = Number(barDefaultQualityalue ?? 1);
    const basePrice = 702.45;
    const discountPercent = Number(discountValue ?? 0);

    let base = quantity * basePrice;
    let calc = base;

    if (selected === "discounted%") {
      const safeDiscount = isNaN(discountPercent) ? 0 : discountPercent;
      calc = quantity * basePrice * (1 - safeDiscount / 100);
    } else if (selected === "discounted$") {
      const safeDiscount = isNaN(discountPercent) ? 0 : discountPercent;
      calc = quantity * basePrice - quantity * safeDiscount;
    } else if (selected === "specific") {
      const specific = Number(discountValue);
      calc = isNaN(specific) ? base : specific;
    } else {
      calc = quantity * basePrice;
    }

    if (isNaN(base)) base = 0;
    if (isNaN(calc)) calc = 0;

    const qbObjectData = () => ({
      id,
      title,
      subtitle,
      badgeSelected,
      bagdeText,
      barLabelText,
      barDefaultQualityalue,
      discountValue,
      base: Number(base.toFixed(2)),
      calc: Number(calc.toFixed(2)),
    });

    onDataObjChange?.(id, qbObjectData());
  }, [
    id,
    title,
    subtitle,
    badgeSelected,
    bagdeText,
    barLabelText,
    barDefaultQualityalue,
    discountValue,
    selected,
    onDataObjChange,
  ]);

  const addBoxUpSell = () => {
    const newId = Date.now();
    const newUpsell = { id: newId };

    setBoxUpSells((prev) => [...prev, newUpsell]); // local child state if needed
    onAddUpsell(bundleId, newUpsell); // send bundleId + new upsell to parent
  };

  const deleteBoxUpsell = (bundleIdValue: string | number, upsellId: any) => {
    setBoxUpSells((prev) => prev.filter((item) => item.id !== upsellId));
    onDeleteUpsell(bundleIdValue, upsellId);
  };

  const handleUpsellSelectChange = useCallback((value: string) => {
    setSelected(value);
  }, []);

  const handleSizeChange = useCallback((newValue: string) => {
    setSizeValue(newValue);
  }, []);

  const handleDiscountValueChange = useCallback((value: string) => {
    const numeric = Number(value);
    setDiscountValue(Number.isFinite(numeric) ? numeric : 0);
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

  const QuantityBackground = "#00FF00";
  const handleColorQuantityBackground = (newColor: string) => {
    void newColor; // placeholder for future state
  };

  const QuantityText = "#FF0000";
  const handleColorQuantityText = (newColor: string) => {
    void newColor; // placeholder for future state
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
                    value={String(barDefaultQualityalue ?? "")}
                    onChange={(val) => {
                      const newValue = Number(val);
                      setBarDefaultQualityalue(
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
                  value={selected}
                />
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 5 }}>
                {selected === "discounted%" && (
                  <TextField
                    label="Discount per item"
                    type="number"
                    value={String(discountValue)}
                    onChange={handleDiscountValueChange}
                    autoComplete="off"
                    min={1}
                    max={100}
                    suffix="%"
                  />
                )}

                {selected === "discounted$" && (
                  <TextField
                    label="Discount per item"
                    type="number"
                    value={String(discountValue)}
                    onChange={handleDiscountValueChange}
                    autoComplete="off"
                    min={1}
                    max={100}
                    suffix="USD"
                    prefix="$"
                  />
                )}

                {selected === "specific" && (
                  <TextField
                    label="Total price"
                    type="number"
                    value={String(discountValue)}
                    onChange={handleDiscountValueChange}
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
                  defaultPopText={bagdeText}
                  upPopTextChange={setBagdeText}
                  badgeSelected={badgeSelected}
                />
              </Grid.Cell>

              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 5 }}>
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

            {/* Upsell section */}
            <BlockStack gap="300">
              <Button fullWidth onClick={addBoxUpSell} icon={ProductAddIcon}>
                Add upsell
              </Button>

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
                <SwitchIcon checked={isShowLowAlert} onChange={setIsShowLowAlert} />
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
