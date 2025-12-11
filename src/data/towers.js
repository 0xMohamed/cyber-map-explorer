const towersData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        "panel-info": "Paris, 1889",
        maki: "https://i.postimg.cc/26npwrVs/effiel-pin.png",
        name: "Eiffel Tower",
        src: "https://www.ulysses.travel/wp-content/uploads/2023/01/Tour-Eiffel-Paris.jpg",
        desc: "Originally constructed for the 1889 World’s Fair, the Eiffel Tower later became a vital radio transmission tower. At 330 meters, it remains one of the world’s most recognized structures, representing French innovation and culture.",
        pitch: 65,
        bearing: -11.2,
        zoom: 15.9,
      },
      geometry: {
        coordinates: [2.2945245246351655, 48.85824690254192],
        type: "Point",
      },
      id: "paris",
    },
  ],
};

export { towersData };
