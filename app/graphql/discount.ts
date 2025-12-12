export const GET_DISCOUNT_QUERY = `
    query getAutomaticAppDiscount($id: ID!) {
    automaticDiscountNode(id: $id) {
      id
      automaticDiscount {
        __typename
        ... on DiscountAutomaticApp {
          title
          startsAt
          endsAt
          appDiscountType { functionId }
        }
      }
    }
  }`;

export const CREATE_DISCOUNT_QUERY = `
    mutation discountAutomaticAppCreate($automaticAppDiscount: DiscountAutomaticAppInput!) {
    discountAutomaticAppCreate(automaticAppDiscount: $automaticAppDiscount) {
      userErrors {
        field
        message
      }
      automaticAppDiscount {
        discountId
        title
        startsAt
        endsAt
        status
        appDiscountType {
          appKey
          functionId
          title
          description
          }
        combinesWith {
        orderDiscounts
        productDiscounts
        shippingDiscounts
        }
      }
    }
  }`;

export const UPDATE_DISCOUNT_QUERY = `
    mutation discountAutomaticAppUpdate($automaticAppDiscount: DiscountAutomaticAppInput!, $id: ID!) {
    discountAutomaticAppUpdate(automaticAppDiscount: $automaticAppDiscount, id: $id) {
      automaticAppDiscount {
        title
      }
      userErrors {
        field
        message
      }
    }
  }`;