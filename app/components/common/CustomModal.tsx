import { Button, Modal, Box, BlockStack, Divider, Text, InlineStack, RangeSlider, TextField, ActionList, Popover, Icon, InlineGrid } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { PaintBrushRoundIcon, SettingsIcon, AlertCircleIcon } from "@shopify/polaris-icons";
import { ColorPickerPopoverItem } from "app/components/common/ColorPickerPopoverItem";
import { useLoaderData } from '@remix-run/react';
// import { ProductList } from '../product/ProductList';

export function CustomModal() {
  type ProductItem = {
    id: string;
    featuredImage?: string;
    title?: string | number | React.ReactNode;
    price?: string | number;
    compareAtPrice?: string | number;
  };

  const { products } = useLoaderData<{ products: ProductItem[] }>();
  const [active, setActive] = useState(false);
  const [heading, setHeading] = useState('Choose product');
  const [buttonText, setButtonText] = useState('Choose');
  const [primarybuttonSize, setPrimarybuttonSize] = useState<any>(16);
  const [textSize, setTextSize] = useState<any>(14);
  const [proTextValue, setProTextValue] = useState('');
  const [proActive, setProActive] = useState<any>(null);
  const [generalRadius, setGeneralRadius] = useState<any>(56);
  const handleModalChange = useCallback(() => setActive(!active), [active]);
  const handleClose = () => {
    handleModalChange();
  };
  const toggleProActive = (id: string) => () => {
    setProActive((activeId: string) => (activeId !== id ? id : null));
  };
  const addCluryDobule = () => {
    setProTextValue(prev => prev + "{{stack}}"); // append "abc"
  };
  const overlayColor = "#FF0000";
  const colorsPrice = "#FF0000";
  const compareAtPrice = "#FF0000";
  const colorsText = "#FF0000";
  const buttonColor = "#FF0000";
  const buttonTextColor = "#FF0000";
  //overlayColor
  const [selectedOverlayColor, setSelectedOverlayColor] = useState<string>("#999999"); // Default color
  const handleColoroverlayColor = (newColor: string) => {
    setSelectedOverlayColor(newColor);
  };
  const [selectedColorsPrice, setSelectedColorsPrice] = useState<string>("#000000"); // Default color
  const handleColorcolorsPrice = (newColor: string) => {
    setSelectedColorsPrice(newColor);
  };
  const [selectedCompareAtPrice, setSelectedCompareAtPrice] = useState<string>("#555555"); // Default color
  const handleColorcompareAtPrice = (newColor: string) => {
    setSelectedCompareAtPrice(newColor);
  };
  const [selectedColorsText, setSelectedColorsText] = useState<string>("#000000"); // Default color
  const handleColorcolorsText = (newColor: string) => {
    setSelectedColorsText(newColor);
  };
  const [selectedButtonColor, setSelectedButtonColor] = useState<string>("#ff0000"); // Default color
  const handleColorbuttonColor = (newColor: string) => {
    setSelectedButtonColor(newColor);
  };
  const [selectedButtonTextColor, setSelectedButtonTextColor] = useState<string>("#FFFFFF"); // Default color
  const handleColorbuttonTextColor = (newColor: string) => {
    setSelectedButtonTextColor(newColor);
  };

  const activator = <Button onClick={handleModalChange} icon={PaintBrushRoundIcon} fullWidth>Customize "Choose product" modal</Button>;

  return (
    <Box width='100%'>
      <Modal
        activator={activator}
        open={active}
        onClose={handleClose}
        title="Custom Modal"
        primaryAction={{
          content: 'Apply',
          onAction: handleClose,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleClose,
          },
        ]}
      >
        <Modal.Section>
          <InlineGrid columns={2} gap="400">
            {/* {left layout} */}
            <BlockStack gap="200">
              {/* {custom modal style} */}
              <Text as="p" variant="bodyMd" fontWeight="semibold">
                Style
              </Text>
              <BlockStack gap="200">
                <InlineStack gap="200">
                  <Box width='47%'>
                    <BlockStack gap="200" inlineAlign="stretch">
                      <Text as="p" variant="bodySm">Primary button size</Text>
                      <InlineStack gap="0" align="space-between" blockAlign="center">
                        <div style={{ width: "65%" }}>
                          <RangeSlider
                            value={Number(primarybuttonSize)} // Make sure 'cornerRadius' is already a number
                            onChange={(v: number) => setPrimarybuttonSize(v)} // The 'onChange' should expect a number
                            min={0}
                            max={40}
                            label
                            output
                          />
                        </div>
                        <Box width="100%" minHeight="32px">
                          <TextField
                            autoComplete="off"
                            value={`${primarybuttonSize}`} // Convert the number to a string
                            onChange={setPrimarybuttonSize} // Convert the string back to a number
                            min={0}
                            max={40}
                            suffix="px"
                            label
                          />
                        </Box>
                      </InlineStack>
                    </BlockStack>
                  </Box>
                  <Box width='47%'>
                    <BlockStack gap="200" inlineAlign="stretch">
                      <Text as="p" variant="bodySm">Text size</Text>
                      <InlineStack gap="0" align="space-between" blockAlign="center">
                        <div style={{ width: "65%" }}>
                          <RangeSlider
                            value={Number(textSize)} // Make sure 'cornerRadius' is already a number
                            onChange={(v: number) => setTextSize(v)} // The 'onChange' should expect a number
                            min={0}
                            max={40}
                            label
                            output
                          />
                        </div>
                        <Box width="100%" minHeight="32px">
                          <TextField
                            autoComplete="off"
                            value={`${textSize}`} // Convert the number to a string
                            onChange={setTextSize} // Convert the string back to a number
                            min={0}
                            max={40}
                            suffix="px"
                            label
                          />
                        </Box>
                      </InlineStack>
                    </BlockStack>
                  </Box>
                </InlineStack>
              </BlockStack>
              <Divider />

              {/* { custom modal colors} */}
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd" fontWeight="semibold">
                  Colors
                </Text>
                <BlockStack gap="200">
                  <InlineGrid columns={3} gap="200">
                    <ColorPickerPopoverItem subtitle="Overlay Color" defaultColorSetting={overlayColor} colorWidth="100%" onColorChange={handleColoroverlayColor} />
                    <ColorPickerPopoverItem subtitle="Price" defaultColorSetting={colorsPrice} colorWidth="100%" onColorChange={handleColorcolorsPrice} />
                    <ColorPickerPopoverItem subtitle="Compare-at price" defaultColorSetting={compareAtPrice} colorWidth="100%" onColorChange={handleColorcompareAtPrice} />
                  </InlineGrid>

                  <InlineGrid columns={3} gap="200">
                    <ColorPickerPopoverItem subtitle="Text" defaultColorSetting={colorsText} colorWidth="100%" onColorChange={handleColorcolorsText} />
                    <ColorPickerPopoverItem subtitle="Button Color" defaultColorSetting={buttonColor} colorWidth="100%" onColorChange={handleColorbuttonColor} />
                    <ColorPickerPopoverItem subtitle="Button text color" defaultColorSetting={buttonTextColor} colorWidth="100%" onColorChange={handleColorbuttonTextColor} />
                  </InlineGrid>

                </BlockStack>

              </BlockStack>
              <Divider />
              {/* {custome modal settings} */}
              <Text as="p" variant="bodyMd" fontWeight="semibold">
                Settings
              </Text>
              <BlockStack gap="200">
                <TextField
                  label="Heading"
                  value={heading}
                  onChange={setHeading}
                  autoComplete="off"
                />
                <InlineGrid columns={2} gap='200'>
                  {/* {message text} */}
                  <BlockStack>
                    <Box>
                      <InlineStack align='space-between'>
                        <Text as='p'>Message text</Text>
                        <Popover
                          active={proActive === 'popover'}
                          preferredAlignment="right"
                          activator={
                            <Button
                              variant="tertiary"
                              onClick={toggleProActive('popover')}
                              icon={SettingsIcon}
                              accessibilityLabel="Other save actions"
                            />
                          }
                          autofocusTarget="first-node"
                          onClose={toggleProActive('popover')}
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
                    </Box>
                    <TextField
                      label
                      value={proTextValue}
                      onChange={setProTextValue}
                      autoComplete="off"
                    />
                  </BlockStack>
                  {/* {button text} */}
                  <BlockStack gap='200'>
                    <Text as='p'>
                      Button text
                    </Text>
                    <TextField
                      label
                      value={buttonText}
                      onChange={setButtonText}
                      autoComplete="off"
                    />
                  </BlockStack>
                </InlineGrid>
              </BlockStack>
              {/* {product photo size} */}
              <BlockStack gap="200">
                <Box>
                  <BlockStack gap="200" inlineAlign="stretch">
                    <Text as="p" variant="bodySm">Product photo size</Text>
                    <InlineStack gap="0" align="space-between" blockAlign="center">
                      <div style={{ width: "65%" }}>
                        <RangeSlider
                          value={Number(generalRadius)} // Make sure 'cornerRadius' is already a number
                          onChange={(v: number) => setGeneralRadius(v)} // The 'onChange' should expect a number
                          min={0}
                          max={75}
                          label
                          output
                        />
                      </div>
                      <Box width="30%" minHeight="32px">
                        <TextField
                          autoComplete="off"
                          value={`${generalRadius}`} // Convert the number to a string
                          onChange={setGeneralRadius} // Convert the string back to a number
                          min={0}
                          max={200}
                          suffix="px"
                          label
                        />
                      </Box>
                    </InlineStack>
                  </BlockStack>
                </Box>
                {/* <ProductList /> */}

              </BlockStack>
            </BlockStack>

            {/* {right layout} */}
            <BlockStack>
              <div className='customProductMain'>
                <Text as="p" variant="bodyMd" fontWeight="semibold">
                  Preview
                </Text>
                <div className='ProductViewheadingContainer' style={{ background: selectedOverlayColor }}>
                  <div className='ProductViewHeading' >
                    <h5 style={{ fontWeight: 'bold', color: selectedColorsText }}>
                      {heading}
                    </h5>
                    <BlockStack gap="200">
                      {products.map((product) => (
                        <div className='customStyleProduct' key={product.id}>
                          <InlineStack align='center' blockAlign='center' gap='200'>
                            <div className='productImageContainer' style={{ width: generalRadius, height: generalRadius }}>
                              <img className='productImage' src={product.imageUrl} alt={typeof product.title === 'string' ? product.title : ''} />
                            </div>
                            <div className='productTitleContainer'>
                              <h2 className='porductTitle' style={{ fontSize: textSize, color: selectedColorsText }}>
                                {String(product.title ?? '')}
                              </h2>
                              <div className='productPriceContainer'>
                                <span className='productPrice' style={{ color: selectedColorsPrice }}>{String(product.price ?? '')}</span>
                                <span className='productComparePrice' style={{ color: selectedCompareAtPrice }}>{String(product.compareAtPrice ?? '')}</span>
                              </div>
                            </div>
                          </InlineStack>
                          <InlineStack>
                            <div className='productChooseButton' style={{ fontSize: primarybuttonSize, backgroundColor: selectedButtonColor, color: selectedButtonTextColor }}>
                              {buttonText}
                            </div>
                          </InlineStack>
                        </div>
                      ))}
                    </BlockStack>
                  </div>
                </div>

              </div>
            </BlockStack>
          </InlineGrid>

        </Modal.Section>
      </Modal>
    </Box>
  );
}