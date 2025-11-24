// app/routes/app.bundles.new.complete.tsx
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
  Checkbox,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

interface BundleProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  
  const bundleData = {
    name: formData.get("name"),
    type: "complete",
    products: formData.get("products"),
    totalPrice: formData.get("totalPrice"),
    savings: formData.get("savings"),
  };

  return json({ success: true, bundle: bundleData });
};

export default function CompleteBundle() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [bundleTitle, setBundleTitle] = useState("Make time for Brain, Body & Beauty!");
  const [selectedProducts, setSelectedProducts] = useState<BundleProduct[]>([
    { id: "1", name: "Make time for Brain, Body & Beauty!", price: 40.00 },
  ]);
  const [additionalProduct, setAdditionalProduct] = useState<BundleProduct>({
    id: "2",
    name: "Shorts",
    price: 24.00,
  });
  const [productSize, setProductSize] = useState("Small");

  const totalOriginalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0) + additionalProduct.price;
  const bundlePrice = 64.00;
  const savings = totalOriginalPrice - bundlePrice;
  const savingsPercent = ((savings / totalOriginalPrice) * 100).toFixed(0);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", bundleTitle);
    formData.append("products", JSON.stringify([...selectedProducts, additionalProduct]));
    formData.append("totalPrice", bundlePrice.toString());
    formData.append("savings", savings.toString());
    
    submit(formData, { method: "post" });
  };

  return (
    <Page
      title="Complete the Bundle"
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
                  label="Bundle Title"
                  value={bundleTitle}
                  onChange={setBundleTitle}
                  autoComplete="off"
                />

                <Text as="p" variant="headingMd">
                  Products in Bundle
                </Text>

                {selectedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    style={{
                      border: "1px solid #e1e3e5",
                      borderRadius: "8px",
                      padding: "12px",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <div>
                        <Text as="p" variant="bodyMd" fontWeight="semibold">
                          {product.name}
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          ${product.price.toFixed(2)}
                        </Text>
                      </div>
                      <Checkbox
                        label=""
                        checked={true}
                        onChange={() => {}}
                      />
                    </InlineStack>
                  </div>
                ))}

                <Text as="p" variant="headingMd">
                  Add Product to Complete Bundle
                </Text>

                <div style={{
                  border: "1px solid #e1e3e5",
                  borderRadius: "8px",
                  padding: "16px",
                }}>
                  <InlineStack gap="200">
                    <div style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#e1e3e5",
                      borderRadius: "8px",
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <Text as="p" variant="bodyMd" fontWeight="semibold">
                        {additionalProduct.name}
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        ${additionalProduct.price.toFixed(2)}
                      </Text>
                      <div style={{ marginTop: "8px" }}>
                        <Select
                          label=""
                          options={[
                            { label: "Small", value: "Small" },
                            { label: "Medium", value: "Medium" },
                            { label: "Large", value: "Large" },
                          ]}
                          value={productSize}
                          onChange={setProductSize}
                        />
                      </div>
                    </div>
                  </InlineStack>
                </div>

                <div style={{
                  padding: "16px",
                  backgroundColor: "#f0fdf4",
                  borderRadius: "8px",
                  border: "1px solid #86efac",
                }}>
                  <Text as="p" variant="headingMd" fontWeight="bold">
                    Bundle Price: ${bundlePrice.toFixed(2)}
                  </Text>
                  <Text as="p" variant="bodySm" tone="success">
                    Save ${savings.toFixed(2)} ({savingsPercent}%)
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Original: ${totalOriginalPrice.toFixed(2)}
                  </Text>
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
                  {bundleTitle}
                </Text>

                <div style={{ marginTop: "16px" }}>
                  {selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: "12px",
                        padding: "12px",
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                      }}
                    >
                      <div style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#e1e3e5",
                        borderRadius: "4px",
                      }}></div>
                      <div style={{ flex: 1 }}>
                        <Text as="p" variant="bodySm" fontWeight="semibold">
                          {product.name}
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          ${product.price.toFixed(2)}
                        </Text>
                      </div>
                    </div>
                  ))}

                  <div style={{
                    display: "flex",
                    gap: "12px",
                    padding: "12px",
                    border: "2px dashed #d1d5db",
                    borderRadius: "8px",
                  }}>
                    <div style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#e1e3e5",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <Text as="p" variant="headingLg">?</Text>
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text as="p" variant="bodySm" fontWeight="semibold">
                        {additionalProduct.name}
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        ${additionalProduct.price.toFixed(2)}
                      </Text>
                      <Button size="slim" variant="plain">Choose</Button>
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: "16px",
                  padding: "12px",
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: "8px",
                  textAlign: "center",
                }}>
                  <Text as="p" variant="headingMd" fontWeight="bold">
                    Complete the bundle ${bundlePrice.toFixed(2)}
                  </Text>
                  <Text as="p" variant="bodySm">
                    Save ${savings.toFixed(2)}!
                  </Text>
                </div>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}