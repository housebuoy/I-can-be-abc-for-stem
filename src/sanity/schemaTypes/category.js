const categorySchema = {
    name: "category",
    title: "Category",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Title",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "description",
        title: "Description",
        type: "text",
      },
      {
        name: "image",
        title: "Category Image",
        type: "image",
        validation: (Rule) => Rule.required(),
    },
    {
      name: "order",
      title: "Display Order",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(100),
      description: "Lower numbers appear first",
    },
    ],
  };
  
  export default categorySchema;
  