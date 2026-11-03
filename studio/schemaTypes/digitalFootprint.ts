export default {
  name: "digitalFootprint",
  title: "Digital Footprint",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Page Title",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "content",
      title: "Detailed Content",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
};
