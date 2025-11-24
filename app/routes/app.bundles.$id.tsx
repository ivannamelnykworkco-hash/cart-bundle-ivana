// app/routes/app.bundles.$id.tsx
import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
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
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import type { Bundle } from "../models/types";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const bundleId = params.id;

  // TODO: Fetch from database
  const bundle: Bundle = {
    id: bundleId!,
    name: "Bundle",
    type: "duo",
    status: "draft",
    products: ["All products"],
    discountType: "percentage",
    discountValue: 15,
    stats: {
      visitors: 2,
      conversionRate: 0,
      bundlesRate: 0,
      aov: 0,
      addedRevenue: 0,
      totalRevenue: 0,
      revenuePerVisitor: 0,
      profitPerVisitor: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {},
  };

  return json({ bundle });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    // TODO: Delete from database
    return redirect("/app");
  }

  // TODO: Update in database
  const bundleData = {
    name: formData.get("name"),
    status: formData.get("status"),
  };

  return json({ success: true, bundle: bundleData });
};

export default function EditBundle() {
  const { bundle } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const submit = useSubmit();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this bundle?")) {
      const formData = new FormData();
      formData.append("intent", "delete");
      submit(formData, { method: "post" });
    }
  };

  const handleStatusChange = (status: string) => {
    const formData = new FormData();
    formData.append("name", bundle.name);
    formData.append("status", status);
    submit(formData, { method: "post" });
  };

  return (
    <Page
      title={`Edit Bundle: ${bundle.name}`}
      backAction={{ onAction: () => navigate("/app") }}
      primaryAction={{
        content: "Save",
        onAction: () => submit(new FormData(), { method: "post" }),
      }}
      secondaryActions={[
        {
          content: bundle.status === "active" ? "Deactivate" : "Activate",
          onAction: () => handleStatusChange(bundle.status === "active" ? "draft" : "active"),
        },
        {
          content: "Delete",
          destructive: true,
          onAction: handleDelete,
        },
      ]}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Bundle Details
              </Text>
              
              <FormLayout>
                <TextField
                  label="Bundle Name"
                  value={bundle.name}
                  onChange={() => {}}
                  autoComplete="off"
                />

                <Select
                  label="Status"
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                  ]}
                  value={bundle.status}
                  onChange={() => {}}
                />

                <TextField
                  label="Discount Value"
                  type="number"
                  value={bundle.discountValue.toString()}
                  onChange={() => {}}
                  suffix={bundle.discountType === "percentage" ? "%" : "$"}
                  autoComplete="off"
                />
              </FormLayout>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Bundle Statistics
              </Text>
              
              <BlockStack gap="200">
                <div>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Visitors
                  </Text>
                  <Text as="p" variant="headingMd">
                    {bundle.stats.visitors}
                  </Text>
                </div>
                <div>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Conversion Rate
                  </Text>
                  <Text as="p" variant="headingMd">
                    {bundle.stats.conversionRate}%
                  </Text>
                </div>
                <div>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Revenue Per Visitor
                  </Text>
                  <Text as="p" variant="headingMd">
                    ${bundle.stats.revenuePerVisitor.toFixed(2)}
                  </Text>
                </div>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}