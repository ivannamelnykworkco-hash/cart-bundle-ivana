// app/routes/app.bundles.new.multi-pack.tsx
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useNavigate, useSubmit } from "@remix-run/react";
import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Select,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Checkbox,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

interface FreeGift {
  id: string;
  name: string;
  unlockAt: number;
  icon: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  
  const bundleData = {
    name: formData.get("name"),
    type: "multi-pack",
    packs: formData.get("packs"),
    freeGifts: formData.get("freeGifts"),
    subscription: formData.get("subscription"),
  };

  return json({ success: true, bundle: bundleData });
};

export default function MultiPackBundle() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [selectedPack, setSelectedPack] = useState(2);
  const [subscriptionEnabled, setSubscriptionEnabled] = useState(false);
  const [subscriptionFrequency, setSubscriptionFrequency] = useState("weekly");

  const packs = [
    { quantity: 1, price: 49.99, savings: 0 },
    { quantity: 2, price: 84.99, savings: 15, popular: true },
    { quantity: 3, price: 127.48, savings: 15 },
  ];

  const freeGifts: FreeGift[] = [
    { id: "1", name: "Free Gift 1", unlockAt: 1, icon: "🚚" },
    { id: "2", name: "Free Gift 2", unlockAt: 2, icon: "🎽" },
    { id: "3", name: "Free Gift 3", unlockAt: 3, icon: "🔒" },
  ];

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", "Multi-pack Bundle");
    formData.append("packs", JSON.stringify(packs));
    formData.append("freeGifts", JSON.stringify(freeGifts));
    formData.append("subscription", subscriptionEnabled.toString());
    
    submit(formData, { method: "post" });
  };

  return (
    <Page
      title="Multi-Pack Bundle"
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
                <Text as="p" variant="headingMd">
                  Pack Options
                </Text>

                {packs.map((pack, index) => (
                  <div
                    key={index}
                    style={{
                      border: selectedPack === pack.quantity ? "2px solid #000" : "1px solid #e1e3e5",
                      borderRadius: "8px",
                      padding: "16px",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() => setSelectedPack(pack.quantity)}
                  >
                    {pack.popular && (
                      <div style={{ position: "absolute", top: "-10px", right: "16px" }}>
                        <Badge tone="info">MOST POPULAR</Badge>
                      </div>
                    )}
                    <InlineStack align="space-between" blockAlign="center">
                      <InlineStack gap="200" blockAlign="center">
                        <input
                          type="radio"
                          checked={selectedPack === pack.quantity}
                          onChange={() => setSelectedPack(pack.quantity)}
                        />
                        <div>
                          <Text as="p" variant="bodyMd" fontWeight="semibold">
                            {pack.quantity} pack
                          </Text>
                          {pack.savings > 0 && (
                            <Badge tone="success" size="small">SAVE {pack.savings}%</Badge>
                          )}
                          {pack.savings > 0 && (
                            <Text as="p" variant="bodySm" tone="subdued">
                              You save ${((pack.quantity * 49.99 - pack.price)).toFixed(2)}
                            </Text>
                          )}
                        </div>
                      </InlineStack>
                      <div style={{ textAlign: "right" }}>
                        <Text as="p" variant="headingMd" fontWeight="bold">
                          ${pack.price.toFixed(2)}
                        </Text>
                        {pack.savings > 0 && (
                          <Text as="p" variant="bodySm" tone="subdued">
                            <s>${(pack.quantity * 49.99).toFixed(2)}</s>
                          </Text>
                        )}
                      </div>
                    </InlineStack>
                  </div>
                ))}

                <div style={{ marginTop: "24px" }}>
                  <Text as="p" variant="headingMd">
                    Free Gifts Configuration
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Add free gifts that unlock at different pack quantities
                  </Text>
                </div>

                {freeGifts.map((gift) => (
                  <div
                    key={gift.id}
                    style={{
                      border: "1px solid #e1e3e5",
                      borderRadius: "8px",
                      padding: "12px",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <div>
                        <Text as="p" variant="bodyMd">
                          {gift.icon} {gift.name}
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Unlocks at {gift.unlockAt} pack
                        </Text>
                      </div>
                      <Button size="slim" onClick={() => {}}>
                        Edit
                      </Button>
                    </InlineStack>
                  </div>
                ))}

                <Button onClick={() => {}} variant="plain">
                  + Add free gift
                </Button>

                <div style={{
                  marginTop: "24px",
                  padding: "16px",
                  border: "1px dashed #d1d5db",
                  borderRadius: "8px",
                }}>
                  <Checkbox
                    label="Subscribe & Save 20%"
                    checked={subscriptionEnabled}
                    onChange={setSubscriptionEnabled}
                  />
                  {subscriptionEnabled && (
                    <div style={{ marginTop: "12px" }}>
                      <Select
                        label="Delivery frequency"
                        options={[
                          { label: "Weekly", value: "weekly" },
                          { label: "Bi-weekly", value: "biweekly" },
                          { label: "Monthly", value: "monthly" },
                        ]}
                        value={subscriptionFrequency}
                        onChange={setSubscriptionFrequency}
                      />
                    </div>
                  )}
                </div>
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
                <BlockStack gap="300">
                  {packs.map((pack, index) => (
                    <div
                      key={index}
                      style={{
                        border: selectedPack === pack.quantity ? "2px solid #000" : "1px solid #e1e3e5",
                        borderRadius: "8px",
                        padding: "12px",
                        backgroundColor: selectedPack === pack.quantity ? "#f9fafb" : "#fff",
                        position: "relative",
                      }}
                    >
                      {pack.popular && (
                        <div style={{ position: "absolute", top: "-10px", right: "16px" }}>
                          <Badge tone="info" size="small">MOST POPULAR</Badge>
                        </div>
                      )}
                      <InlineStack align="space-between">
                        <div>
                          <Text as="p" variant="bodyMd" fontWeight="semibold">
                            {pack.quantity} pack
                          </Text>
                          {pack.savings > 0 && (
                            <>
                              <Badge tone="success" size="small">SAVE {pack.savings}%</Badge>
                              <Text as="p" variant="bodySm" tone="subdued">
                                You save ${((pack.quantity * 49.99 - pack.price)).toFixed(2)}
                              </Text>
                            </>
                          )}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <Text as="p" variant="headingMd" fontWeight="bold">
                            ${pack.price.toFixed(2)}
                          </Text>
                          {pack.savings > 0 && (
                            <Text as="p" variant="bodySm" tone="subdued">
                              <s>${(pack.quantity * 49.99).toFixed(2)}</s>
                            </Text>
                          )}
                        </div>
                      </InlineStack>
                    </div>
                  ))}
                </BlockStack>

                <div style={{
                  marginTop: "16px",
                  padding: "16px",
                  backgroundColor: "#fef3c7",
                  borderRadius: "8px",
                  border: "1px solid #fbbf24"
                }}>
                  <Text as="p" variant="bodyMd" fontWeight="semibold">
                    🎁 Unlock Free gifts with your order
                  </Text>
                  <div style={{ marginTop: "12px", display: "flex", gap: "12px", justifyContent: "space-around" }}>
                    {freeGifts.map((gift) => (
                      <div
                        key={gift.id}
                        style={{
                          textAlign: "center",
                          opacity: selectedPack >= gift.unlockAt ? 1 : 0.4,
                        }}
                      >
                        <div style={{
                          width: "60px",
                          height: "60px",
                          backgroundColor: selectedPack >= gift.unlockAt ? "#86efac" : "#e5e7eb",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                          margin: "0 auto 8px",
                        }}>
                          {selectedPack >= gift.unlockAt ? gift.icon : "🔒"}
                        </div>
                        <Text as="p" variant="bodySm">
                          {selectedPack >= gift.unlockAt ? "FREE" : `FREE ${gift.unlockAt}+`}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>

                {subscriptionEnabled && (
                  <div style={{
                    marginTop: "16px",
                    padding: "12px",
                    border: "1px dashed #d1d5db",
                    borderRadius: "8px",
                  }}>
                    <Checkbox
                      label="Subscribe & Save 20%"
                      checked={true}
                      onChange={() => {}}
                    />
                    <Text as="p" variant="bodySm" tone="subdued">
                      Delivered {subscriptionFrequency}
                    </Text>
                  </div>
                )}
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}