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

export function GeneralSettingsPanel({
  open,
  onToggle,
  onDataChange,
  generalSettingData,
  onDefaultVariantChange,
  bundleId }) {
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
  const [bundleName, setBundleName] = useState(generalSettingData.bundleName); ``
  const [discountName, setDiscountName] = useState(generalSettingData.discountName ?? "");
  const [unitLabel, setUnitLabel] = useState(generalSettingData.unitLabel);
  const [roundingValue, setRoundingValue] = useState(generalSettingData.priceRounding);
  const [updatePriceSelect, setUpdatePriceSelect] = useState(generalSettingData.priceSelect);
  const [blockTitle, setBlockTitle] = useState(generalSettingData.blockTitle);
  const [visibility, setVisibility] = useState(generalSettingData.visibility);
  const [markets, setMarkets] = useState(generalSettingData.markets);
  const [excludeB2B, setExcludeB2B] = useState(generalSettingData.excludeB2B);
  const [startDate, setStartDate] = useState(generalSettingData?.startDateTime?.split('T')[0] ?? currentDateTime.split('T')[0]);
  const [startTime, setStartTime] = useState(generalSettingData?.startDateTime?.split('T')[1].split('Z')[0] ?? currentDateTime.split('T')[1].split('Z')[0]);
  const [endDate, setEndDate] = useState(generalSettingData?.endDateTime?.split('T')[0] ?? currentDateTime.split('T')[0]);
  const [endTime, setEndTime] = useState(generalSettingData?.endDateTime?.split('T')[1].split('Z')[0] ?? currentDateTime.split('T')[1].split('Z')[0]);
  const [endStateDate, setEndStateDate] = useState(generalSettingData.setEndDate);
  const [variant, setVariant] = useState(generalSettingData.letCustomer);
  const [hidnPicker, setHidnPicker] = useState(generalSettingData.hideTheme);
  const [variantSingle, setVariantSingle] = useState(generalSettingData.showVariant);
  const [showPricesItem, setShowPricesItem] = useState(generalSettingData.showPrices);
  const [compareAtPrice, setCompareAtPrice] = useState(generalSettingData.useProductCompare);
  const [showPriceDecimal, setShowPriceDecimal] = useState(generalSettingData.showPricesWithout);
  const [priceRounding, setPriceRounding] = useState(generalSettingData.showPriceRoundig);
  const [updatePrice, setUpdatePrice] = useState(generalSettingData.updateTheme);
  const [showBothPrices, setShowBothPrices] = useState(generalSettingData.showBothPrices);
  const [isGoCheckout, setIsGoCheckout] = useState(generalSettingData.skipCart);
  const [showStock, setShowStock] = useState<any>(generalSettingData.showWhenStock);
  const [isShowLowAlert, setIsShowLowAlert] = useState(generalSettingData.showAlert);
  const [textValue, setTextValue] = useState(generalSettingData.msgText);
  const [textColor, setTextColor] = useState(generalSettingData.msgColor);
  const [defaultVariant, setDefaultVariant] = useState(generalSettingData.setDefaultVariant ?? {});
  const [selectedProduct, setSelectedProduct] = useState<any>(generalSettingData?.selectedProducts || []);
  const [selectedCollection, setSelectedCollection] = useState<any>(generalSettingData?.selectedCollections ?? []);
  const [excludedProduct, setExcludedProduct] = useState<any>(generalSettingData?.excludedProducts ?? []);
  const [excludedCollection, setExcludedCollection] = useState<any>(generalSettingData?.excludedCollections ?? []);
  const [swatchData, setSwatchData] = useState<any>(null);
  const id = generalSettingData.id ?? "";
  const discountId = generalSettingData.discountId ?? "";
  const parsedSelectedProduct = Array.isArray(selectedProduct) ? selectedProduct : JSON.parse(selectedProduct ?? '[]');
  const parsedSelectedCollection = Array.isArray(selectedCollection) ? selectedCollection : JSON.parse(selectedCollection ?? '[]');
  const parsedExcludedProduct = Array.isArray(excludedProduct) ? excludedProduct : JSON.parse(excludedProduct ?? '[]');
  const parsedExcludedCollection = Array.isArray(excludedCollection) ? excludedCollection : JSON.parse(excludedCollection ?? '[]');
  const selectedProductArray = productArray.filter(product => parsedSelectedProduct.includes(product.id));
  const selectedCollectionArray = collectionArray.filter(collection => parsedSelectedCollection.includes(collection.id));
  const excludedProductArray = productArray.filter(product => parsedExcludedProduct.includes(product.id));
  const excludedCollectionArray = collectionArray.filter(collection => parsedExcludedCollection.includes(collection.id));
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
    // setExcludedCollection(null);
  }, []);
  const handleReceiveExcludedCollection = useCallback((value) => {
    setExcludedCollection(value); // get excluded collection array from collection modal
    setSelectedProduct(null); // get products array from product modal
    setSelectedCollection(null);
    // setExcludedProduct(null);
  }, []);
  const handleOnSaveSwatch = (swatchData) => {
    setSwatchData(swatchData);
  }
  const handleColorChange = (value) => {
    setTextColor(value);
  }
  const handleReceiveDefaultVariant = (value) => {
    setDefaultVariant(value);
    onDefaultVariantChange(value);
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
                          < SelectProductModal
                            productArray={productArray}
                            onSelect={handleReceiveExcludedProduct}
                            title="Select excluded products"
                            selectionMode="multipleProduct"
                            selected={excludedProductArray}
                            buttonText='Select product' />
                        </Box>
                        <Box width="48%">
                          < SelectCollectionModal
                            collectionArray={collectionArray}
                            onSelect={handleReceiveExcludedCollection}
                            title="Select excluded collections"
                            selectionMode="multipleCollection"
                            selected={excludedCollectionArray} />
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
                    < SelectProductModal
                      productArray={productArray}
                      onSelect={handleReceiveProduct}
                      title="Select Products"
                      selectionMode="multipleProduct"
                      selected={selectedProductArray}
                      buttonText='Select products' />
                  )
                }
                {
                  visibility === "collections" && (
                    < SelectCollectionModal
                      collectionArray={collectionArray}
                      onSelect={handleReceiveCollection}
                      title="Select collections"
                      selected={selectedCollectionArray}
                      selectionMode="multipleCollection" />
                  )
                }
              </BlockStack>
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
                <ButtonGroup fullWidth>
                  <SetDefaultVariantsModal
                    productArray={productArray}
                    defaultVariant={defaultVariant}
                    onSelect={handleReceiveDefaultVariant} />
                </ButtonGroup>
              </BlockStack>
            </BlockStack>
          </BlockStack>
        </Collapsible>

      </BlockStack >
    </Card >
  );
}




