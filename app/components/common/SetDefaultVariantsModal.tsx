import { useState, useCallback } from "react";
import {
  BlockStack,
  Box,
  Button,
  DataTable,
  InlineStack,
  Modal,
  Thumbnail,
  Text,
  RadioButton
} from "@shopify/polaris";
import { ImageIcon, VariantIcon } from '@shopify/polaris-icons';
import { SelectProductModal } from "./SelectProductModal";

export function SetDefaultVariantsModal({ productArray }) {

  const [activeModalSetDefaultVariants, setActiveModalSetDefaultVariants] = useState(false);
  const [bundleType, setBundleType] = useState('singleType');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  //FUNCTIONS

  const handleBundleType = useCallback(
    (_: boolean, newValue: string) => setBundleType(newValue),
    [],
  );

  const handleReceiveProduct = (value) => {
    setSelectedProduct(value); // receive → store
  };
  const handleShowSetDefaultVariants = useCallback(() => setActiveModalSetDefaultVariants(!activeModalSetDefaultVariants), [activeModalSetDefaultVariants]);
  const modalSetDefaultVariantsActivator = <Button icon={VariantIcon} onClick={handleShowSetDefaultVariants}>Set default variants</Button>;
  const row = [
    <Box width="60px">
      <Thumbnail
        size="small"
        alt=""
        source={productArray[0]?.imageUrl}
      />
    </Box>,
    <Text as="p" alignment="start">
      {productArray[0]?.title}
    </Text>
  ];

  const rows = selectedProduct?.map((product) => [
    <Box width="60px">
      <Thumbnail
        size="small"
        alt=""
        source={product?.imageUrl || ImageIcon}
      />
    </Box>,
    <Text as="p" alignment="start">
      {product.title}
    </Text>
  ]);

  return (
    <Modal
      size="large"
      activator={modalSetDefaultVariantsActivator}
      open={activeModalSetDefaultVariants}
      onClose={handleShowSetDefaultVariants}
      title="Reach more shoppers with Instagram product tags"
      primaryAction={{
        content: 'Apply',
        onAction: handleShowSetDefaultVariants,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleShowSetDefaultVariants,
        },
      ]}
    >
      <Modal.Section>
        <InlineStack align="space-between">
          {/* Left Part */}
          <Box width="45%" borderWidth="050" borderRadius="400" padding="400">
            <BlockStack gap="400">
              <Text
                as="p"
                variant="bodyMd"
                alignment="start"
                fontWeight="bold"
              >
                Select bar to set its default variants
              </Text>

              <Box paddingInline="200">
                <BlockStack gap="200">
                  <Text
                    as="p"
                    variant="bodyLg"
                    alignment="center"
                    fontWeight="bold"
                  >
                    BUNDLE & SAVE
                  </Text>
                  {/* Single Option */}
                  <Box
                    padding="300"
                    background="bg-surface-magic"
                    borderRadius="200"
                    borderWidth="025"
                    borderColor="border"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <InlineStack gap="200" blockAlign="center">
                        {/* <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: "2px solid #ddd",
                          }}
                        /> */}
                        <RadioButton
                          label=""
                          checked={bundleType === 'singleType'}
                          id="singleType"
                          name="bundleType"
                          onChange={handleBundleType}
                        />
                        <BlockStack gap="050">
                          <Text as="p" variant="bodyMd" fontWeight="semibold">
                            Single
                          </Text>
                          <Text as="p" variant="bodySm" tone="subdued">
                            Standard price
                          </Text>
                        </BlockStack>
                      </InlineStack>
                      <Text as="p" variant="headingMd" fontWeight="bold">
                        $10.00
                      </Text>
                    </InlineStack>
                  </Box>
                  {/* Duo Option - Most Popular */}
                  <Box
                    padding="300"
                    background="bg-fill-transparent-secondary"
                    borderRadius="100"
                    borderWidth="025"
                    borderColor="border-emphasis"
                    position="relative"
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-12px",
                        right: "20px",
                        background: "#000",
                        color: "#fff",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      Most Popular
                    </div>
                    <InlineStack align="space-between" blockAlign="center">
                      <InlineStack gap="200" blockAlign="center">
                        <RadioButton
                          label=""
                          checked={bundleType === 'duoType'}
                          id="duoType"
                          name="bundleType"
                          onChange={handleBundleType}
                        />
                        {/* <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: "2px solid #000",
                            background: "#000",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "#fff",
                            }}
                          />
                        </div> */}
                        <BlockStack gap="050">
                          <InlineStack gap="200" blockAlign="center">
                            <Text
                              as="p"
                              variant="bodyMd"
                              fontWeight="semibold"
                            >
                              Duo
                            </Text>
                            <div
                              style={{
                                background: "#e5e5e5",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: "600",
                              }}
                            >
                              SAVE $3.00
                            </div>
                          </InlineStack>
                          <Text as="p" variant="bodySm" tone="success">
                            You save 15%
                          </Text>
                        </BlockStack>
                      </InlineStack>
                      <BlockStack gap="050" inlineAlign="end">
                        <Text as="p" variant="headingMd" fontWeight="bold">
                          $17.00
                        </Text>
                        <Text
                          as="p"
                          variant="bodySm"
                          tone="subdued"
                          fontWeight="regular"
                        >
                          <s>$20.00</s>
                        </Text>
                      </BlockStack>
                    </InlineStack>
                  </Box>
                </BlockStack>
              </Box>

            </BlockStack>
          </Box>
          {/* Right part */}
          <Box width="50%">
            <BlockStack>
              <Text as="p" variant="headingMd" fontWeight="semibold">
                Product
              </Text>
              <InlineStack blockAlign="center">
                <Box width="65%">
                  <DataTable
                    columnContentTypes={[]}
                    headings={[]}
                    verticalAlign="middle"
                    rows={rows ? rows : [row]} />
                </Box>
                <Box width="30%">
                  <BlockStack align="start">
                    <SelectProductModal productArray={productArray} onSelect={handleReceiveProduct} title="Select Products" selectionMode="single" buttonText='Select a product' />
                  </BlockStack>
                </Box>
              </InlineStack>
            </BlockStack>
          </Box>
        </InlineStack>
      </Modal.Section>
    </Modal >
  );
}
