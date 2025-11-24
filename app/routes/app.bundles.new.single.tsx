// app/routes/app.bundles.new.single.tsx
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
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  
  // TODO: Save to database
  const bundleData = {
    name: formData.get("name"),
    type: "single",
    price: formData.get("price"),
    color1: formData.get("color1"),
    color2: formData.get("color2"),
  };

  return json({ success: true, bundle: bundleData });
};

export default function SingleBundle() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [formState, setFormState] = useState({
    name: "Single",
    standardPrice: "49.99",
    color1: "Black",
    color2: "Black",
  });

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("price", formState.standardPrice);
    formData.append("color1", formState.color1);
    formData.append("color2", formState.color2);
    
    submit(formData, { method: "post" });
  };

  return (
    <Page
      title="Single Bundle"
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
                  label="Standard Price"
                  type="number"
                  value={formState.standardPrice}
                  onChange={(value) => setFormState({ ...formState, standardPrice: value })}
                  prefix="$"
                  autoComplete="off"
                />

                <Text as="p" variant="headingMd">
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
                border: "1px solid #e1e3e5",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#f9fafb"
              }}>
                <InlineStack align="space-between" blockAlign="center">
                  <div>
                    <Text as="p" variant="headingMd">
                      Single
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Standard price
                    </Text>
                  </div>
                  <Text as="p" variant="headingLg">
                    ${formState.standardPrice}
                  </Text>
                </InlineStack>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}