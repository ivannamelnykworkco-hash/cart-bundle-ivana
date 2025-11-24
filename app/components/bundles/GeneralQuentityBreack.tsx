import { BlockStack, Button, Card, Checkbox, Collapsible, Divider, Grid, InlineGrid, InlineStack, RangeSlider, Select, Text, TextField } from "@shopify/polaris";
import { DeleteIcon, DiscountIcon, DomainNewIcon, GiftCardIcon, ProductAddIcon, SortAscendingIcon, ImageIcon, SortDescendingIcon } from '@shopify/polaris-icons';
import { useCallback, useState, useEffect } from "react";
import { PopUpover } from "../common/PopUpover";
import { BoxUpSellItem } from "../common/BoxUpSellItem";
import { GiftItem } from "../common/GiftItem";
import { SwitchIcon } from "../common/SwitchIcon";
import { ColorPickerPopoverItem } from "../common/ColorPickerPopoverItem";
import type { loader } from "../product/ProductList";
import { useLoaderData } from "@remix-run/react";

interface BoxUpSells {
  id: number;
}
interface Gifts {
  id: number;
}


export function GeneralQuentityBreack({
  id,
  deleteId,
  deleteSection,
  heading,
  upBundlesChooseTitleChange,
  upBundlesChooseSubTitleChange,
  upBunlesBarLabelTextChange,
  upBundlesBadgeTextChange,
  upBundlesBarUpsellTextChange,
  onAddUpsell,
  onDeleteUpsell,
  upAddUpsellPriceChange,
  upPriceChange,
  upBadgeSelectedChange }:
  {
    id: any,
    deleteId: any,
    deleteSection: any
    heading: any,
    upBundlesChooseTitleChange: any,
    upBundlesChooseSubTitleChange: any,
    upBundlesBadgeTextChange: any,
    upBunlesBarLabelTextChange: any,
    upBundlesBarUpsellTextChange: any,
    onAddUpsell: any,
    onDeleteUpsell: any,
    upAddUpsellPriceChange: (price: string, defaultBasePrice?: string) => void,
    upPriceChange?: (price: string, defaultBasePrice?: string) => void, upBadgeSelectedChange?: (value: string) => void
  }) {

  const loaderData = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false);
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

  const [title, setTitle] = useState((loaderData as any).barTitle || "");

  const handleTitleChange = (v: string) => {
    setTitle(v);
    upBundlesChooseTitleChange(v);
  };

  const [subtitle, setSubtitle] = useState((loaderData as any).barSubTitle || "");

  const handleSubtitleChange = (v: string) => {
    setSubtitle(v);
    upBundlesChooseSubTitleChange(v);
  };
  const [bagdeText, setBagdeText] = useState((loaderData as any).bagdeText || "");

  const handleBadgeTextChange = (v: string) => {
    setBagdeText(v);
    upBundlesBadgeTextChange(v);
  };
  const [barLabelText, setBarLabelText] = useState((loaderData as any).barLabelText || "");

  const handlesBarLabelTextChange = (v: string) => {
    setBarLabelText(v);
    upBunlesBarLabelTextChange(v);
  };



  const [boxUpSells, setBoxUpSells] = useState<BoxUpSells[]>([]);
  const [gifts, setGifts] = useState<Gifts[]>([]);

  // { add upsellitem and delete}
  const addBoxUpSell = () => {
    setBoxUpSells(prev => [...prev, { id: Date.now() }])
    onAddUpsell({ id: Date.now() });
  }
  const deleteBoxUpsell = (id: any) => {
    setBoxUpSells(prev => prev.filter(item => item.id !== id))
    onDeleteUpsell(id);
  }
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
        upBadgeSelectedChange(value);
      }
    },
    [upBadgeSelectedChange],
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
      upPriceChange(calculatedPrice.toFixed(2), defaulBasePrice.toFixed(2));
    }
  }, [barDefaultQualityalue, barDefaultPrice, upsellValue, selected, upPriceChange]);

  const handleChange = useCallback(
    (newValue: string) => {
      setUpsellValue(newValue);
    },
    [],
  );

  const handleSettingsToggle = useCallback((

  ) => setOpen((open) => !open),
    []);
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

  const QuantityBackground = {
    hue: 0,
    saturation: 0,
    brightness: 0,
    alpha: 1,
  };
  const handleColorQuantityBackground = (newColor: string) => {
    void newColor; // kept for ColorPickerPopoverItem callback; state not needed here
  };
  const QuantityText = {
    hue: 0,
    saturation: 0,
    brightness: 1,
    alpha: 1,
  };
  const handleColorQuantityText = (newColor: string) => {
    void newColor; // kept for ColorPickerPopoverItem callback; state not needed here
  };
  return (
    < Card >
      <BlockStack gap="400">
        <InlineStack align="space-between">
          <Button
            onClick={handleSettingsToggle}
            disclosure={open ? 'up' : 'down'}
            ariaControls="collapsible-settings"
            variant="plain"
            icon={DiscountIcon}
          >
            {heading}
          </Button>
          <InlineStack gap="100">
            <Button icon={SortAscendingIcon} variant="tertiary" accessibilityLabel="Sort up" />
            <Button icon={SortDescendingIcon} variant="tertiary" accessibilityLabel="Sort down" />
            <Button icon={DomainNewIcon} variant="tertiary" accessibilityLabel="Add theme" />
            <Button icon={DeleteIcon} variant="tertiary" accessibilityLabel="Delete theme" onClick={() => deleteSection(deleteId)} />
          </InlineStack>
        </InlineStack>
        <Collapsible
          open={open}
          id="collapsible-settings"
          expandOnPrint
        >

          <BlockStack gap="300">
            {/* {Quanlity */}
            <Grid>
              <Grid.Cell columnSpan={{ xs: 4, sm: 2, md: 2 }}>
                <BlockStack gap="150">
                  <Text as="span">Quanlity</Text>
                  <TextField
                    label
                    type="number"
                    value={String(barDefaultQualityalue)}
                    onChange={(val) => {
                      const newValue = Number(val);
                      setBarDefaultQualityalue(newValue);
                    }}
                    autoComplete="off"
                    min={1}
                    max={100}
                  />
                </BlockStack>
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 5 }}>
                <PopUpover title='Title' defaultPopText={title} upPopTextChange={handleTitleChange} badgeSelected={""} />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 5 }}>
                <PopUpover title='Subitle' defaultPopText={subtitle} upPopTextChange={handleSubtitleChange} badgeSelected={""} />
              </Grid.Cell>
            </Grid>
            {/* {Price} */}
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
            {/* {Badge text} */}
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 7 }}>
                <PopUpover title='Badge text' defaultPopText={bagdeText} upPopTextChange={handleBadgeTextChange} badgeSelected={badgeSelected} />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, lg: 5 }}>
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
            {/* {three button} */}
            <BlockStack gap="300">
              <InlineGrid columns={3} gap='200'>
                <Button icon={ImageIcon} >Add theme</Button>
                <Button onClick={addBoxUpSell} icon={ProductAddIcon}>Add upsell</Button>
                <Button onClick={addGift} icon={GiftCardIcon} >Add theme</Button>
              </InlineGrid>
              <BlockStack gap="300">
                {/* {Add upsell} */}
                {boxUpSells.map((item) => (
                  <BoxUpSellItem id={item.id} key={item.id} upBundlesBarUpsellTextChange={upBundlesBarUpsellTextChange} upAddUpsellPriceChange={upAddUpsellPriceChange} deleteId={item.id} deleteSection={deleteBoxUpsell} />
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
                <Text as="p" variant="bodyMd" fontWeight="semibold">
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

