const couponSchema = {
    name: "coupon",
    title: "Coupons",
    type: "document",
    fields: [
      {
        name: "code",
        title: "Coupon Code",
        type: "string",
        validation: (Rule) => Rule.required().min(5),
      },
      {
        name: "discount",
        title: "Discount (%)",
        type: "number",
        validation: (Rule) => Rule.min(1).max(100).required(),
      },
      {
        name: "expiryDate",
        title: "Expiry Date",
        type: "datetime",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "status",
        title: "Status",
        type: "string",
        options: {
          list: [
            { title: "Active", value: "active" },
            { title: "Inactive", value: "inactive" },
          ],
        },
        validation: (Rule) => Rule.required(),
      },
      {
        name: "applyTo",
        title: "Applies To",
        type: "string",
        options: {
          list: [
            { title: "All Products", value: "all" },
            { title: "Specific Category", value: "category" },
            { title: "Specific Product", value: "product" },
          ],
        },
        validation: (Rule) => Rule.required(),
      },
      {
        name: "category",
        title: "Category (If applies to a specific category)",
        type: "reference",
        to: [{ type: "category" }],
        hidden: ({ parent }) => parent?.applyTo !== "category", // Show only if the coupon applies to a category
      },
      {
        name: "product",
        title: "Product (If applies to a specific product)",
        type: "reference",
        to: [{ type: "product" }],
        hidden: ({ parent }) => parent?.applyTo !== "product", // Show only if the coupon applies to a product
      },
    ],
  };

  export default couponSchema;
  