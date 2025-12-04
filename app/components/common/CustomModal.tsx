import {
  Button,
  Modal,
  Box,
  BlockStack,
  Divider,
  Text,
  InlineStack,
  RangeSlider,
  TextField,
  InlineGrid,
} from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { PaintBrushRoundIcon, SettingsIcon, AlertCircleIcon } from "@shopify/polaris-icons";
import { ColorPickerPopoverItem } from "app/components/common/ColorPickerPopoverItem";
import { useLoaderData } from '@remix-run/react';
import { loader } from '../product/ProductList';
import { PopUpover } from './PopUpover';
// import { ProductList } from '../product/ProductList';

export function CustomModal({ onSave }) {

  const loaderData = useLoaderData<typeof loader>();
  const products = loaderData.products;
  const conf = loaderData.generalVolumeConf;
  const [active, setActive] = useState(false);
  const [heading, setHeading] = useState(conf.customHeadingText);
  const [buttonText, setButtonText] = useState(conf.customButtonText);
  const [primaryButtonSize, setPrimarybuttonSize] = useState<any>(conf.customButtonSize);
  const [textSize, setTextSize] = useState<any>(conf.customTextSize);
  const [customPhotoSize, setCustomPhotoSize] = useState<any>(conf.customButtonSize);
  const [customMessageText, setCustomMessageText] = useState(conf.customMessageText);
  const handleModalChange = useCallback(() => setActive(!active), [active]);

  const handlePopupTextChange = (text) => {
    setCustomMessageText(text);
  }
  const handleClose = () => {
    handleModalChange();
  };
  const handleApply = () => {
    const dataLoad = {
      heading,
      buttonText,
      primaryButtonSize,
      textSize,
      customPhotoSize,
      customMessageText,
      overlayColor,
      priceColor,
      compareAtPriceColor,
      textColor,
      buttonColor,
      buttonTextColor,
    };
    onSave(dataLoad);
    handleModalChange();
  }

  const [overlayColor, setOverlayColor] = useState<string>(conf.customOverlayColor); // Default color
  const [priceColor, setPriceColor] = useState<string>(conf.customPriceColor); // Default color
  const [compareAtPriceColor, setCompareAtPriceColor] = useState<string>(conf.customCompareAtPriceColor); // Default color
  const [textColor, setTextColor] = useState<string>(conf.customTextColor); // Default color
  const [buttonColor, setButtonColor] = useState<string>(conf.customButtonColor); // Default color
  const [buttonTextColor, setButtonTextColor] = useState<string>(conf.customButtonTextColor); // Default color
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
          onAction: handleApply,
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
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                Style
              </Text>
              <BlockStack gap="200">
                <InlineStack gap="200">
                  <Box width='47%'>
                    <BlockStack gap="200" inlineAlign="stretch">
                      <Text as="span" variant="bodySm">Primary button size</Text>
                      <InlineStack gap="0" align="space-between" blockAlign="center">
                        <div style={{ width: "65%" }}>
                          <RangeSlider
                            value={Number(primaryButtonSize)}
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
                            value={`${primaryButtonSize}`} // Convert the number to a string
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
                      <Text as="span" variant="bodySm">Text size</Text>
                      <InlineStack gap="0" align="space-between" blockAlign="center">
                        <div style={{ width: "65%" }}>
                          <RangeSlider
                            value={Number(textSize)}
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
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Colors
                </Text>
                <BlockStack gap="200">
                  <InlineGrid columns={3} gap="200">
                    <ColorPickerPopoverItem subtitle="Overlay Color" defaultColorSetting={overlayColor} colorWidth="100%" onColorChange={setOverlayColor} />
                    <ColorPickerPopoverItem subtitle="Price" defaultColorSetting={priceColor} colorWidth="100%" onColorChange={setPriceColor} />
                    <ColorPickerPopoverItem subtitle="Compare-at price" defaultColorSetting={compareAtPriceColor} colorWidth="100%" onColorChange={setCompareAtPriceColor} />
                  </InlineGrid>
                  <InlineGrid columns={3} gap="200">
                    <ColorPickerPopoverItem subtitle="Text" defaultColorSetting={textColor} colorWidth="100%" onColorChange={setTextColor} />
                    <ColorPickerPopoverItem subtitle="Button Color" defaultColorSetting={buttonColor} colorWidth="100%" onColorChange={setButtonColor} />
                    <ColorPickerPopoverItem subtitle="Button text color" defaultColorSetting={buttonTextColor} colorWidth="100%" onColorChange={setButtonTextColor} />
                  </InlineGrid>
                </BlockStack>

              </BlockStack>
              <Divider />
              {/* {custome modal settings} */}
              <Text as="span" variant="bodyMd" fontWeight="semibold">
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
                  <PopUpover title='Subtitle' upPopTextChange={handlePopupTextChange} defaultPopText={conf.customMessageText} dataArray={products} />
                  {/* {button text} */}
                  <BlockStack gap='200'>
                    <Text as='span'>
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
                    <Text as="span" variant="bodySm">Product photo size</Text>
                    <InlineStack gap="0" align="space-between" blockAlign="center">
                      <div style={{ width: "65%" }}>
                        <RangeSlider
                          value={Number(customPhotoSize)}
                          onChange={(v: number) => setCustomPhotoSize(v)} // The 'onChange' should expect a number
                          min={0}
                          max={75}
                          label
                          output
                        />
                      </div>
                      <Box width="30%" minHeight="32px">
                        <TextField
                          autoComplete="off"
                          value={`${customPhotoSize}`} // Convert the number to a string
                          onChange={setCustomPhotoSize} // Convert the string back to a number
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
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Preview
                </Text>
                <div className='ProductViewheadingContainer' style={{ background: overlayColor }}>
                  <div className='ProductViewHeading' >
                    <h5 style={{ fontWeight: 'bold', color: textColor }}>
                      {heading}
                    </h5>
                    <BlockStack gap="200">
                      {products.map((product) => (
                        <div className='customStyleProduct' key={product.id}>
                          <InlineStack align='center' blockAlign='center' gap='200'>
                            <div className='productImageContainer' style={{ width: customPhotoSize, height: customPhotoSize }}>
                              <img className='productImage' src={product.imageUrl} alt={typeof product.title === 'string' ? product.title : ''} />
                            </div>
                            <div className='productTitleContainer'>
                              <h2 className='porductTitle' style={{ fontSize: textSize, color: textColor }}>
                                {String(product.title ?? '')}
                              </h2>
                              <div className='productPriceContainer'>
                                <span className='productPrice' style={{ color: priceColor }}>{String(product.price ?? '')}</span>
                                <span className='productComparePrice' style={{ color: compareAtPriceColor }}>{String(product.compareAtPriceColor ?? '')}</span>
                              </div>
                            </div>
                          </InlineStack>
                          <InlineStack>
                            <div className='productChooseButton' style={{ fontSize: primaryButtonSize, backgroundColor: buttonColor, color: buttonTextColor }}>
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