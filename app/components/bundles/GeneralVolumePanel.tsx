import { useState, useCallback, useEffect } from "react";
import {
  Card,
  BlockStack,
  Button,
  Collapsible,
  InlineStack,
  RangeSlider,
  Box,
  Text,
  TextField,
  Divider,
  RadioButton,
  Checkbox,
  Tooltip,
  Icon
} from "@shopify/polaris";

import { CollectionListIcon, AlertCircleIcon } from "@shopify/polaris-icons";
import { ColorPickerPopoverItem } from "app/components/common/ColorPickerPopoverItem";
import { CustomModal } from "app/components/common/CustomModal";
import { ImageLoad } from "app/components/common/ImageLoad";
import { SwitchIcon } from "../common/SwitchIcon";
import { SelectProductModal } from "../common/SelectProductModal";
import { SelectCollectionModal } from "../common/SelectCollectionModal";
import { useLoaderData } from "@remix-run/react";
import { loader } from "../product/ProductList";


export function GeneralVolumePanel({ open, onToggle, onDataChange, generalVolumeData, bundleId }) {
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

  const conf = generalVolumeData;

  const [openStyle, setOpenStyle] = useState(false);
  const bundlingColor = "#FF0000";
  const [isShowLowAlert, setIsShowLowAlert] = useState(false);
  const [eligible, setEligible] = useState(conf?.visibility);
  const [photoSize, setPhotoSize] = useState<any>(conf.productPhotoSize);
  const [isProductName, setIsProductName] = useState(conf.showProductName);
  const [isShowPrice, setIsShowPrice] = useState(conf.showPrice);
  const [volumeButtonText, setVolumeButtonText] = useState(conf.layoutButtonText);
  const [layoutColor, setLayoutColor] = useState(conf.layoutColor);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [excludedProduct, setExcludedProduct] = useState<any>(null);
  const [imageData, setImageData] = useState(conf.layoutImageUrl);
  const id = conf.id;
  const initDataLoad = {
    heading: conf.customHeadingText,
    buttonText: conf.customButtonText,
    primaryButtonSize: conf.customButtonSize,
    textSize: conf.customTextSize,
    customPhotoSize: conf.customPhotoSize,
    customMessageText: conf.customMessageText,
    overlayColor: conf.customOverlayColor,
    priceColor: conf.customPriceColor,
    compareAtPriceColor: conf.customCompareAtPriceColor,
    textColor: conf.customTextColor,
    buttonColor: conf.customButtonColor,
    buttonTextColor: conf.customButtonTextColor
  };
  const [dataLoad, setDataLoad] = useState(initDataLoad);

  const handleReceiveProduct = (value) => {
    setSelectedProduct(value); // get products array from product modal
  };

  const handleReceiveCollection = (value) => {
    setSelectedCollection(value); // get collections array from product modal
  };

  const handleReceiveExcludedProduct = (value) => {
    setExcludedProduct(value); // get excluded products array from product modal
  };

  const handleOnSave = (dataLoad) => {
    setDataLoad(dataLoad);
  };

  const handleImageChange = (file) => {
    setImageData(URL.createObjectURL(file));
  }
  const handleColorChange = (data) => {
    //////////////////////////
    // ///////////////    // setStyleTitleColor(data);
  };


  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        id,
        bundleId,
        eligible,
        photoSize,
        isProductName,
        isShowPrice,
        volumeButtonText,
        layoutColor,
        ...dataLoad,
        imageData,
      });
    }
  }, [
    eligible,
    photoSize,
    isProductName,
    isShowPrice,
    volumeButtonText,
    layoutColor,
    dataLoad,
    imageData,
    onDataChange
  ]);

  return (
    <Card>
      <BlockStack gap="200">
        <InlineStack align="space-between">
          <Button
            onClick={onToggle}
            disclosure={open ? "up" : "down"}
            ariaControls="collapsible-settings"
            variant="plain"
            icon={CollectionListIcon}
          >
            Volume discount bundle with other products
          </Button>
          <SwitchIcon checked={isShowLowAlert} onChange={setIsShowLowAlert} />
        </InlineStack>
        <Collapsible open={open} id="collapsible-settings" expandOnPrint>
          <BlockStack gap="200">
            {/* {eligible layout} */}
            <BlockStack gap="200">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                Eligible for bundling
              </Text>
              <BlockStack gap="100">
                <RadioButton
                  label="All products except selected"
                  checked={eligible === "productsExcept"}
                  id="productsExcept"
                  onChange={() => setEligible("productsExcept")}
                />
                <RadioButton
                  label="Selected products"
                  checked={eligible === "productsSelected"}
                  id="productsSelected"
                  onChange={() => setEligible("productsSelected")}
                />
                <RadioButton
                  label="Products in selected collections"
                  checked={eligible === "collectionSelected"}
                  id="collectionSelected"
                  onChange={() => setEligible("collectionSelected")}
                />
                {eligible === "productsExcept" && (
                  <SelectProductModal productArray={productArray} onSelect={handleReceiveExcludedProduct} title="Select Products" selectionMode="multipleProduct" buttonText='Select Products' />
                )
                }
                {
                  eligible === "collectionSelected" && (
                    <SelectCollectionModal collectionArray={collectionArray} onSelect={handleReceiveCollection} title="Select Collections" selectionMode="multipleCollection" />

                  )
                }
                {
                  eligible === "productsSelected" && (
                    <SelectProductModal productArray={productArray} onSelect={handleReceiveProduct} title="Select Products" selectionMode="multipleProduct" buttonText='Select Products' />
                  )
                }
              </BlockStack>
            </BlockStack>

            <Divider />

            <BlockStack gap="300">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                Layout
              </Text>
              {/* {edit image and utton text} */}
              <InlineStack gap="100">
                <ImageLoad onChange={handleImageChange} />
                <TextField
                  label="Button text"
                  value={volumeButtonText}
                  onChange={setVolumeButtonText}
                  autoComplete="off"
                />
              </InlineStack>

              {/* {color and product photo size} */}
              <BlockStack gap="200">
                <ColorPickerPopoverItem subtitle="Color" defaultColorSetting={layoutColor} colorWidth="50px" onColorChange={handleColorChange} />
                <BlockStack inlineAlign="stretch">
                  <Text as="span" variant="bodySm">Product photo size</Text>
                  <InlineStack gap="0" align="space-between" blockAlign="center">
                    <div style={{ width: "70%" }}>
                      <RangeSlider
                        value={Number(photoSize)}
                        onChange={(v: number) => setPhotoSize(v)} // The 'onChange' should expect a number
                        min={0}
                        max={40}
                        label
                        output
                      />
                    </div>
                    <Box width="20%" minHeight="32px">
                      <TextField
                        autoComplete="off"
                        value={`${photoSize}`} // Convert the number to a string
                        onChange={setPhotoSize} // Convert the string back to a number
                        min={0}
                        max={40}
                        suffix="px"
                        label
                      />
                    </Box>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </BlockStack>

            <Divider />
            {/* {other settings} */}
            <BlockStack gap="200">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                Other settings
              </Text>
              <Checkbox
                label="Show product name"
                checked={isProductName}
                onChange={setIsProductName}
              />
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Checkbox
                  label="Show price of chosen products only"
                  checked={isShowPrice}
                  onChange={setIsShowPrice}
                />
                <Tooltip content="Learn more">
                  <Icon
                    source={AlertCircleIcon}
                    tone="base"
                  />
                </Tooltip>
              </div>
            </BlockStack>
            <CustomModal onSave={handleOnSave} />
          </BlockStack>

        </Collapsible>
      </BlockStack >
    </Card >
  );

}