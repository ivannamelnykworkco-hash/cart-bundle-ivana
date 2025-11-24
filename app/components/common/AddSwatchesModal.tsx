import { useState, useCallback } from "react";
import {
  BlockStack,
  Box,
  Button,
  InlineStack,
  Modal,
  Text,
  Badge,
  RangeSlider,
  Divider,
  Select,
  DataTable,
  Thumbnail
} from "@shopify/polaris";
import { ImageIcon, VariantIcon } from '@shopify/polaris-icons';
import { ColorPickerPopoverItem } from "./ColorPickerPopoverItem";
import { ImageUploader } from "./ImageUploder";

export function AddSwatchesModal() {

  const solidBlack = "2px solid #000";
  const swatchOption = [
    { label: "Denomination", value: 'isDenomination' },
    { label: "Color", value: 'isColor' },
    { label: "Title", value: 'isTitle' }
  ];

  const swatchType = [
    { label: "Default dropdown", value: 'isDefaultDropdown' },
    { label: "Color swatch dropdown", value: 'isColorSwatchDropdown' },
    { label: "Image swatch dropdown", value: 'isImageSwatchDropdown' },
    { label: "Product image dropdown", value: 'isProductImageDropdown' },
    { label: "Color swatch", value: 'isColorSwatch' },
    { label: "Image swatch", value: 'isImageSwatch' },
    { label: "Product image swatch", value: 'isProductImageSwatch' }
  ];

  const swatchShape = [
    { label: "Circle", value: 'isCircle' },
    { label: "Rounded", value: 'isRounded' },
    { label: "Squre", value: 'isSquare' }
  ];

  const colorTableRows = [
    ['$25', <ColorPickerPopoverItem subtitle="" defaultColorSetting="red" colorWidth="100%" />],
    ['$50', <ColorPickerPopoverItem subtitle="" defaultColorSetting="red" colorWidth="100%" />],
    ['$100', <ColorPickerPopoverItem subtitle="" defaultColorSetting="red" colorWidth="100%" />],
    ['$10', <ColorPickerPopoverItem subtitle="" defaultColorSetting="red" colorWidth="100%" />],

  ];

  const imageTableColumn = ["$50", "$50", "$100", "$10"];

  const [file, setFile] = useState<File>();
  const [images, setImages] = useState([null, null, null, null]); // example: 3 uploaders

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  // const fileUpload = !file && <DropZone.FileUpload />;
  const uploadedFile = file && (
    <Thumbnail
      size="extraSmall"
      alt={file.name}
      source={
        validImageTypes.includes(file.type)
          ? window.URL.createObjectURL(file)
          : ImageIcon
      }
    />
  );

  const updateImageAtIndex = (index, file) => {
    setImages(prev => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  const imageTableRows = images.map((img, index) => [
    imageTableColumn[index],
    < ImageUploader
      value={img}
      onChange={(file) => updateImageAtIndex(index, file)
      }
    />
  ]);


  // const imageTableRows = [
  //   ['$50',
  //     <ImageUploader
  //       value={productImage}
  //       onChange={(file) => setProductImage(file)} />
  //   ],
  //   ['$50',
  //     <ImageUploader
  //       value={productImage}
  //       onChange={(file) => setProductImage(file)} />
  //   ],
  //   ['$100',
  //     <ImageUploader
  //       value={productImage}
  //       onChange={(file) => setProductImage(file)} />
  //   ],
  //   ['$10',
  //     <ImageUploader
  //       value={productImage}
  //       onChange={(file) => setProductImage(file)} />
  //   ],
  // ];

  const [activeModalAddSwatches, setActiveModalAddSwatches] = useState(false);
  const [swatchOptionSelected, setSwatchOptionSelected] = useState(swatchOption[0].value);
  const [swatchTypeSelected, setSwatchTypeSelected] = useState(swatchType[0].value);
  const [swatchShapeSelected, setSwatchShapeSelected] = useState(swatchShape[0].value);
  const [swatchSize, setSwatchSize] = useState<number>(100);

  const handleShowAddSwatches = useCallback(() => setActiveModalAddSwatches(!activeModalAddSwatches), [activeModalAddSwatches]);
  const modalAddSwatchActivator = <Button icon={VariantIcon} onClick={handleShowAddSwatches}>Add swatches</Button>;

  //FUNCTIONS

  const handleSwatchOption = useCallback(
    (value: string) => setSwatchOptionSelected(value),
    [],
  );

  const handleSwatchType = useCallback(
    (value: string) => setSwatchTypeSelected(value),
    [],
  );

  const handleSwatchShape = useCallback(
    (value: string) => setSwatchShapeSelected(value),
    [],
  );


  return (
    <Modal
      activator={modalAddSwatchActivator}
      open={activeModalAddSwatches}
      onClose={handleShowAddSwatches}
      title="Reach more shoppers with Instagram product tags"
      size="large"
      primaryAction={{
        content: 'Apply',
        onAction: handleShowAddSwatches,
      }}
      secondaryActions={
        [
          {
            content: 'Cancel',
            onAction: handleShowAddSwatches,
          },
        ]}
    >
      <Modal.Section>
        <Box padding="200" width="100%">
          <InlineStack gap="200" align="space-between">
            {/* Left Part */}
            <Box width="50%">

              <BlockStack gap="200">
                <Text as="p" variant="headingMd" fontWeight="bold">
                  Swatches
                </Text>
                <InlineStack align="space-between">
                  <Box width="49%">
                    <Select
                      label="Option"
                      options={swatchOption}
                      onChange={handleSwatchOption}
                      value={swatchOptionSelected}
                    />
                  </Box>
                  <Box width="49%">
                    <Select
                      label="Type"
                      options={swatchType}
                      onChange={handleSwatchType}
                      value={swatchTypeSelected}
                    />
                  </Box>
                </InlineStack>
                {(swatchTypeSelected === "isColorSwatch" || swatchTypeSelected === "isColorSwatchDropdown") && (
                  <DataTable
                    columnContentTypes={[
                      'text',
                    ]}
                    headings={[
                      'Variant',
                      '',
                    ]}
                    rows={colorTableRows}

                  // rows={colorTableRows.map((row) => [
                  //   <div style={{ width: '250px' }}>{row[0]}</div>,
                  //   <div style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center' }}>{row[1]}</div>,
                  //   <div style={{ width: '150px' }}>{row[2]}</div>,
                  // ])}
                  />
                )}

                {(swatchTypeSelected === "isImageSwatch" || swatchTypeSelected === "isImageSwatchDropdown") && (
                  <DataTable
                    columnContentTypes={[
                      'text',
                    ]}
                    headings={[
                      'Variant',
                    ]}
                    verticalAlign="middle"
                    rows={imageTableRows}
                  />
                )}

                <Divider />
                <Text as="p" variant="headingMd" fontWeight="bold">
                  Settings
                </Text>

                <InlineStack gap="200" align="space-between">
                  <Box width="47%">
                    <RangeSlider
                      value={swatchSize}
                      onChange={(v: number) => setSwatchSize(v)}
                      min={0}
                      max={100}
                      label="Swatch Size"
                      output
                    />
                  </Box>
                  <Box width="47%">
                    <Select
                      label="Swatch shape"
                      options={swatchShape}
                      onChange={handleSwatchShape}
                      value={swatchShapeSelected}
                    />
                  </Box>
                </InlineStack>
              </BlockStack>
            </Box>
            {/* Right Part */}
            <Box width="45%">
              <Text as="p" variant="headingMd" fontWeight="semibold">
                Preview
              </Text>
              <div style={{
                border: "2px solid #000",
                borderRadius: "8px",
                padding: "12px",
                position: "relative"
              }}>
                <div style={{
                  position: "absolute",
                  top: "-12px",
                  right: "12px",
                  backgroundColor: "#EF4444",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  zIndex: 1
                }}>
                  MOST POPULAR
                </div>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="single-bundle-type"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginTop: "2px",
                      cursor: "pointer",
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <InlineStack align="space-between" blockAlign="start">
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Text as="p" variant="headingMd" fontWeight="semibold">
                            Duo
                          </Text>
                          <Badge tone="attention" size="small">SAVE $14.99</Badge>
                        </div>
                        <Text as="p" variant="bodySm" tone="subdued">
                          You save 15%
                        </Text>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Text as="p" variant="headingLg" fontWeight="bold">
                          $84.99
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          <s>$99.98</s>
                        </Text>
                      </div>
                    </InlineStack>
                  </div>
                </label>
              </div>
            </Box>
          </InlineStack>
        </Box>
      </Modal.Section >
    </Modal >)
}