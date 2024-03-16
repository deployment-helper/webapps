const layouts = [
  {
    id: "layout1",
    componentName: "TitleSubtitle",
    image: "/layout1.png",
    content: {
      title: {
        type: "input",
        name: "title",
        value: "Title",
        placeholder: "Title",
      },
      subtitle: {
        type: "input",
        name: "subtitle",
        value: "Subtitle",
        placeholder: "Subtitle",
      },
    },
  },
  {
    id: "layout2",
    componentName: "Image",
    image: "/layout2.png",
    content: {
      image: {
        type: "image",
        name: "image",
        value: "https://via.placeholder.com/150",
        placeholder: "Image",
      },
    },
  },
  {
    id: "layout3",
    componentName: "Title",
    image: "/layout3.png",
    content: {
      title: {
        type: "input",
        name: "title",
        value: "Title",
        placeholder: "Title",
      },
    },
  },
];

export default layouts;
