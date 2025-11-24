// app/routes/app.bundles.new.tsx
import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  Grid,
  Text,
  Badge,
  Button,
  InlineStack,
  BlockStack,
  Select,
  Checkbox,
} from "@shopify/polaris";

export default function NewBundle() {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState("#000000");

  const colorThemes = [
    "#000000",
    "#FF0000",
    "#FFA500",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#800080",
    "#FF1493",
  ];

  const getBackgroundColor = (isSelected: boolean) => {
    if (isSelected) return "#FFFFFF";
    const r = parseInt(selectedColor.slice(1, 3), 16);
    const g = parseInt(selectedColor.slice(3, 5), 16);
    const b = parseInt(selectedColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  };

  const getBorderStyle = (isSelected: boolean) => {
    return isSelected ? `2px solid ${selectedColor}` : "1px solid #e5e7eb";
  };

  const getRadioStyle = (checked: boolean) => {
    let accentColor = selectedColor;
    if (checked) {
      const r = parseInt(selectedColor.slice(1, 3), 16);
      const g = parseInt(selectedColor.slice(3, 5), 16);
      const b = parseInt(selectedColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      if (brightness > 200) {
        const darkenFactor = 0.7;
        const newR = Math.floor(r * darkenFactor);
        const newG = Math.floor(g * darkenFactor);
        const newB = Math.floor(b * darkenFactor);
        accentColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
      }
    }

    return {
      width: "20px",
      height: "20px",
      marginTop: "2px",
      cursor: "pointer",
      accentColor: checked ? accentColor : undefined,
      flexShrink: 0
    };
  };

  // Single Bundle Card Component
  const SingleBundleCard = () => {
    const [color1, setColor1] = useState("Black");
    const [color2, setColor2] = useState("Black");
    const [selectedOption, setSelectedOption] = useState("duo");

    return (
      <Card>
        <div style={{
          padding: "16px",
          minHeight: "420px",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ flex: 1 }}>
            <BlockStack gap="300">
              {/* Single Option */}
              <div style={{
                border: getBorderStyle(selectedOption === "single"),
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: getBackgroundColor(selectedOption === "single"),
                position: "relative"
              }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="single-bundle-type"
                    style={getRadioStyle(selectedOption === "single")}
                    checked={selectedOption === "single"}
                    onChange={() => setSelectedOption("single")}
                  />
                  <div style={{ flex: 1 }}>
                    <InlineStack align="space-between" blockAlign="start">
                      <div>
                        <Text as="p" variant="headingMd" fontWeight="semibold">
                          Single
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Standard price
                        </Text>
                      </div>
                      <Text as="p" variant="headingLg" fontWeight="bold">
                        $49.99
                      </Text>
                    </InlineStack>
                  </div>
                </label>
              </div>

              {/* Duo Option */}
              <div style={{
                border: getBorderStyle(selectedOption === "duo"),
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: getBackgroundColor(selectedOption === "duo"),
                position: "relative"
              }}>
                {selectedOption === "duo" && (
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
                )}
                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="single-bundle-type"
                    style={getRadioStyle(selectedOption === "duo")}
                    checked={selectedOption === "duo"}
                    onChange={() => setSelectedOption("duo")}
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

                    {selectedOption === "duo" && (
                      <div style={{ marginTop: "16px" }}>
                        <Text as="p" variant="bodyMd" fontWeight="medium">
                          Color
                        </Text>
                        <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                          <div style={{ flex: 1 }}>
                            <Text as="p" variant="bodySm" tone="subdued">
                              #1
                            </Text>
                            <Select
                              label=""
                              options={[
                                { label: "Black", value: "Black" },
                                { label: "White", value: "White" },
                                { label: "Red", value: "Red" },
                              ]}
                              value={color1}
                              onChange={setColor1}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <Text as="p" variant="bodySm" tone="subdued">
                              #2
                            </Text>
                            <Select
                              label=""
                              options={[
                                { label: "Black", value: "Black" },
                                { label: "White", value: "White" },
                                { label: "Red", value: "Red" },
                              ]}
                              value={color2}
                              onChange={setColor2}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </BlockStack>
          </div>

          <div style={{ marginTop: "16px" }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <Text as="p" variant="headingMd" fontWeight="semibold">
                Quantity breaks for the same product
              </Text>
            </div>
            <Button variant="primary" fullWidth onClick={() => navigate("/app/bundles/choose")}>
              Choose
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // BOGO Bundle Card Component
  const BOGOBundleCard = () => {
    const [freeGift, setFreeGift] = useState(true);
    const [selectedOption, setSelectedOption] = useState("buy1get1");

    return (
      <Card>
        <div style={{
          padding: "16px",
          minHeight: "420px",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ flex: 1 }}>
            <BlockStack gap="300">
              <div style={{
                border: getBorderStyle(selectedOption === "buy1get1"),
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: getBackgroundColor(selectedOption === "buy1get1")
              }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="bogo-option"
                    style={getRadioStyle(selectedOption === "buy1get1")}
                    checked={selectedOption === "buy1get1"}
                    onChange={() => setSelectedOption("buy1get1")}
                  />
                  <InlineStack align="space-between" blockAlign="center" gap="400">
                    <div>
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        Buy 1, get 1 free
                      </Text>
                      <Badge tone="attention" size="small">SAVE 50%</Badge>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Text as="p" variant="headingMd" fontWeight="bold">
                        $49.99
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        <s>$99.98</s>
                      </Text>
                    </div>
                  </InlineStack>
                </label>
              </div>

              <div style={{
                border: getBorderStyle(selectedOption === "buy2get3"),
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: getBackgroundColor(selectedOption === "buy2get3")
              }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="bogo-option"
                    style={getRadioStyle(selectedOption === "buy2get3")}
                    checked={selectedOption === "buy2get3"}
                    onChange={() => setSelectedOption("buy2get3")}
                  />
                  <InlineStack align="space-between" blockAlign="center" gap="400">
                    <div>
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        Buy 2, get 3 free
                      </Text>
                      <Badge tone="success" size="small">SAVE 60%</Badge>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Text as="p" variant="headingMd" fontWeight="bold">
                        $99.98
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        <s>$249.95</s>
                      </Text>
                    </div>
                  </InlineStack>
                </label>
              </div>

              <div style={{
                border: getBorderStyle(selectedOption === "buy3get6"),
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: getBackgroundColor(selectedOption === "buy3get6")
              }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="bogo-option"
                    style={getRadioStyle(selectedOption === "buy3get6")}
                    checked={selectedOption === "buy3get6"}
                    onChange={() => setSelectedOption("buy3get6")}
                  />
                  <InlineStack align="space-between" blockAlign="center" gap="400">
                    <div>
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        Buy 3, get 6 free
                      </Text>
                      <Badge tone="success" size="small">SAVE 67%</Badge>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Text as="p" variant="headingMd" fontWeight="bold">
                        $149.97
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        <s>$449.91</s>
                      </Text>
                    </div>
                  </InlineStack>
                </label>
              </div>

              <div style={{ backgroundColor: "#e5e7eb", padding: "12px", borderRadius: "8px" }}>
                <Checkbox label="+ FREE special gift!" checked={freeGift} onChange={setFreeGift} />
              </div>
            </BlockStack>
          </div>

          <div style={{ marginTop: "16px" }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <Text as="p" variant="headingMd" fontWeight="semibold">
                Quantity breaks for different products
              </Text>
            </div>
            <Button variant="primary" fullWidth onClick={() => navigate("/app/bundles/new/bogo")} >
              Choose
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // Quantity Breaks Bundle Card Component
  const QuantityBreaksBundleCard = () => {
    const [selectedPack, setSelectedPack] = useState(2);
    const [color, setColor] = useState("Black");

    return (
      <Card>
        <div style={{
          padding: "16px",
          minHeight: "420px",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ flex: 1 }}>
            <BlockStack gap="300">
              <div style={{
                border: getBorderStyle(selectedPack === 1),
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: getBackgroundColor(selectedPack === 1)
              }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="quantity-pack"
                    style={getRadioStyle(selectedPack === 1)}
                    checked={selectedPack === 1}
                    onChange={() => setSelectedPack(1)}
                  />
                  <InlineStack align="space-between" blockAlign="start" gap="400">
                    <div>
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        1 pack
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Standard price
                      </Text>
                    </div>
                    <Text as="p" variant="headingMd" fontWeight="bold">
                      $49.99
                    </Text>
                  </InlineStack>
                </label>
              </div>

              <div style={{
                border: getBorderStyle(selectedPack === 2),
                borderRadius: "8px",
                padding: "12px",
                position: "relative",
                backgroundColor: getBackgroundColor(selectedPack === 2)
              }}>
                {selectedPack === 2 && (
                  <div style={{ position: "absolute", top: "-12px", right: "16px" }}>
                    <Badge tone="attention">MOST POPULAR</Badge>
                  </div>
                )}
                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="quantity-pack"
                    checked={selectedPack === 2}
                    style={getRadioStyle(selectedPack === 2)}
                    onChange={() => setSelectedPack(2)}
                  />
                  <div style={{ flex: 1 }}>
                    <InlineStack align="space-between" blockAlign="start">
                      <div>
                        <Text as="p" variant="bodyMd" fontWeight="semibold">
                          2 pack
                        </Text>
                        <Badge tone="success" size="small">SAVE 15%</Badge>
                        <Text as="p" variant="bodySm" tone="subdued">
                          You save $14.99
                        </Text>
                        <div style={{ marginTop: "12px" }}>
                          <Text as="p" variant="bodySm" fontWeight="medium">
                            Make time for Brain, Body & Beauty!
                          </Text>
                          <Select
                            label=""
                            options={[
                              { label: "Black", value: "Black" },
                              { label: "White", value: "White" },
                            ]}
                            value={color}
                            onChange={setColor}
                            placeholder="Black"
                          />
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Text as="p" variant="headingMd" fontWeight="bold">
                          $84.99
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          <s>$99.98</s>
                        </Text>
                      </div>
                    </InlineStack>
                    <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        width: "40px",
                        height: "40px",
                        border: "2px dashed #d1d5db",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Text as="p" variant="headingLg">?</Text>
                      </div>
                      <Button variant="primary" size="slim">Choose</Button>
                    </div>
                  </div>
                </label>
              </div>
            </BlockStack>
          </div>

          <div style={{ marginTop: "16px" }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <Text as="p" variant="headingMd" fontWeight="semibold">
                Quantity breaks for different products
              </Text>
            </div>
            <Button variant="primary" fullWidth onClick={() => navigate("/app/bundles/new/quantity-breaks")} >
              Choose
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // Complete Bundle Card Component
  const CompleteBundleCard = () => {
    const [selectedOption, setSelectedOption] = useState("complete");

    return (
      <Card>
        <div style={{
          padding: "16px",
          minHeight: "580px",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ flex: 1 }}>
            <BlockStack gap="300">
              <div style={{
                border: getBorderStyle(selectedOption === "standard"),
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: getBackgroundColor(selectedOption === "standard")
              }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="complete-option"
                    checked={selectedOption === "standard"}
                    style={getRadioStyle(selectedOption === "standard")}
                    onChange={() => setSelectedOption("standard")}
                  />
                  <InlineStack align="space-between" blockAlign="center" gap="400">
                    <div>
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        Make time for Brain, Body & Beauty!
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Standard price
                      </Text>
                    </div>
                    <Text as="p" variant="headingMd" fontWeight="bold">
                      $49.99
                    </Text>
                  </InlineStack>
                </label>
              </div>

              <div style={{
                border: getBorderStyle(selectedOption === "complete"),
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: getBackgroundColor(selectedOption === "complete")
              }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="complete-option"
                    style={getRadioStyle(selectedOption === "complete")}
                    checked={selectedOption === "complete"}
                    onChange={() => setSelectedOption("complete")}
                  />
                  <div style={{ flex: 1 }}>
                    <InlineStack align="space-between" blockAlign="start">
                      <div>
                        <Text as="p" variant="bodyMd" fontWeight="semibold">
                          Complete the bundle
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Save $15.99!
                        </Text>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Text as="p" variant="headingMd" fontWeight="bold">
                          $64.00
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          <s>$79.99</s>
                        </Text>
                      </div>
                    </InlineStack>

                    <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ border: "1px solid #e1e3e5", borderRadius: "8px", padding: "8px", backgroundColor: "#FFFFFF" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              <div style={{
                                width: "60px",
                                height: "60px",
                                backgroundColor: "#e5e7eb",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}>
                                <span style={{ fontSize: "32px" }}>⌚</span>
                              </div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <Text as="p" variant="bodySm" fontWeight="medium">
                                Make time for Brain, Body & Beauty!
                              </Text>
                              <div style={{ marginTop: "4px" }}>
                                <Text as="p" variant="bodyMd" fontWeight="bold">
                                  $40.00
                                </Text>
                                <Text as="p" variant="bodySm" tone="subdued">
                                  <s>$49.99</s>
                                </Text>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ width: "24px", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "20px" }}>
                        <span style={{ fontSize: "18px", color: "#FF69B4" }}>➕</span>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ border: "1px solid #e1e3e5", borderRadius: "8px", padding: "8px", backgroundColor: "#FFFFFF" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              <div style={{
                                width: "60px",
                                height: "60px",
                                backgroundColor: "#e5e7eb",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}>
                                <span style={{ fontSize: "32px" }}>🩳</span>
                              </div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <Text as="p" variant="bodySm" fontWeight="medium">
                                Shorts
                              </Text>
                              <div style={{ marginTop: "4px" }}>
                                <Text as="p" variant="bodyMd" fontWeight="bold">
                                  $24.00
                                </Text>
                                <Text as="p" variant="bodySm" tone="subdued">
                                  <s>$30.00</s>
                                </Text>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </BlockStack>
          </div>

          <div style={{ marginTop: "16px" }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <Text as="p" variant="headingMd" fontWeight="semibold">
                Complete the bundle
              </Text>
            </div>
            <Button variant="primary" fullWidth onClick={() => navigate("/app/bundles/new/complete")}>
              Choose
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // Subscription Bundle Card Component
  const SubscriptionBundleCard = () => {
    const [subscribe, setSubscribe] = useState(false);
    const [selectedOption, setSelectedOption] = useState("buy1get1");

    return (
      <Card>
        <div style={{
          padding: "16px",
          minHeight: "580px",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ flex: 1 }}>
            <BlockStack gap="300">
              <div style={{
                border: getBorderStyle(selectedOption === "buy1get1"),
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: getBackgroundColor(selectedOption === "buy1get1")
              }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="subscription-option"
                    style={getRadioStyle(selectedOption === "buy1get1")}
                    checked={selectedOption === "buy1get1"}
                    onChange={() => setSelectedOption("buy1get1")}
                  />
                  <InlineStack align="space-between" blockAlign="center" gap="400">
                    <div>
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        Buy 1, get 1 free
                      </Text>
                      <Badge tone="success" size="small">SAVE 55%</Badge>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Text as="p" variant="headingMd" fontWeight="bold">
                        $44.99
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        <s>$99.98</s>
                      </Text>
                    </div>
                  </InlineStack>
                </label>
              </div>

              <div style={{
                border: getBorderStyle(selectedOption === "buy2get3"),
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: getBackgroundColor(selectedOption === "buy2get3")
              }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="subscription-option"
                    style={getRadioStyle(selectedOption === "buy2get3")}
                    checked={selectedOption === "buy2get3"}
                    onChange={() => setSelectedOption("buy2get3")}
                  />
                  <InlineStack align="space-between" blockAlign="center" gap="400">
                    <div>
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        Buy 2, get 3 free
                      </Text>
                      <Badge tone="success" size="small">SAVE 64%</Badge>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Text as="p" variant="headingMd" fontWeight="bold">
                        $89.98
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        <s>$249.95</s>
                      </Text>
                    </div>
                  </InlineStack>
                </label>
              </div>

              <div style={{
                border: getBorderStyle(selectedOption === "buy3get6"),
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: getBackgroundColor(selectedOption === "buy3get6")
              }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="subscription-option"
                    style={getRadioStyle(selectedOption === "buy3get6")}
                    checked={selectedOption === "buy3get6"}
                    onChange={() => setSelectedOption("buy3get6")}
                  />
                  <InlineStack align="space-between" blockAlign="center" gap="400">
                    <div>
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        Buy 3, get 6 free
                      </Text>
                      <Badge tone="success" size="small">SAVE 70%</Badge>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Text as="p" variant="headingMd" fontWeight="bold">
                        $134.97
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        <s>$449.91</s>
                      </Text>
                    </div>
                  </InlineStack>
                </label>
              </div>

              <div style={{ backgroundColor: "#e5e7eb", padding: "12px", borderRadius: "8px" }}>
                <Checkbox label="+ FREE special gift!" checked={true} onChange={() => { }} />
              </div>

              <div style={{ border: "2px dashed #d1d5db", padding: "12px", borderRadius: "8px" }}>
                <Checkbox
                  label={
                    <div>
                      <Text as="span" fontWeight="semibold">Subscribe & Save 20%</Text>
                      <br />
                      <Text as="span" variant="bodySm" tone="subdued">Delivered weekly</Text>
                    </div>
                  }
                  checked={subscribe}
                  onChange={setSubscribe}
                />
              </div>
            </BlockStack>
          </div>

          <div style={{ marginTop: "16px" }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <Text as="p" variant="headingMd" fontWeight="semibold">
                Subscription
              </Text>
            </div>
            <Button variant="primary" fullWidth onClick={() => navigate("/app/bundles/new/subscription")} >
              Choose
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // Progressive Gifts Bundle Card Component
  const ProgressiveGiftsBundleCard = () => {
    const [selectedPack, setSelectedPack] = useState(2);

    return (
      <Card>
        <div style={{
          padding: "16px",
          minHeight: "580px",
          display: "flex",
          flexDirection: "column"
        }}>
          <BlockStack gap="300">
            <div style={{
              border: getBorderStyle(selectedPack === 1),
              borderRadius: "8px",
              padding: "12px",
              backgroundColor: getBackgroundColor(selectedPack === 1)
            }}>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="progressive-pack"
                  style={getRadioStyle(selectedPack === 1)}
                  checked={selectedPack === 1}
                  onChange={() => setSelectedPack(1)}
                />
                <InlineStack align="space-between" blockAlign="center" gap="400">
                  <div>
                    <Text as="p" variant="bodyMd" fontWeight="semibold">
                      1 pack
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Standard price
                    </Text>
                  </div>
                  <Text as="p" variant="headingMd" fontWeight="bold">
                    $49.99
                  </Text>
                </InlineStack>
              </label>
            </div>

            <div style={{
              border: getBorderStyle(selectedPack === 2),
              borderRadius: "8px",
              padding: "12px",
              position: "relative",
              backgroundColor: getBackgroundColor(selectedPack === 2)
            }}>
              {selectedPack === 2 && (
                <div style={{ position: "absolute", top: "-12px", right: "16px" }}>
                  <Badge tone="attention">MOST POPULAR</Badge>
                </div>
              )}
              <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="progressive-pack"
                  checked={selectedPack === 2}
                  style={getRadioStyle(selectedPack === 2)}
                  onChange={() => setSelectedPack(2)}
                />
                <InlineStack align="space-between" blockAlign="center" gap="400">
                  <div>
                    <Text as="p" variant="bodyMd" fontWeight="semibold">
                      2 pack
                    </Text>
                    <Badge tone="success" size="small">SAVE 15%</Badge>
                    <Text as="p" variant="bodySm" tone="subdued">
                      You save $14.99
                    </Text>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Text as="p" variant="headingMd" fontWeight="bold">
                      $84.99
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      <s>$99.98</s>
                    </Text>
                  </div>
                </InlineStack>
              </label>
            </div>

            <div style={{
              border: getBorderStyle(selectedPack === 3),
              borderRadius: "8px",
              padding: "12px",
              backgroundColor: getBackgroundColor(selectedPack === 3)
            }}>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                <input
                  type="radio"
                  name="progressive-pack"
                  style={getRadioStyle(selectedPack === 3)}
                  checked={selectedPack === 3}
                  onChange={() => setSelectedPack(3)}
                />
                <InlineStack align="space-between" blockAlign="center" gap="400">
                  <div>
                    <Text as="p" variant="bodyMd" fontWeight="semibold">
                      3 pack
                    </Text>
                    <Badge tone="success" size="small">SAVE 15%</Badge>
                    <Text as="p" variant="bodySm" tone="subdued">
                      You save $22.49
                    </Text>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Text as="p" variant="headingMd" fontWeight="bold">
                      $127.48
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      <s>$149.97</s>
                    </Text>
                  </div>
                </InlineStack>
              </label>
            </div>

            <div style={{
              backgroundColor: "#fef3c7",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #fbbf24"
            }}>
              <Text as="p" variant="bodyMd" fontWeight="semibold">
                🎁 Unlock Free gifts with your order
              </Text>
              <div style={{ marginTop: "12px", display: "flex", gap: "12px", justifyContent: "space-around" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: selectedPack >= 1 ? "#d1fae5" : "#f3f4f6",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 8px",
                    fontSize: "24px"
                  }}>
                    {selectedPack >= 1 ? "🚚" : "🔒"}
                  </div>
                  <Text as="p" variant="bodySm" fontWeight="medium">
                    FREE
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Free shipping
                  </Text>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: selectedPack >= 2 ? "#d1fae5" : "#f3f4f6",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 8px",
                    border: "1px solid #e5e7eb"
                  }}>
                    {selectedPack >= 2 ? (
                      <div style={{ fontSize: "24px" }}>🩳</div>
                    ) : (
                      <span style={{ fontSize: "20px" }}>🔒</span>
                    )}
                  </div>
                  <Text as="p" variant="bodySm" fontWeight="medium">
                    {selectedPack >= 2 ? "FREE" : "FREE 2+"}
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Shorts
                  </Text>
                  {selectedPack >= 2 && (
                    <Select
                      label=""
                      options={[
                        { label: "Small", value: "Small" },
                        { label: "Medium", value: "Medium" },
                      ]}
                      value="Small"
                      onChange={() => { }}
                    />
                  )}
                </div>

                <div style={{ textAlign: "center", opacity: selectedPack >= 3 ? 1 : 0.4 }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 8px",
                    fontSize: "24px"
                  }}>
                    🔒
                  </div>
                  <Text as="p" variant="bodySm" fontWeight="medium">
                    FREE 3+
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Locked
                  </Text>
                </div>
              </div>
            </div>
          </BlockStack>

          <div style={{ marginTop: "16px" }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <Text as="p" variant="headingMd" fontWeight="semibold">
                Progressive gifts
              </Text>
            </div>
            <Button variant="primary" fullWidth onClick={() => navigate("/app/bundles/new/multi-pack")} >
              Choose
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Page
      title="Choose a discount type"
      subtitle="You can fully customize it later."
      backAction={{ onAction: () => navigate("/app") }}
    >
      <Layout>
        <Layout.Section>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
            <InlineStack gap="200" blockAlign="center">
              <Text as="span">Color theme</Text>
              {colorThemes.map((color) => (
                <button
                  key={color}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: selectedColor === color ? "3px solid #000" : "2px solid #e1e3e5",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </InlineStack>
          </div>

          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
              <SingleBundleCard />
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
              <BOGOBundleCard />
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
              <QuantityBreaksBundleCard />
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
              <CompleteBundleCard />
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
              <SubscriptionBundleCard />
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
              <ProgressiveGiftsBundleCard />
            </Grid.Cell>
          </Grid>
        </Layout.Section>
      </Layout>
    </Page>
  );
}