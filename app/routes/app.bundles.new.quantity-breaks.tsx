// app/routes/app.bundles.new.quantity-breaks.tsx
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useNavigate, useSubmit } from "@remix-run/react";
import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Badge,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

interface QuantityTier {
  quantity: number;
  price: number;
  savings: number;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  
  const bundleData = {
    name: formData.get("name"),
    type: "quantity-breaks",
    tiers: formData.get("tiers"),
  };

  return json({ success: true, bundle: bundleData });
};

export default function QuantityBreaksBundle() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [tiers, setTiers] = useState<QuantityTier[]>([
    { quantity: 1, price: 49.99, savings: 0 },
    { quantity: 2, price: 84.99, savings: 15 },
    { quantity: 3, price: 127.48, savings: 15 },
  ]);

  const handleTierChange = (index: number, field: keyof QuantityTier, value: string) => {
    const newTiers = [...tiers];
    newTiers[index] = {
      ...newTiers[index],
      [field]: parseFloat(value) || 0,
    };
    setTiers(newTiers);
  };

  const addTier = () => {
    setTiers([...tiers, { quantity: tiers.length + 1, price: 0, savings: 0 }]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", "Quantity Breaks Bundle");
    formData.append("tiers", JSON.stringify(tiers));
    
    submit(formData, { method: "post" });
  };

  return (
    <Page
      title="Quantity Breaks for Different Products"
      backAction={{ onAction: () => navigate("/app/bundles/new") }}
      primaryAction={{
        content: "Save Bundle",
        onAction: handleSubmit,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: () => navigate("/app"),
        },
      ]}
    >
      <Layout>
        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Bundle Settings
              </Text>
              
              <FormLayout>
                <Text as="span" variant="headingMd">
                  Quantity Tiers
                </Text>

                {tiers.map((tier, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #e1e3e5",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom: "12px",
                    }}
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <Text as="span" variant="bodyMd" fontWeight="semibold">
                        {tier.quantity} pack
                      </Text>
                      {index > 0 && (
                        <Button
                          onClick={() => removeTier(index)}
                          tone="critical"
                          variant="plain"
                        >
                          Remove
                        </Button>
                      )}
                    </InlineStack>
                    
                    <div style={{ marginTop: "12px" }}>
                      <InlineStack gap="200">
                        <div style={{ flex: 1 }}>
                          <TextField
                            label="Quantity"
                            type="number"
                            value={tier.quantity.toString()}
                            onChange={(value) => handleTierChange(index, "quantity", value)}
                            autoComplete="off"
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <TextField
                            label="Price"
                            type="number"
                            value={tier.price.toString()}
                            onChange={(value) => handleTierChange(index, "price", value)}
                            prefix="$"
                            autoComplete="off"
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <TextField
                            label="Savings %"
                            type="number"
                            value={tier.savings.toString()}
                            onChange={(value) => handleTierChange(index, "savings", value)}
                            suffix="%"
                            autoComplete="off"
                          />
                        </div>
                      </InlineStack>
                    </div>
                  </div>
                ))}

                <Button onClick={addTier} variant="plain">
                  + Add another tier
                </Button>
              </FormLayout>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Preview
              </Text>
              
              <div style={{
                border: "1px solid #e1e3e5",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#fff"
              }}>
                <Text as="span" variant="headingMd" fontWeight="bold">
                  Quantity breaks for different products
                </Text>
                
                <BlockStack gap="200">
                  {tiers.map((tier, index) => (
                    <div
                      key={index}
                      style={{
                        border: index === 1 ? "2px solid #000" : "1px solid #e1e3e5",
                        borderRadius: "8px",
                        padding: "12px",
                        backgroundColor: index === 1 ? "#f9fafb" : "#fff",
                        position: "relative",
                      }}
                    >
                      {index === 1 && (
                        <div style={{ position: "absolute", top: "-10px", right: "16px" }}>
                          <Badge tone="info">MOST POPULAR</Badge>
                        </div>
                      )}
                      <InlineStack align="space-between">
                        <div>
                          <Text as="span" variant="bodyMd" fontWeight="semibold">
                            {tier.quantity} pack
                          </Text>
                          {tier.savings > 0 && (
                            <Badge tone="success" size="small">SAVE {tier.savings}%</Badge>
                          )}
                          {tier.savings > 0 && (
                            <Text as="span" variant="bodySm" tone="subdued">
                              You save ${((tier.quantity * 49.99) - tier.price).toFixed(2)}
                            </Text>
                          )}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <Text as="span" variant="headingMd" fontWeight="bold">
                            ${tier.price.toFixed(2)}
                          </Text>
                          {tier.savings > 0 && (
                            <Text as="span" variant="bodySm" tone="subdued">
                              <s>${(tier.quantity * 49.99).toFixed(2)}</s>
                            </Text>
                          )}
                        </div>
                      </InlineStack>
                    </div>
                  ))}
                </BlockStack>
              </div>

              <div style={{
                padding: "12px",
                backgroundColor: "#fef3c7",
                borderRadius: "8px",
                border: "1px solid #fbbf24"
              }}>
                <Text as="span" variant="bodySm">
                  💡 Unlock Free gifts with your order
                </Text>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}