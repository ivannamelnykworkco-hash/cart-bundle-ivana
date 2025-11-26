import { useState, useCallback } from "react";
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


export function GeneralVolumePanel({ loaderData }) {
  // console.log("lett", loaderData.loaderData);
  const thirdLoaderData = {
    eligible: "productsExcept",
    volumeButtonText: 'Choose'
  }

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

  const bundlingColor = {
    hue: 36,
    saturation: 1,
    brightness: 1,
    alpha: 1,
  };

  const [openStyle, setOpenStyle] = useState(false);
  const [isShowLowAlert, setIsShowLowAlert] = useState(false);
  const [eligible, setEligible] = useState(thirdLoaderData.eligible);
  const [photoSize, setPhotoSize] = useState<any>(32);
  const [isProductName, setIsProductName] = useState(true)
  const [isShowPrice, setIsShowPrice] = useState(false)
  const [volumeButtonText, setVolumeButtonText] = useState(thirdLoaderData.volumeButtonText)
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [excludedProduct, setExcludedProduct] = useState<any>(null);

  const handleSettingsToggle = useCallback(
    () => setOpenStyle((open) => !open),
    []
  );

  const handleReceiveProduct = (value) => {
    setSelectedProduct(value); // get products array from product modal
  };

  const handleReceiveCollection = (value) => {
    setSelectedCollection(value); // get collections array from product modal
  };

  const handleReceiveExcludedProduct = (value) => {
    setExcludedProduct(value); // get excluded products array from product modal
  };

  return (
    <Card>
      <BlockStack gap="200">
        <InlineStack align="space-between">
          <Button
            onClick={handleSettingsToggle}
            disclosure={openStyle ? "up" : "down"}
            ariaControls="collapsible-settings"
            variant="plain"
            icon={CollectionListIcon}
          >
            Volume discount bundle with other products
          </Button>
          <SwitchIcon checked={isShowLowAlert} onChange={setIsShowLowAlert} />
        </InlineStack>
        <Collapsible open={openStyle} id="collapsible-settings" expandOnPrint>
          <BlockStack gap="200">
            {/* {eligible layout} */}
            <BlockStack gap="200">
              <Text as="p" variant="bodyMd" fontWeight="semibold">
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
                  checked={eligible === "product"}
                  id="product"
                  onChange={() => setEligible("product")}
                />
                <RadioButton
                  label="Products in selected collections"
                  checked={eligible === "collection"}
                  id="collection"
                  onChange={() => setEligible("collection")}
                />
                {eligible === "productsExcept" && (
                  <SelectProductModal productArray={productArray} onSelect={handleReceiveExcludedProduct} title="Select Products" selectionMode="multipleProduct" />
                )
                }
                {
                  eligible === "collection" && (
                    <SelectCollectionModal collectionArray={collectionArray} onSelect={handleReceiveCollection} title="Select Collections" selectionMode="multipleCollection" />

                  )
                }
                {
                  eligible === "product" && (
                    <SelectProductModal productArray={productArray} onSelect={handleReceiveProduct} title="Select Products" selectionMode="multipleProduct" />
                  )
                }
              </BlockStack>
            </BlockStack>

            <Divider />

            <BlockStack gap="300">
              <Text as="p" variant="bodyMd" fontWeight="semibold">
                Layout
              </Text>
              {/* {edit image and utton text} */}
              <InlineStack gap="100">
                <ImageLoad />
                <TextField
                  label="Button text"
                  value={volumeButtonText}
                  onChange={setVolumeButtonText}
                  autoComplete="off"
                />
              </InlineStack>

              {/* {color and product photo size} */}
              <BlockStack gap="200">
                <ColorPickerPopoverItem subtitle="Color" defaultColorSetting={bundlingColor} colorWidth="50px" />
                <BlockStack inlineAlign="stretch">
                  <Text as="p" variant="bodySm">Product photo size</Text>
                  <InlineStack gap="0" align="space-between" blockAlign="center">
                    <div style={{ width: "70%" }}>
                      <RangeSlider
                        value={Number(photoSize)} // Make sure 'cornerRadius' is already a number
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
              <Text as="p" variant="bodyMd" fontWeight="semibold">
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
            <CustomModal />
          </BlockStack>


        </Collapsible>
      </BlockStack >
    </Card >
  )

}