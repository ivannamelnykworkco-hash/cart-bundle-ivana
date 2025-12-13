export const GET_PRODUCT_QUERY = `
query getProducts {
  products(first: 100) {
    edges {
      node {
        id
        title
        featuredImage {
          url
        }
        metafields(first: 5) {
        edges {
          node {
            id
            namespace
            key
            value
            type
          }
        }
      }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price
              inventoryQuantity
              compareAtPrice
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
  collections(first: 20) {
    edges {
      node {
        id
        title
        image {
          url
        }
      }
    }
  }
  shopifyFunctions(first: 10) {
    edges {
      node {
        id
        apiType
        title
      }
    }
  }
}`;