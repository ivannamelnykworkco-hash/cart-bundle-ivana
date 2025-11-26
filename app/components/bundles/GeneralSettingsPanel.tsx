import { useState, useCallback, useContext } from "react";

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

export function GeneralSettingsPanel({ loaderData }) {

  //CONST VARIABLES

  const firstLoaderData = {
    bundleName: "Bundle",
    unitLabel: '',
    discountName: "",
    blockTitle: "BUNDLE & SAVE",
    visibility: "all",
    markets: "all",
    roundingValue: '.90',
    updatePriceSelect: 'Price per item',
    excludeB2B: false,
    excludePOS: false,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "09:00",
    selectedProduct: "Gift Card",
    selectedCountry: "United States",
    showStock: 1,
    // Design settings
    primaryColor: "#000000",
    secondaryColor: "#10b981",
    borderRadius: 8,
    fontSize: 14,
    // Upsell products
    upsellProducts: [
      { id: "1", title: "Product A", price: "$25.00", image: "" },
      { id: "2", title: "Product B", price: "$35.00", image: "" },
    ],
  }

  // const loaderData = useContext(LoaderDataContext);

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

  const marketOptions = [
    { label: "All", value: "all" },
    { label: "United States", value: "us" },
    { label: "Europe", value: "eu" },
  ];

  const roundingValueOption = [
    { label: ".99", value: ".99" },
    { label: ".95", value: ".95" },
    { label: ".90", value: ".90" },
    { label: ".*9", value: ".*9" },
    { label: ".*0", value: ".*0" },
    { label: ".00", value: ".00" },
  ];

  const updatePriceSelectOption = [
    { label: "Price per tiem", value: 'pi' },
    { label: "Bundle price", value: 'bp' },
  ]

  //USESTATE FUNCTIONS
  const [open, setOpen] = useState(true);
  const [bundleName, setBundleName] = useState(firstLoaderData.bundleName);
  const [discountName, setDiscountName] = useState(firstLoaderData.discountName);
  const [unitLabel, setUnitLabel] = useState(firstLoaderData.discountName);
  const [roundingValue, setRoundingValue] = useState(firstLoaderData.roundingValue);
  const [updatePriceSelect, setUpdatePriceSelect] = useState(firstLoaderData.updatePriceSelect);
  const [blockTitle, setBlockTitle] = useState(firstLoaderData.blockTitle);
  const [visibility, setVisibility] = useState(firstLoaderData.visibility);
  const [markets, setMarkets] = useState(firstLoaderData.markets);
  const [excludeB2B, setExcludeB2B] = useState(firstLoaderData.excludeB2B);
  const [startDate, setStartDate] = useState(firstLoaderData.startDate);
  const [endDate, setEndDate] = useState(firstLoaderData.endDate);
  const [startTime, setStartTime] = useState(firstLoaderData.startTime);
  const [endTime, setEndTime] = useState(firstLoaderData.endTime);
  const [endStateDate, setEndStateDate] = useState(false);
  const [variant, setVariant] = useState(false);
  const [hidnPicker, setHidnPicker] = useState(false);
  const [variantSingle, setVariantSingle] = useState(true);
  const [showPricesItem, setShowPricesItem] = useState(false);
  const [compareAtPrice, setCompareAtPrice] = useState(true);
  const [showPriceDecimal, setShowPriceDecimal] = useState(true);
  const [priceRounding, setPriceRounding] = useState(false);
  const [updatePrice, setUpdatePrice] = useState(false);
  const [showBothPrices, setShowBothPrices] = useState(false);
  const [isGoCheckout, setIsGoCheckout] = useState(false);
  const [showStock, setShowStock] = useState<any>(firstLoaderData.showStock);
  const [isShowLowAlert, setIsShowLowAlert] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [excludedProduct, setExcludedProduct] = useState<any>(null);
  const [excludedCollection, setExcludedCollection] = useState<any>(null);


  //FUNCTIONS
  const handleSettingsToggle = useCallback(() => setOpen((open) => !open), []);

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

  const handleReceiveProduct = (value) => {
    setSelectedProduct(value); // get products array from product modal
  };

  const handleReceiveCollection = (value) => {
    setSelectedCollection(value); // get collections array from collection modal
  };

  const handleReceiveExcludedProduct = (value) => {
    setExcludedProduct(value); // get excluded products array from product modal
  };

  const handleReceiveExcludedCollection = (value) => {
    setExcludedCollection(value); // get excluded collection array from collection modal
  };

  return (
    < Card >
      <BlockStack gap="400">
        <InlineStack align="start">
          <Button
            onClick={handleSettingsToggle}
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
              <Text as="p" variant="bodyMd" fontWeight="semibold">
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
                          < SelectProductModal productArray={productArray} onSelect={handleReceiveExcludedProduct} title="Select excluded products" selectionMode="multipleProduct" />
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
                    < SelectProductModal productArray={productArray} onSelect={handleReceiveProduct} title="Select Products" selectionMode="multipleProduct" />
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
              <Text as="p" variant="bodyMd" fontWeight="semibold">
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
              <Text as="p" variant="bodyMd" fontWeight="semibold">
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
                  <AddSwatchesModal />
                  < SetDefaultVariantsModal productArray={productArray} />
                </ButtonGroup>
              </BlockStack>
            </BlockStack>

            <Divider />

            <BlockStack gap="200">
              <Text as="p" variant="bodyMd" fontWeight="semibold">
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
              <Text as="p" variant="bodyMd" fontWeight="semibold">
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
                <Text as="p" variant="bodyMd" fontWeight="semibold">
                  Low stock alert
                </Text>
                <SwitchIcon checked={isShowLowAlert} onChange={setIsShowLowAlert} />
              </InlineStack>
              {/* SHOW STOCK ALERT */}
              {isShowLowAlert && (
                <BlockStack gap="200">
                  <InlineStack gap="300" blockAlign="center">
                    <Text as='p' variant="bodyMd">
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
                        <Text as='p'>Message text</Text>
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
                        <Text as='p'>Color</Text>
                        <ColorPickerPopover defaultColor="red" />
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



