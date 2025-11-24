// app/routes/app.bundles.new.bogo.tsx
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
  RadioButton,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Checkbox,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  
  const bundleData = {
    name: formData.get("name"),
    type: "bogo",
    selectedOffer: formData.get("selectedOffer"),
    freeGift: formData.get("freeGift"),
  };

  return json({ success: true, bundle: bundleData });
};

export default function BOGOBundle() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [selectedOffer, setSelectedOffer] = useState("buy1get1");
  const [freeGiftEnabled, setFreeGiftEnabled] = useState(false);

  const offers = [
    {
      id: "buy1get1",
      title: "Buy 1, get 1 free",
      price: "49.99",
      originalPrice: "99.98",
      savings: "SAVE 50%",
    },
    {
      id: "buy2get3",
      title: "Buy 2, get 3 free",
      price: "99.98",
      originalPrice: "249.95",
      savings: "SAVE 60%",
    },
    {
      id: "buy3get6",
      title: "Buy 3, get 6 free",
      price: "149.97",
      originalPrice: "449.91",
      savings: "SAVE 67%",
    },
  ];

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", "BOGO Bundle");
    formData.append("selectedOffer", selectedOffer);
    formData.append("freeGift", freeGiftEnabled.toString());
    
    submit(formData, { method: "post" });
  };

  return (
    <Page
      title="Buy X, get Y free (BOGO) Bundle"
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
                  Select Offer Type
                </Text>

                <BlockStack gap="300">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      style={{
                        border: selectedOffer === offer.id ? "2px solid #000" : "1px solid #e1e3e5",
                        borderRadius: "8px",
                        padding: "16px",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedOffer(offer.id)}
                    >
                      <InlineStack align="space-between" blockAlign="start">
                        <InlineStack gap="200" blockAlign="start">
                          <input
                            type="radio"
                            checked={selectedOffer === offer.id}
                            onChange={() => setSelectedOffer(offer.id)}
                          />
                          <div>
                            <Text as="p" variant="bodyMd" fontWeight="semibold">
                              {offer.title}
                            </Text>
                            <Badge tone="success">{offer.savings}</Badge>
                          </div>
                        </InlineStack>
                        <div style={{ textAlign: "right" }}>
                          <Text as="p" variant="headingMd">
                            ${offer.price}
                          </Text>
                          <Text as="p" variant="bodySm" tone="subdued">
                            <s>${offer.originalPrice}</s>
                          </Text>
                        </div>
                      </InlineStack>
                    </div>
                  ))}
                </BlockStack>

                <div style={{
                  padding: "16px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                  marginTop: "16px"
                }}>
                  <Checkbox
                    label="+ FREE special gift!"
                    checked={freeGiftEnabled}
                    onChange={setFreeGiftEnabled}
                  />
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
                <Text as="p" variant="headingMd" fontWeight="bold">
                  Buy X, get Y free (BOGO) deal
                </Text>
                
                <BlockStack gap="300">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      style={{
                        border: selectedOffer === offer.id ? "2px solid #000" : "1px solid #e1e3e5",
                        borderRadius: "8px",
                        padding: "12px",
                        backgroundColor: selectedOffer === offer.id ? "#f9fafb" : "#fff",
                      }}
                    >
                      <InlineStack align="space-between">
                        <div>
                          <Text as="p" variant="bodySm" fontWeight="semibold">
                            {offer.title}
                          </Text>
                          <Badge tone="success" size="small">{offer.savings}</Badge>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <Text as="p" variant="bodyMd" fontWeight="bold">
                            ${offer.price}
                          </Text>
                          <Text as="p" variant="bodySm" tone="subdued">
                            <s>${offer.originalPrice}</s>
                          </Text>
                        </div>
                      </InlineStack>
                    </div>
                  ))}
                </BlockStack>

                {freeGiftEnabled && (
                  <div style={{
                    marginTop: "16px",
                    padding: "12px",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "8px"
                  }}>
                    <Text as="p" variant="bodySm" fontWeight="semibold">
                      + FREE special gift!
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