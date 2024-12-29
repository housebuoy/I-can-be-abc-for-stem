import { client } from "../../sanity/lib/client";

// Function to fetch products with sorting options
export async function getProducts(sortOption = "default") {
  let sortQuery = '';  // Default value for sorting
  
  // Set sorting query based on the selected sortOption
  switch (sortOption) {
    case 'priceLowHigh':
      sortQuery = 'price asc'; // Sort by price ascending
      break;
    case 'priceHighLow':
      sortQuery = 'price desc'; // Sort by price descending
      break;
    case 'newest':
      sortQuery = 'createdAt desc'; // Sort by creation date (newest first)
      break;
    case 'bestSelling':
      sortQuery = 'salesCount desc'; // Assuming salesCount is a field for best-sellers
      break;
    default:
      sortQuery = 'createdAt desc'; // Default sorting by newest products
  }
  

  // Sanity GROQ query to fetch products with sorting
  const query = `
    *[_type == "product"] | order(${sortQuery}) {
      title,
      description,
      price,
      "imageUrl": image.asset->url,
      isNew,
      discount,
      code,
      category->{
        title
      }
    }
  `;

  // const countQuery = `count(*[_type == "product"])`;
  // const [count] = await Promise.all([
  //   client.fetch(countQuery),
  // ]);

  
  // const products = await client.fetch(query);
  try {
    // Fetch products and count concurrently
    const [products] = await Promise.all([
      client.fetch(query),
    ]);
    
    return products;
  } catch (error) {
    console.error("Error fetching products", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductsCount(sortOption = "default") {
  let sortQuery = '';  // Default value for sorting
  
  // Set sorting query based on the selected sortOption
  switch (sortOption) {
    case 'priceLowHigh':
      sortQuery = 'price asc'; // Sort by price ascending
      break;
    case 'priceHighLow':
      sortQuery = 'price desc'; // Sort by price descending
      break;
    case 'newest':
      sortQuery = 'createdAt desc'; // Sort by creation date (newest first)
      break;
    case 'bestSelling':
      sortQuery = 'salesCount desc'; // Assuming salesCount is a field for best-sellers
      break;
    default:
      sortQuery = 'createdAt desc'; // Default sorting by newest products
  }
  

  // Sanity GROQ query to fetch products with sorting
  const query = `
    *[_type == "product"] | order(${sortQuery}) {
      title,
      description,
      price,
      "imageUrl": image.asset->url,
      isNew,
      discount,
      code,
      category->{
        title
      }
    }
  `;

    const countQuery = `count(*[_type == "product"])`;
    const [count] = await Promise.all([
      client.fetch(countQuery),
    ]);
    return { count };

  
  // const products = await client.fetch(query);

  // try {
  //   // Fetch products and count concurrently
  //   const [products, count] = await Promise.all([
  //     client.fetch(query),
  //     client.fetch(countQuery),
  //   ]);
    
  //   return { products: Array.isArray(products) ? products : [], count };
  // } catch (error) {
  //   console.error("Error fetching products or count:", error);
  //   throw new Error("Failed to fetch products or count");
  // }
}

export async function getCategories() {
  const query = `
    *[_type == "category"] {
      _id,
      title,
      description,
      "imageUrl": image.asset->url
    }
  `;
  
  const categories = await client.fetch(query);
  return categories;
}

// Fetch related products by category ID
export const getRelatedProductsByCategoryTitle = async (categoryTitle, productId) => {
  const query = `*[_type == "product" && category->title == $categoryTitle && code != $productId][0..2]{
    _id,
    code,
    title,
    description,
    price,
    "imageUrl": image.asset->url
  }`;  
  const params = { productId, categoryTitle };
  return await client.fetch(query, params);
};





export const getProductByCode = async (code) => {
  const query = `*[_type == "product" && code == $code][0]{
    code,
    title,
    price,
    "imageUrl": image.asset->url,
    description,
    comments,
    category->{
      title,
      _id
    }
  }`;
  return await client.fetch(query, { code });
};


export const getCouponByCode = async (code) => {
  const query = `*[_type == "coupon" && code == $code][0]{
    ...,
    category->{
      title,
      _id
    },
    product-> { _id, code }
  }`;
  const params = { code };
  return await client.fetch(query, params);
};
