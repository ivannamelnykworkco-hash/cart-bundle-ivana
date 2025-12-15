import { useState, useCallback, useContext, useEffect } from "react";
import {
  Card,
  BlockStack,
  TextField,
  Select,
  RadioButton,
  Checkbox,
  InlineStack,
  Button,
  Text,
  Divider,
  Box,
  ButtonGroup,
  Banner,
  Collapsible,
  Icon,
  Grid,
  Tooltip,
  Popover,
  ActionList,
} from "@shopify/polaris";
import { AddSwatchesModal } from "../common/AddSwatchesModal";
import { SettingsIcon, AlertCircleIcon } from '@shopify/polaris-icons';
import { SetDefaultVariantsModal } from "../common/SetDefaultVariantsModal";
import { ColorPickerPopover } from "../common/ColorPickerPopover";
import { SwitchIcon } from "../common/SwitchIcon"
import { SelectCollectionModal } from "../common/SelectCollectionModal";
import { SelectProductModal } from "../common/SelectProductModal";
import { useLoaderData } from "@remix-run/react";
import { loader } from "../product/ProductList";
import { ColorPickerPopoverItem } from "../common/ColorPickerPopoverItem";

export function GeneralSettingsPanel({ open, onToggle, onDataChange }) {
  // const loaderData = useContext(LoaderDataContext);
  const loaderData = useLoaderData<typeof loader>();
  const productArray = loaderData?.products?.map((product: any) => ({
    title: product.title,
    imageUrl: product.imageUrl,
    id: product.id,
    variants: product.variants
  }));
  const collectionArray = loaderData?.collections?.map((collection: any) => ({
    title: collection.title,
    imageUrl: collection.imageUrl,
    id: collection.id
  }));
  const conf = loaderData?.generalSettingConf;
  const marketOptions = [
    { label: "All", value: "all" },
    { label: "United States", value: "us" },
    { label: "Europe", value: "eu" },
  ];
  const roundingValueOption = [
    { label: ".99", value: ".99" },
    { label: ".95", value: ".95" },
    { label: ".90", value: ".90" },
    { label: ".x9", value: ".x9" },
    { label: ".x0", value: ".x0" },
    { label: ".00", value: ".00" },
  ];
  const updatePriceSelectOption = [
    { label: "Price per tiem", value: 'pi' },
    { label: "Bundle price", value: 'bp' },
  ]
  const currentDateTime = new Date().toISOString();
  //USESTATE FUNCTIONS
  const [bundleName, setBundleName] = useState(conf.bundleName); ``
  const [discountName, setDiscountName] = useState(conf.discountName ?? "");
  const [unitLabel, setUnitLabel] = useState(conf.unitLabel);
  const [roundingValue, setRoundingValue] = useState(conf.priceRounding);
  const [updatePriceSelect, setUpdatePriceSelect] = useState(conf.priceSelect);
  const [blockTitle, setBlockTitle] = useState(conf.blockTitle);
  const [visibility, setVisibility] = useState(conf.visibility);
  const [markets, setMarkets] = useState(conf.markets);
  const [excludeB2B, setExcludeB2B] = useState(conf.excludeB2B);
  const [startDate, setStartDate] = useState(conf?.startDateTime?.split('T')[0] ?? currentDateTime.split('T')[0]);
  const [startTime, setStartTime] = useState(conf?.startDateTime?.split('T')[1].split('Z')[0] ?? currentDateTime.split('T')[1].split('Z')[0]);
  const [endDate, setEndDate] = useState(conf?.endDateTime?.split('T')[0] ?? currentDateTime.split('T')[0]);
  const [endTime, setEndTime] = useState(conf?.endDateTime?.split('T')[1].split('Z')[0] ?? currentDateTime.split('T')[1].split('Z')[0]);
  const [endStateDate, setEndStateDate] = useState(conf.setEndDate);
  const [variant, setVariant] = useState(conf.letCustomer);
  const [hidnPicker, setHidnPicker] = useState(conf.hideTheme);
  const [variantSingle, setVariantSingle] = useState(conf.showVariant);
  const [showPricesItem, setShowPricesItem] = useState(conf.showPrices);
  const [compareAtPrice, setCompareAtPrice] = useState(conf.useProductCompare);
  const [showPriceDecimal, setShowPriceDecimal] = useState(conf.showPricesWithout);
  const [priceRounding, setPriceRounding] = useState(conf.showPriceRoundig);
  const [updatePrice, setUpdatePrice] = useState(conf.updateTheme);
  const [showBothPrices, setShowBothPrices] = useState(conf.showBothPrices);
  const [isGoCheckout, setIsGoCheckout] = useState(conf.skipCart);
  const [showStock, setShowStock] = useState<any>(conf.showWhenStock);
  const [isShowLowAlert, setIsShowLowAlert] = useState(conf.showAlert);
  const [textValue, setTextValue] = useState(conf.msgText);
  const [textColor, setTextColor] = useState(conf.msgColor);
  const [defaultVariant, setDefaultVariant] = useState(conf?.setDefaultVariant ?? {});
  const [selectedProduct, setSelectedProduct] = useState<any>(conf?.selectedProducts || []);
  const [selectedCollection, setSelectedCollection] = useState<any>(conf?.selectedCollections ?? []);
  const [excludedProduct, setExcludedProduct] = useState<any>(conf?.excludedProducts ?? []);
  const [excludedCollection, setExcludedCollection] = useState<any>(conf?.excludedCollections ?? []);
  const [swatchData, setSwatchData] = useState<any>(null);
  const id = conf.id ?? "";
  const discountId = conf.discountId ?? "";
  const bundleId = conf.bundleId ?? "";
  //FUNCTIONS
  const addCluryDobule = () => {
    setTextValue(prev => prev + "{{stack}}"); // append "abc"
  };
  const handleChangeShowStock = useCallback(
    (newValue: string) => setShowStock(newValue),
    [],
  );
  const [active, setActive] = useState<any>(null);
  const toggleActive = (id: string) => () => {
    setActive((activeId: string) => (activeId !== id ? id : null));
  };

  const handleReceiveProduct = useCallback((value) => {
    setSelectedProduct(value); // get products array from product modal
    setSelectedCollection(null);
    setExcludedProduct(null);
    setExcludedCollection(null);
  }, []);
  const handleReceiveCollection = useCallback((value) => {
    setSelectedCollection(value); // get collections array from collection modal
    setSelectedProduct(null);
    setExcludedProduct(null);
    setExcludedCollection(null);

  }, []);
  const handleReceiveExcludedProduct = useCallback((value) => {
    setExcludedProduct(value); // get excluded products array from product modal
    setSelectedProduct(null);
    setSelectedCollection(null);
    setExcludedCollection(null);
  }, []);
  const handleReceiveExcludedCollection = useCallback((value) => {
    setExcludedCollection(value); // get excluded collection array from collection modal
    setSelectedProduct(null); // get products array from product modal
    setSelectedCollection(null);
    setExcludedProduct(null);
  }, []);
  const handleOnSaveSwatch = (swatchData) => {
    setSwatchData(swatchData);
  }
  const handleColorChange = (value) => {
    setTextColor(value);
  }
  const handleReceiveDefaultVariant = (value) => {
    setDefaultVariant(value);
  }

  const selectedProductData = visibility === "all" ? [] : Array.isArray(selectedProduct) ? selectedProduct.map(item => item.id) : [];
  const selectedCollectionData = visibility === "all" ? [] : Array.isArray(selectedCollection) ? selectedCollection.map(item => item.id) : [];
  const excludedProductData = visibility === "all" ? [] : Array.isArray(excludedProduct) ? excludedProduct.map(item => item.id) : [];
  const excludedCollectionData = visibility === "all" ? [] : Array.isArray(excludedCollection) ? excludedCollection.map(item => item.id) : [];
  const settingData = () => ({
    id,
    discountId,
    bundleId,
    bundleName,
    discountName,
    blockTitle,
    visibility,
    markets,
    excludeB2B,
    startDate,
    startTime,
    endStateDate,
    endDate,
    endTime,
    variant,
    variantSingle,
    defaultVariant,
    hidnPicker,
    showPricesItem,
    showBothPrices,
    unitLabel,
    compareAtPrice,
    showPriceDecimal,
    priceRounding,
    roundingValue,
    updatePrice,
    updatePriceSelect,
    isGoCheckout,
    isShowLowAlert,
    showStock,
    textColor,
    textValue,
    selectedProductData,
    selectedCollectionData,
    excludedProductData,
    excludedCollectionData
  });

  useEffect(() => {
    if (onDataChange)
      onDataChange(settingData());
  }, [
    bundleName,
    discountName,
    blockTitle,
    visibility,
    markets,
    excludeB2B,
    startDate,
    startTime,
    endStateDate,
    endDate,
    endTime,
    variant,
    variantSingle,
    hidnPicker,
    showPricesItem,
    showBothPrices,
    unitLabel,
    compareAtPrice,
    showPriceDecimal,
    priceRounding,
    roundingValue,
    updatePrice,
    defaultVariant,
    updatePriceSelect,
    isGoCheckout,
    isShowLowAlert,
    showStock,
    textValue,
    textColor,
    selectedProduct,
    selectedCollection,
    excludedProduct,
    excludedCollection,
    onDataChange
  ]);
  return (
    < Card >
      <BlockStack gap="400">
        <InlineStack align="start">
          <Button
            onClick={onToggle}
            disclosure={open ? 'up' : 'down'}
            ariaControls="collapsible-settings"
            variant="plain"
            icon={SettingsIcon}
          >
            Settings
          </Button>
        </InlineStack>
        <Collapsible
          open={open}
          id="collapsible-settings"
          expandOnPrint
        >
          <BlockStack gap="200">
            <BlockStack gap="200">
              <TextField
                label="Name (only visible for you)"
                value={bundleName}
                onChange={setBundleName}
                autoComplete="off"
              />
              <TextField
                label="Discount name (shown in cart/checkout)"
                value={discountName}
                onChange={setDiscountName}
                autoComplete="off"
                placeholder="e.g., Bundle Discount"
              />
            </BlockStack>
            <Divider />
            <TextField
              label="Block title"
              value={blockTitle}
              onChange={setBlockTitle}
              autoComplete="off"
            />
            <Divider />

            <BlockStack gap="200">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                Visibility
              </Text>
              <BlockStack gap="100">
                <RadioButton
                  label="All products"
                  checked={visibility === "all"}
                  id="all"
                  onChange={() => setVisibility("all")}
                />
                <RadioButton
                  label="All products except selected"
                  checked={visibility === "except"}
                  id="except"
                  onChange={() => setVisibility("except")}
                />
                <RadioButton
                  label="Specific selected products"
                  checked={visibility === "specific"}
                  id="specific"
                  onChange={() => setVisibility("specific")}
                />
                <RadioButton
                  label="Products in selected collections"
                  checked={visibility === "collections"}
                  id="collections"
                  onChange={() => setVisibility("collections")}
                />
                {visibility === "all" && (
                  <Banner
                    title={`Some of the products are in "Bundle" deal which may result in conflicting discounts`}
                    tone="warning"
                  ></Banner>
                )}
                {
                  visibility === "except" && (
                    <BlockStack gap="200">
                      <InlineStack align="space-around" gap="200" >
                        <Box width="48%">
                          < SelectProductModal productArray={productArray} onSelect={handleReceiveExcludedProduct} title="Select excluded products" selectionMode="multipleProduct" buttonText='Select product' />
                        </Box>
                        <Box width="48%">
                          < SelectCollectionModal collectionArray={collectionArray} onSelect={handleReceiveExcludedCollection} title="Select excluded collections" selectionMode="multipleCollection" />
                        </Box>
                      </InlineStack>

                      <Banner
                        title={`Some of the products are in "Bundle" deal which may result in conflicting discounts`}
                        tone="warning"
                      ></Banner>
                    </BlockStack>
                  )
                }

                {
                  visibility === "specific" && (
                    < SelectProductModal productArray={productArray} onSelect={handleReceiveProduct} title="Select Products" selectionMode="multipleProduct" buttonText='Select products' />
                  )
                }

                {
                  visibility === "collections" && (
                    < SelectCollectionModal collectionArray={collectionArray} onSelect={handleReceiveCollection} title="Select collections" selectionMode="multipleCollection" />

                  )
                }
              </BlockStack>
              <Select
                label="Markets"
                options={marketOptions}
                onChange={setMarkets}
                value={markets}
              />
              <Checkbox
                label="Exclude B2B customers"
                checked={excludeB2B}
                onChange={setExcludeB2B}
              />
            </BlockStack>
            <Divider />

            <BlockStack gap="300">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                Active dates
              </Text>
              <InlineStack gap="200" blockAlign="end">
                <Box minWidth="50%">
                  <TextField
                    type="date"
                    label="Start date"
                    value={startDate}
                    onChange={setStartDate}
                    autoComplete="off"
                    min="2025-01-01"  // Minimum date
                    max="2025-12-31"
                  />
                </Box>
                <Box minWidth="45%">
                  <TextField
                    type="time"
                    label="Start time (GMT-8)"
                    value={startTime}
                    onChange={setStartTime}
                    autoComplete="off"
                  />
                </Box>
              </InlineStack>
              <Checkbox
                label="Set end date"
                checked={endStateDate}
                onChange={setEndStateDate}
              />
              {endStateDate && (
                <InlineStack gap="200" blockAlign="end">
                  <Box minWidth="50%">
                    <TextField
                      type="date"
                      label="End date"
                      value={endDate}
                      onChange={setEndDate}
                      autoComplete="off"
                    />
                  </Box>
                  <Box minWidth="45%">
                    <TextField
                      type="time"
                      label="End time (GMT-8)"
                      value={endTime}
                      onChange={setEndTime}
                      autoComplete="off"
                    />
                  </Box>
                </InlineStack>
              )}
            </BlockStack>
            <Divider />
            <BlockStack gap="200">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                Variants
              </Text>

              <BlockStack gap="100">
                <Checkbox
                  label="Let customers choose different variants for each item"
                  checked={variant}
                  onChange={setVariant}
                />
                {variant && (
                  <Checkbox
                    label="Show variant selectioin for single quantity deal bar"
                    checked={variantSingle}
                    onChange={setVariantSingle}
                  />
                )}
                <Checkbox
                  label="Hide theme variant picker"
                  checked={hidnPicker}
                  onChange={setHidnPicker}
                />
                <ButtonGroup fullWidth>
                  <AddSwatchesModal onSaveSwatch={handleOnSaveSwatch} />
                  <SetDefaultVariantsModal
                    productArray={productArray}
                    defaultVariant={defaultVariant}
                    onSelect={handleReceiveDefaultVariant} />
                </ButtonGroup>
              </BlockStack>
            </BlockStack>

            <Divider />
            <BlockStack gap="200">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                Pricing
              </Text>
              <BlockStack gap="100">
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Checkbox
                      label="Show prices per item"
                      checked={showPricesItem}
                      onChange={setShowPricesItem}
                    />
                    {showPricesItem && (
                      <Checkbox
                        label="Show both prices"
                        checked={showBothPrices}
                        onChange={setShowBothPrices}
                      />
                    )}
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    {showPricesItem && (
                      <TextField
                        label="Unit label"
                        value={unitLabel}
                        onChange={setUnitLabel}
                        placeholder="e.g per piece"
                        autoComplete="off"
                      />
                    )}
                  </Grid.Cell>
                </Grid>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Checkbox
                    label="Use product compare-at-price"
                    checked={compareAtPrice}
                    onChange={setCompareAtPrice}
                  />
                  <Tooltip content="Learn more">
                    <Icon
                      source={AlertCircleIcon}
                      tone="base"
                    />
                  </Tooltip>
                </div>
                <Checkbox
                  label="Show prices without decimals"
                  checked={showPriceDecimal}
                  onChange={setShowPriceDecimal}
                />
                <InlineStack gap="300">
                  <Checkbox
                    label="Price rounding"
                    checked={priceRounding}
                    onChange={setPriceRounding}
                  />
                  {priceRounding && (
                    <Select
                      label=""
                      options={roundingValueOption}
                      onChange={setRoundingValue}
                      value={roundingValue}
                    />
                  )}
                </InlineStack>
                <InlineStack gap="300">
                  <Checkbox
                    label="Update theme product price"
                    checked={updatePrice}
                    onChange={setUpdatePrice}
                  />
                  <Select
                    label=""
                    options={updatePriceSelectOption}
                    value={updatePriceSelect}
                    onChange={setUpdatePriceSelect}
                  />
                </InlineStack>
              </BlockStack>
            </BlockStack>
            <Divider />
            <BlockStack gap="200">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                Cart
              </Text>
              <Checkbox
                label="Skip cart and go to checkout directly"
                checked={isGoCheckout}
                onChange={setIsGoCheckout}
              />
            </BlockStack>
            <Divider />
            <BlockStack gap="200">
              <InlineStack align="space-between">
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Low stock alert
                </Text>
                <SwitchIcon checked={isShowLowAlert} onChange={setIsShowLowAlert} />
              </InlineStack>
              {isShowLowAlert && (
                <BlockStack gap="200">
                  <InlineStack gap="300" blockAlign="center">
                    <Text as='span' variant="bodyMd">
                      Show when stock is less than
                    </Text>
                    <Box maxWidth="20%">
                      <TextField
                        label=""
                        type="number"
                        value={showStock}
                        onChange={handleChangeShowStock}
                        autoComplete="off">
                      </TextField>
                    </Box>
                  </InlineStack>
                  <InlineStack gap="300">
                    <Box width="80%">
                      <InlineStack align="space-between">
                        <Text as='span'>Message text</Text>
                        <Popover
                          active={active === 'popover'}
                          preferredAlignment="right"
                          activator={
                            <Button
                              variant="tertiary"
                              onClick={toggleActive('popover')}
                              icon={SettingsIcon}
                              accessibilityLabel="Other save actions"
                            />
                          }
                          autofocusTarget="first-node"
                          onClose={toggleActive('popover')}
                        >
                          <ActionList
                            actionRole="menuitem"
                            sections={[
                              {
                                items: [
                                  {
                                    content: 'Add variable',
                                    suffix: <Icon source={AlertCircleIcon} />
                                  },
                                ],
                              },
                              {
                                title: 'Low stock alert',
                                items: [
                                  {
                                    content: 'Stock',
                                    onAction: addCluryDobule,
                                  }
                                ]
                              }
                            ]}
                          />
                        </Popover>
                      </InlineStack>
                      <TextField
                        label=" "
                        value={textValue}
                        onChange={setTextValue}
                        autoComplete="off"
                      />
                    </Box>
                    <Box width="15%">
                      <BlockStack gap="200">
                        <Text as='span'>Color</Text>
                        <ColorPickerPopoverItem defaultColorSetting={textColor} subtitle="" colorWidth="100%" onColorChange={handleColorChange} />
                      </BlockStack>
                    </Box>
                  </InlineStack>

                </BlockStack>
              )}
            </BlockStack>
          </BlockStack>
        </Collapsible>

      </BlockStack >
    </Card >
  );
}




