// app/routes/app._index.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Button,
  DataTable,
  Badge,
  EmptyState,
  Banner,
  Text,
  Tabs,
  Frame,
  Toast,
  MediaCard,
  Box,
  InlineStack,
  VideoThumbnail,
  Icon,
  BlockStack
} from "@shopify/polaris";
import {
  StarIcon
} from '@shopify/polaris-icons';
import { useEffect, useState } from "react";
import { authenticate } from "../shopify.server";
import {
  ChartVerticalFilledIcon,
  DeleteIcon,
  DuplicateIcon,
  EditIcon,
  ViewIcon
} from '@shopify/polaris-icons';
import type { Bundle, Analytics } from "../models/types";
import { SwitchIcon } from "app/components/common/SwitchIcon";
import { getBundles, deleteBundle } from "app/models/bundle.server";
import { deleteGeneralSetting } from "app/models/generalSetting.server";
import { deleteGeneralStyle } from "app/models/generalStyle.server";
import { deleteCountdownTimer } from "app/models/countdownTimer.server";
import { deleteVolumeDiscount } from "app/models/volumeDiscount.server";
import { deleteStickyAdd } from "app/models/stickyAdd.server";
import { deleteCheckboxUpsell } from "app/models/checkboxUpsell.server";
import { deleteQuantityBreaks } from "app/models/quantityBreak.server";
import { deleteBuyXGetYs } from "app/models/buyXGetY.server";
import { deleteBundleUpsells } from "app/models/bundleUpsell.server";
import { DELETE_DISCOUNT_QUERY } from "app/graphql/discount";
import { safeJsonParse } from "app/utils/discountFunction";

async function deleteBundleData(id: string): Promise<boolean> {
  try {
    await Promise.all([
      deleteBundle({ id }),
      deleteGeneralSetting({ bundleId: id }),
      deleteGeneralStyle({ bundleId: id }),
      deleteCountdownTimer({ bundleId: id }),
      deleteVolumeDiscount({ bundleId: id }),
      deleteStickyAdd({ bundleId: id }),
      deleteCheckboxUpsell({ bundleId: id }),
      deleteQuantityBreaks({ bundleId: id }),
      deleteBuyXGetYs({ bundleId: id }),
      deleteBundleUpsells({ bundleId: id }),
    ]);
    return true; // all deletes succeeded
  } catch (err) {
    return false; // at least one delete failed
  }
}

async function deleteAutomaticAppDiscount(admin: any, discountId: string) {
  const deleteDiscountVariables = {
    id: discountId
  };

  try {
    const graphqlResult = await admin.graphql(DELETE_DISCOUNT_QUERY, {
      variables: deleteDiscountVariables,
    });

    const body = await graphqlResult.json();
    // Check top-level GraphQL errors
    if (body.errors?.length) {
      return { success: false, errors: body.errors };
    }
    const result = body.data.discountAutomaticDelete;
    // Check user errors from mutation
    if (result.userErrors?.length) {
      return { success: false, errors: result.userErrors };
    }
    // If deletion succeeded
    if (result.deletedAutomaticDiscountId) {
      return { success: true, deletedId: result.deletedAutomaticDiscountId };
    }
    // Mutation ran but nothing deleted (ID might not exist)
    return { success: false, errors: "No discount deleted (ID may not exist)" };
  } catch (err: any) {
    // Network or other exception
    return { success: false, errors: err };
  }
}

