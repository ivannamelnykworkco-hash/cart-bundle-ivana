// app/routes/app.bundles.new.duo.tsx
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
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();

  const bundleData = {
    name: formData.get("name"),
    type: "duo",
    originalPrice: formData.get("originalPrice"),
    discountedPrice: formData.get("discountedPrice"),
    savings: formData.get("savings"),
    color1: formData.get("color1"),
    color2: formData.get("color2"),
  };

  return json({ success: true, bundle: bundleData });
};

export default function DuoBundle() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [formState, setFormState] = useState({
    name: "Duo",
    originalPrice: "99.98",
    discountedPrice: "84.99",
    color1: "Black",
    color2: "Black",
  });

  const savings = ((parseFloat(formState.originalPrice) - parseFloat(formState.discountedPrice)) / parseFloat(formState.originalPrice) * 100).toFixed(0);
  const savingsAmount = (parseFloat(formState.originalPrice) - parseFloat(formState.discountedPrice)).toFixed(2);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("originalPrice", formState.originalPrice);
    formData.append("discountedPrice", formState.discountedPrice);
    formData.append("savings", savings);
    formData.append("color1", formState.color1);
    formData.append("color2", formState.color2);

    submit(formData, { method: "post" });
  };

  return (
    <Page
      title="Duo Bundle"
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
                <TextField
                  label="Bundle Name"
                  value={formState.name}
                  onChange={(value) => setFormState({ ...formState, name: value })}
                  autoComplete="off"
                />

                <TextField
                  label="Original Price"
                  type="number"
                  value={formState.originalPrice}
                  onChange={(value) => setFormState({ ...formState, originalPrice: value })}
                  prefix="$"
                  autoComplete="off"
                  helpText="Combined price of both items"
                />

                <TextField
                  label="Discounted Price"
                  type="number"
                  value={formState.discountedPrice}
                  onChange={(value) => setFormState({ ...formState, discountedPrice: value })}
                  prefix="$"
                  autoComplete="off"
                />

                <div style={{
                  padding: "12px",
                  backgroundColor: "#f0fdf4",
                  borderRadius: "8px",
                  border: "1px solid #86efac"
                }}>
                  <Text as="span" tone="success">
                    You save ${savingsAmount} ({savings}%)
                  </Text>
                </div>

                <Text as="span" variant="headingMd">
                  Color Selection
                </Text>

                <Select
                  label="Color #1"
                  options={[
                    { label: "Black", value: "Black" },
                    { label: "White", value: "White" },
                    { label: "Red", value: "Red" },
                    { label: "Blue", value: "Blue" },
                  ]}
                  value={formState.color1}
                  onChange={(value) => setFormState({ ...formState, color1: value })}
                />

                <Select
                  label="Color #2"
                  options={[
                    { label: "Black", value: "Black" },
                    { label: "White", value: "White" },
                    { label: "Red", value: "Red" },
                    { label: "Blue", value: "Blue" },
                  ]}
                  value={formState.color2}
                  onChange={(value) => setFormState({ ...formState, color2: value })}
                />
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
                border: "2px solid #000",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#fff",
                position: "relative"
              }}>
                <Badge tone="attention" size="small">MOST POPULAR</Badge>
                <InlineStack align="space-between" blockAlign="center">
                  <div>
                    <Text as="span" variant="headingLg" fontWeight="bold">
                      Duo
                    </Text>
                    <Text as="span" tone="success" fontWeight="semibold">
                      SAVE ${savingsAmount}
                    </Text>
                    <Text as="span" variant="bodySm" tone="subdued">
                      You save {savings}%
                    </Text>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Text as="span" variant="headingLg" fontWeight="bold">
                      ${formState.discountedPrice}
                    </Text>
                    <Text as="span" variant="bodySm" tone="subdued">
                      <s>${formState.originalPrice}</s>
                    </Text>
                  </div>
                </InlineStack>

                <div style={{ marginTop: "16px" }}>
                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                    Color
                  </Text>
                  <div style={{ marginTop: "8px" }}>
                    <Text as="span" variant="bodySm">
                      #1: {formState.color1}
                    </Text>
                    <Text as="span" variant="bodySm">
                      #2: {formState.color2}
                    </Text>
                  </div>
                </div>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}