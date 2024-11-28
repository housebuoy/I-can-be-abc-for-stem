const productSchema = {
    name: "product",
    title: "Product",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Title",
        type: "string",
        validation: (Rule) => Rule.required().min(2).max(100),
      },
      {
        name: "description",
        title: "Description",
        type: "text",
        validation: (Rule) => Rule.required().min(10).max(50),
      },
      {
        name: "comments",
        title: "Comments",
        type: "text",
        validation: (Rule) => 
          Rule.max(250).warning("Comments should not exceed 100 words"),
      },
      {
        name: "code",
        title: "Product Code",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "price",
        title: "Price",
        type: "number",
        validation: (Rule) => Rule.required().positive(),
      },
      {
        name: "image",
        title: "Image",
        type: "image",
        options: {
          hotspot: true,
        },
        validation: (Rule) => Rule.required(),
      },
      {
        name: "isNew",
        title: "Is New",
        type: "boolean",
      },
      {
        name: "discount",
        title: "Discount (%)",
        type: "number",
      },
      {
        name: "category",
        title: "Category",
        type: "reference",
        to: [{ type: "category" }],
        validation: (Rule) => Rule.required(),
      },
    ],
  };
  
  export default productSchema;
  