export const action = async ({ request }: { request: Request }) => {
  try {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const id = formData.get("id") as string | null;
    if (!id) {
      return json({ success: false, error: "id not defined" }, { status: 400 });
    }
    const bundles = await getBundles();
    const bundle = bundles.find(b => b.id === id);
    if (!bundle) {
      return json({ success: false, error: "Delete failed (No discount found)" }, { status: 500 });
    }
    const discountId = bundle.discountId;
    if (discountId) {
      const graphqlResult = await deleteAutomaticAppDiscount(admin, discountId || "gid://shopify/DiscountAutomaticNode/1510751207703");
      if (!graphqlResult.success) {
        return json({ success: false, error: graphqlResult.errors }, { status: 500 });
      }
    }
    const dbResult = await deleteBundleData(id);
    if (!dbResult) {
      return json({ success: false, error: "Delete DB failed" }, { status: 500 });
    }
    // Everything succeeded
    return json({ success: true });
  } catch (err: any) {
    return json({ success: false, error: err.message || "Delete failed" }, { status: 500 });
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const bundles = await getBundles();

  // TODO: Fetch from database
  const bundleList: Bundle[] = [
    {
      id: "1",
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
    },
  ];

  const analytics: Analytics = {
    thisMonthRevenue: 0,
    allTimeRevenue: 0,
    resetDate: "Dec 1",
  };

  return json({ bundles, analytics });
};

export default function Index() {
  const { bundles, analytics } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);
  const [isShowLowAlert, setIsShowLowAlert] = useState(false);

  const submit = useSubmit();
  async function deleteBundleData(id: string) {
    const formData = new FormData();
    formData.append("id", id);
    submit(formData, { method: "post" });
  }

  const actionData = useActionData();
  console.log("actionData==>", actionData);

  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        showToast("Deleted successfully!", "success");
      } else {
        showToast(`Error: ${actionData.error} `, "error");
      }
    }
  }, [actionData]);

  // Put this at the top of your component (NOT inside map)
  const [loadingState, setLoadingState] = useState(null);

  const rows = bundles.map((bundle) => {
    const isEditLoading =
      loadingState?.bundleId === bundle.id && loadingState?.action === "edit";
    const isViewLoading =
      loadingState?.bundleId === bundle.id && loadingState?.action === "view";
    const isDeleteLoading =
      loadingState?.bundleId === bundle.id && loadingState?.action === "delete";

    return [
      // Deal Column
      <div
        key={`deal-${bundle.id}`}
        onClick={() => navigate(`/app/bundles/choose?bundleId=${bundle.id}`)}
        style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Text as="span" fontWeight="semibold">
              {bundle.name}
            </Text>
            <Badge tone="info">{bundle.status}</Badge>
          </div>
          <Text as="span" variant="bodySm" tone="subdued">
            {safeJsonParse(bundle.products).length} products
          </Text>
        </div>
      </div>,

      // Stats Column
      <div
        key={`stats-${bundle.id}`}
        onClick={() => navigate(`/app/bundles/choose?bundleId=${bundle.id}`)}
        style={{
          display: "flex",
          gap: "48px",
          alignItems: "center",
          paddingLeft: "16px",
          cursor: "pointer",
        }}
      >
        <div style={{ minWidth: "60px" }}>
          <Text as="span" variant="bodySm" tone="subdued">Visitors</Text>
          <Text as="span" fontWeight="semibold">{bundle.stats.visitors}</Text>
        </div>

        <div style={{ minWidth: "60px" }}>
          <Text as="span" variant="bodySm" tone="subdued">CR</Text>
          <Text as="span" fontWeight="semibold">{bundle.stats.conversionRate}%</Text>
        </div>

        <div style={{ minWidth: "60px" }}>
          <Text as="span" variant="bodySm" tone="subdued">Bundles</Text>
          <Text as="span" fontWeight="semibold">{bundle.stats.bundlesRate}%</Text>
        </div>

        <div style={{ minWidth: "60px" }}>
          <Text as="span" variant="bodySm" tone="subdued">AOV</Text>
          <Text as="span" fontWeight="semibold">${bundle.stats.aov.toFixed(2)}</Text>
        </div>

        <div style={{ minWidth: "80px" }}>
          <Text as="span" variant="bodySm" tone="subdued">Add. rev.</Text>
          <Text as="span" fontWeight="semibold">${bundle.stats.addedRevenue}</Text>
        </div>

        <div style={{ minWidth: "80px" }}>
          <Text as="span" variant="bodySm" tone="subdued">Total rev.</Text>
          <Text as="span" fontWeight="semibold">${bundle.stats.totalRevenue}</Text>
        </div>

        <div style={{ minWidth: "100px" }}>
          <Text as="span" variant="bodySm" tone="subdued">Rev. per visitor</Text>
          <Text as="span" fontWeight="semibold">
            ${bundle.stats.revenuePerVisitor.toFixed(2)}
          </Text>
        </div>

        <div style={{ minWidth: "100px" }}>
          <Text as="span" variant="bodySm" tone="subdued">Profit per visitor</Text>
          <Text as="span" fontWeight="semibold">
            {bundle.stats.profitPerVisitor === 0 ? "-" : `$${bundle.stats.profitPerVisitor}`}
          </Text>
        </div>
      </div>,

      // Actions Column
      <div
        key={`actions-${bundle.id}`}
        style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}
      >
        <Button
          icon={EditIcon}
          loading={isEditLoading}
          disabled={isEditLoading || isViewLoading || isDeleteLoading}
          onClick={() => {
            setLoadingState({ bundleId: bundle.id, action: "edit" });
            setTimeout(() => {
              navigate(`/app/bundles/choose?bundleId=${bundle.id}`);
            }, 0);
          }}
          accessibilityLabel="Edit bundle"
        />
        <Button
          icon={ViewIcon}
          loading={isViewLoading}
          disabled={isEditLoading || isViewLoading || isDeleteLoading}
          onClick={() => {
            setLoadingState({ bundleId: bundle.id, action: "view" });
            setTimeout(() => {
              navigate(`/app/bundles/choose?bundleId=${bundle.id}`);
            }, 0);
          }}
          accessibilityLabel="View bundle"
        />

        <Button
          icon={DeleteIcon}
          loading={isDeleteLoading}
          disabled={isEditLoading || isViewLoading || isDeleteLoading}
          onClick={async () => {
            setLoadingState({ bundleId: bundle.id, action: "delete" });
            try {
              await deleteBundleData(bundle.id);
            } finally {
              setLoadingState(null);
            }
          }}
          accessibilityLabel="Delete bundle"
        />
      </div>,
    ];
  });

  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [toastError, setToastError] = useState(false); // For styling, optional

  const showToast = (message, type = 'success') => {
    setToastContent(message);
    setToastActive(true);
    setToastError(type === 'error');
  };
  const handleToastDismiss = () => {
    setToastActive(false);
  };

  return (
    <Page
      title="Welcome and get ready to increase your AOV!"
      primaryAction={{
        content: "Create bundle deal",
        onAction: () => navigate("/app/bundles/new"),
      }}
    >
      <Layout>
        <Layout.Section>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            {/* Usage Overview Card */}
            <div className="coming-soon">
              <Card>
                <div style={{ padding: "16px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <Text as="h2" variant="headingMd">
                      Usage overview
                    </Text>
                  </div>
                  <Text as="span" tone="subdued">
                    ${analytics.thisMonthRevenue}/∞ added revenue this month
                  </Text>
                  <Text as="span" variant="bodySm" tone="subdued">
                    Resets on {analytics.resetDate}
                  </Text>
                </div>
              </Card>
            </div>

            {/* Analytics Card */}
            <div className="coming-soon">
              <Card>
                <div style={{ padding: "16px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <Text as="h2" variant="headingMd">
                      Analytics
                    </Text>
                    <Button onClick={() => navigate("/app/analytics")}>
                      View full analytics
                    </Button>
                  </div>
                  <div style={{ display: "flex", gap: "40px" }}>
                    <div>
                      <Text as="span" variant="bodySm" tone="subdued">
                        This month's added revenue
                      </Text>
                      <Text as="span" variant="headingLg">
                        ${analytics.thisMonthRevenue}
                      </Text>
                    </div>
                    <div>
                      <Text as="span" variant="bodySm" tone="subdued">
                        All time added revenue
                      </Text>
                      <Text as="span" variant="headingLg">
                        ${analytics.allTimeRevenue}
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Theme Extension Card */}
            <div className="coming-soon">
              <Card>
                <div style={{ padding: "16px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <Text as="h2" variant="headingMd">
                      Theme extension
                    </Text>
                    <Badge tone="success">Active</Badge>
                  </div>
                  <Text as="span" variant="bodySm">
                    Bundles widget is visible in product pages.
                  </Text>
                  <Button variant="plain" onClick={() => { }}>
                    Need help?
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </Layout.Section>

        <Layout.Section>
          <Card>
            {bundles.length === 0 ? (
              <EmptyState
                heading="Create your first bundle deal"
                action={{
                  content: "Create bundle deal",
                  onAction: () => navigate("/app/bundles/new"),
                }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>Start boosting your sales with bundle deals</p>
              </EmptyState>
            ) : (
              <DataTable
                columnContentTypes={["text", "text", "text"]}
                headings={["Deal", "Stats", "Actions"]}
                rows={rows}
              />
            )}
          </Card>
        </Layout.Section>
        <Layout.Section>
          {showBanner && (
            <Banner
              title="Your bundles need more visibility"
              tone="info"
              action={{ content: "Get started", disabled: true, }}
              secondaryAction={{ content: "Maybe later", disabled: true, }}
              onDismiss={() => setShowBanner(false)}>
              <p>This order was archived on March 7, 2017 at 3:12pm EDT.</p>
            </Banner>
          )}
        </Layout.Section>
        {/* <Layout.Section>
          <InlineStack align="space-between">
            <Box maxWidth="49%">
              <BlockStack gap="300">
                <MediaCard
                  size='small'
                  title="Need more reviews?"
                  description="
          A quick reminder can make all the difference.
          Set up Automatic Email Reminders to nudge customers who haven’t left a review yet – just choose the timing, and we’ll take care of the rest.
          Easy to set up, big impact!🚀."
                  popoverActions={[{ content: 'Dismiss', onAction: () => { } }]}
                >
                  <img
                    alt=""
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    src="https://burst.shopifycdn.com/photos/person-typing-while-wearing-a-smartwatch.jpg?width=373&format=pjpg&exif=0&iptc=0?width=1850"
                  />
                </MediaCard>
                <div className="reviews-card">
                  <InlineStack align="space-between">
                    <Box width="49%">
                      <Card>
                        <BlockStack align="center" gap='300'>
                          <Icon source={ViewIcon} tone="info"></Icon>
                          <Text as="h2" variant="bodyMd" alignment="center">
                            A list of top reviewed products will show here.
                          </Text>
                          <Button disabled={true}>
                            View all reviews
                          </Button>
                        </BlockStack>
                      </Card>
                    </Box>
                    <Box width="49%">
                      <Card>
                        <BlockStack align="space-between" gap='300'>
                          <Icon source={StarIcon} tone="warning"></Icon>
                          <Text as="h2" variant="bodyMd" alignment="center">
                            You can view your recent reviews here.
                          </Text>
                          <Button disabled={true}>
                            Request reviews
                          </Button>
                        </BlockStack>
                      </Card>
                    </Box>
                  </InlineStack>
                </div>
              </BlockStack>
            </Box>
            <Box maxWidth="49%">
              <MediaCard
                portrait
                size='small'
                title="Need more reviews?"
                description="
          A quick reminder can make all the difference.
          Set up Automatic Email Reminders to nudge customers who haven’t left a review yet – just choose the timing, and we’ll take care of the rest.
          Easy to set up, big impact!🚀."
                popoverActions={[{ content: 'Dismiss', onAction: () => { } }]}
              >
                <VideoThumbnail
                  videoLength={80}
                  thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                  onClick={() => console.log('clicked')}
                />
              </MediaCard>
            </Box>
          </InlineStack>
        </Layout.Section> */}

        {
          toastActive && (
            <Frame>
              <Toast
                content={toastContent}
                onDismiss={handleToastDismiss}
                error={toastError}
              />
            </Frame>
          )
        }
      </Layout>
    </Page >
  );
}
