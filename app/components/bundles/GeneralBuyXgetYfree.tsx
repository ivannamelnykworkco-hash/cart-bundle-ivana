import { BlockStack, Button, Card, Checkbox, Collapsible, Divider, Grid, InlineGrid, InlineStack, RangeSlider, Select, Text, TextField, Tooltip } from "@shopify/polaris";
import { DeleteIcon, MegaphoneIcon, DomainNewIcon, GiftCardIcon, ProductAddIcon, SortAscendingIcon, ImageIcon, SortDescendingIcon } from '@shopify/polaris-icons';
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


export function GeneralBuyXgetYfree({
  id,
  bundleId,
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
    bundleId: any,
    deleteSection: any
    heading: any,
    upBundlesChooseTitleChange: any,
    upBundlesChooseSubTitleChange: any,
    upBundlesBadgeTextChange: any,
    upBunlesBarLabelTextChange: any,
    upBundlesBarUpsellTextChange: any,
    onAddUpsell: any,
    onDeleteUpsell: any,
    upAddUpsellPriceChange: (id: any, price: string, defaultBasePrice?: string) => void,
    upPriceChange?: (id: any, price: string, defaultBasePrice?: string) => void, upBadgeSelectedChange?: (value: string) => void
  }) {

  const loaderData = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false);
  const [showPriceDecimal, setShowPriceDecimal] = useState(false);
  const [isShowLowAlert, setIsShowLowAlert] = useState(false);
  const [buyQualityalue, setBuyQualityalue] = useState<number>((loaderData as any).buyQualityalue);
  const [getQualityalue, setGetQualityalue] = useState<number>((loaderData as any).getQualityalue);
  const [barDefaultPrice, setBarDefaultPrice] = useState((loaderData as any).barDefaultPrice);
  const [upsellValue, setUpsellValue] = useState('20');
  const [opacity, setOpacity] = useState<number>(20);
  const [sizeValue, setSizeValue] = useState('13');
  const [selected, setSelected] = useState("default");
  const [badgeSelected, setBadgeSelected] = useState("simple");

  const [title, setTitle] = useState((loaderData as any).xybarTitle || "");
  const handleTitleChange = (v: string) => {
    setTitle(v);
    upBundlesChooseTitleChange(id, v);
  };
  const [subtitle, setSubtitle] = useState((loaderData as any).xybarSubTitle || "");
  const handleSubtitleChange = (v: string) => {
    setSubtitle(v);
    upBundlesChooseSubTitleChange(id, v);
  };
  const [bagdeText, setBagdeText] = useState((loaderData as any).xybagdeText || "");
  const handleBadgeTextChange = (v: string) => {
    setBagdeText(v);
    upBundlesBadgeTextChange(id, v);
  };
  const [barLabelText, setBarLabelText] = useState((loaderData as any).xybarLabelText || "");
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
    [upBadgeSelectedChange],
  );

  // Calculate price based on the formula: barDefaultQualityalue * barDefaultPrice * (1 - upsellValue / 100)
  useEffect(() => {
    const bQuantity = buyQualityalue;
    const gQuantity = getQualityalue;
    const tQuantity = bQuantity + gQuantity;
    const basePrice = parseFloat(barDefaultPrice || "0");

    let calculatedPrice = 0;
    let defaulBasePrice = tQuantity * basePrice;
    calculatedPrice = bQuantity * basePrice;

    if (upPriceChange) {
      upPriceChange(bundleId, calculatedPrice.toFixed(2), defaulBasePrice.toFixed(2));
    }
  }, [barDefaultPrice, buyQualityalue, getQualityalue, upPriceChange, bundleId]);

  // const handleChange = useCallback(
  //   (newValue: string) => {
  //     setUpsellValue(newValue);
  //   },
  //   [],
  // );
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
            icon={MegaphoneIcon}
          >
            {heading}
          </Button>
          <InlineStack gap="100">
            <Button icon={SortAscendingIcon} variant="tertiary" accessibilityLabel="Sort up" />
            <Button icon={SortDescendingIcon} variant="tertiary" accessibilityLabel="Sort down" />
            <Button icon={DomainNewIcon} variant="tertiary" accessibilityLabel="Add theme" />
            <Button icon={DeleteIcon} variant="tertiary" accessibilityLabel="Delete theme" onClick={() => deleteSection(id)} />
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
              <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 3 }}>
                <InlineStack gap="200" align="end" blockAlign="end" wrap={false}>
                  <Text as="h6" fontWeight="bold">
                    Buy
                  </Text>
                  <TextField
                    label='Quantity'
                    type="number"
                    value={String(buyQualityalue)}
                    onChange={(val) => {
                      const newValue = Number(val);
                      setBuyQualityalue(newValue);
                    }}
                    autoComplete="off"
                    min={1}
                    max={100}
                  />
                </InlineStack>
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 3 }}>
                <InlineStack gap="200" align="end" blockAlign="end" wrap={false}>
                  <Text as='h6' fontWeight="bold">
                    ,Get
                  </Text>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={String(getQualityalue)}
                    onChange={(val) => {
                      const newValue = Number(val);
                      setGetQualityalue(newValue);
                    }}
                    autoComplete="off"
                    min={1}
                    max={100}
                  />
                </InlineStack>
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6 }}>
                <InlineStack gap='300' align="end" blockAlign="end" wrap={false}>
                  <Text as='h6' fontWeight="bold">
                    free!
                  </Text>
                  <div style={{ width: '100%' }}>
                    <Tooltip content="You can't set the price for  Buy X, get Y free bar as the discount is auto applied based on XIY quantities set. For volume discount please scroll down, click Add bar and select Quantity break.">
                      <Select
                        label="Price"
                        options={upsellsOptions}
                        onChange={handleUpsellSelectChange}
                        value={selected}
                        disabled
                      />
                    </Tooltip>
                  </div>
                </InlineStack>
              </Grid.Cell>

            </Grid>
            {/* title and subtitle  */}
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
                  <BoxUpSellItem
                    key={item.id}
                    id={item.id}
                    bundleId={bundleId} // important
                    upBundlesBarUpsellTextChange={upBundlesBarUpsellTextChange}
                    upAddUpsellPriceChange={upAddUpsellPriceChange}
                    deleteSection={deleteBoxUpsell} // calls parent's delete with bundleId + upsellId
                  />
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

