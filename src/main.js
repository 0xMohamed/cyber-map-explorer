import mapboxgl from "mapbox-gl";
import { towersData } from "./data/towers";
import { removeClass, addClass } from "./utils.js";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

let clickSound = new Audio("/sounds/click-sound.mp3");
let closeSound = new Audio("/sounds/close-sound.mp3");

let isEditMode = false;

const nav = document.querySelector(".nav");
const navList = document.querySelector(".nav>ul");
const popup = document.querySelector(".cyberpunk-popup");
const closeButton = document.querySelector(".close-btn");
const popupHeading = document.querySelector(".popup-title");
const popupImage = document.querySelector(".popup-image > img");
const popupDescription = document.querySelector(".popup-text");
const panel = document.querySelector("#cyberpunkPanel");

const form = document.querySelector("#cyberpunkPanel form");

const toggleMenu = document.querySelector("#toggleMenu");
const editButton = document.querySelector("#edit");
const deleteButton = document.querySelector("#delete");

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/0xmohamed/cm94r6wns00b801r0b1dtceh7",
  center: [108.6, 32.2],
  zoom: 1.06,
  hash: true,
  antialias: true,
});
document.querySelector(".mapboxgl-control-container").remove();

map.on("style.load", () => {
  map.setConfigProperty("basemap", "lightPreset", "dusk");
});

function flyTo(item) {
  map.flyTo({
    center: item.geometry.coordinates,
    pitch: item.properties.pitch,
    bearing: item.properties.bearing,
    zoom: item.properties.zoom,
    essential: true,
    speed: 0.6,
    curve: 1.5,
    easing: function (t) {
      return t * (2 - t);
    },
  });
}

function updatePopupContent(heading, src, desc, id) {
  popup.dataset.id = id;
  popupHeading.textContent = heading;
  popupHeading.dataset.text = heading;
  popupImage.src = src;
  popupDescription.textContent = desc;
}

let isFlying = false;

function createTowerPanel(itemName, itemDesc, id) {
  const container = document.createElement("li");
  container.classList.add("nav-item");
  container.setAttribute("id", id);

  const name = document.createElement("span");
  name.textContent = itemName;

  container.append(name);

  container.addEventListener("click", () => {
    clickSound.play();

    const selectedItem = towersData.features.find(
      (feature) => feature.id === id
    );

    if (isFlying) {
      map.stop();
      setTimeout(() => {
        flyToAndUpdatePopup(selectedItem);
      }, 100);
    } else {
      flyToAndUpdatePopup(selectedItem);
    }
  });

  return container;
}

function flyToAndUpdatePopup(selectedItem) {
  isFlying = true;
  flyTo(selectedItem);
  addClass(popup, "hidden");

  const { coordinates } = selectedItem.geometry;

  const checkMoveEnd = () => {
    const currentCenter = map.getCenter();

    const tolerance = 0.00001;
    const lngDiff = Math.abs(currentCenter.lng - coordinates[0]);
    const latDiff = Math.abs(currentCenter.lat - coordinates[1]);

    if (lngDiff < tolerance && latDiff < tolerance) {
      removeClass(popup, "hidden");
      removeClass(editButton, "hidden");
      removeClass(deleteButton, "hidden");
      updatePopupContent(
        selectedItem.properties.name,
        selectedItem.properties.src,
        selectedItem.properties.desc,
        selectedItem.id
      );
      isFlying = false;
      map.off("move", checkMoveEnd);
    }
  };

  map.on("move", checkMoveEnd);
}

function initializeTowers(towersData) {
  towersData.features.forEach((item) => {
    const tower = createTowerPanel(
      item.properties.name,
      item.properties["panel-info"],
      item.id
    );
    //   towerPanels.push(tower);
    navList.append(tower);
  });
}
function appendNewTower(newItem) {
  const tower = createTowerPanel(
    newItem.properties.name,
    newItem.properties["panel-info"],
    newItem.id
  );
  navList.append(tower);
}

initializeTowers(towersData);

closeButton.addEventListener("click", () => {
  addClass(popup, "hidden");
  addClass(editButton, "hidden");
  addClass(deleteButton, "hidden");
  closeSound.play();
});

const pitchInput = document.querySelector('form [name="pitch"]');
const bearingInput = document.querySelector('form [name="bearing"]');
const zoomInput = document.querySelector('form [name="zoom"]');
const coordinatesInput = document.querySelector('form [name="coordinates"]');

function getFormData(form) {
  const data = {};
  const fields = form.querySelectorAll("input, textarea");
  fields.forEach((field) => {
    if (field.name) {
      data[field.name] = field.value;
    }
  });
  return data;
}
function resetFormInputs(form) {
  const fields = form.querySelectorAll("input, textarea");
  fields.forEach((field) => {
    field.value = ""; // إعادة تعيين القيم
    if (field.type === "checkbox" || field.type === "radio") {
      field.checked = false; // إعادة تعيين حالة الاختيار في الـ checkbox و الـ radio
    }
  });
}

function parseCoordinates(str) {
  if (typeof str !== "string") return null;

  const parts = str.split(",").map((s) => parseFloat(s.trim()));

  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    return null;
  }

  return [parts[0], parts[1]]; // [lng, lat]
}

toggleMenu.addEventListener("click", () => {
  resetFormInputs(form);
  form.querySelector(`h2`).textContent = "Add New Tower";
  form.querySelector(`button`).textContent = "Add Tower";

  if (isEditMode) {
    isEditMode = false;
    removeClass(nav, "hidden");
    addClass(panel, "hidden");
  } else {
    isEditMode = true;
    addClass(popup, "hidden");
    addClass(nav, "hidden");
    removeClass(panel, "hidden");

    const { lng, lat } = map.getCenter();
    pitchInput.value = Math.round(map.getPitch());
    bearingInput.value = Math.round(map.getBearing());
    zoomInput.value = Math.round(map.getZoom());
    coordinatesInput.value = `${lng}, ${lat}`;
  }
});

deleteButton.addEventListener("click", () => {
  const id = popup.dataset.id;
  towersData.features = towersData.features.filter((item) => item.id !== id);
  document.querySelector(`nav .nav-item#${id}`).remove();
  addClass(popup, "hidden");
  loadTowerIcons(towersData);
  renderTowers(towersData);
  addClass(deleteButton, "hidden");
  addClass(editButton, "hidden");
});

editButton.addEventListener("click", () => {
  if (isEditMode) {
    isEditMode = false;
    addClass(panel, "hidden");
    removeClass(popup, "hidden");
    removeClass(nav, "hidden");
    resetFormInputs(form);
    toggleMenu.disabled = false;
    removeClass(toggleMenu, "disabled");
  } else {
    isEditMode = true;
    toggleMenu.disabled = true;
    addClass(toggleMenu, "disabled");
    const id = popup.dataset.id;
    removeClass(panel, "hidden");
    addClass(popup, "hidden");
    addClass(nav, "hidden");
    const item = towersData.features.find((item) => item.id === id);

    form.dataset.id = id;
    form.querySelector(`h2`).textContent = "Edit Tower";
    form.querySelector(`button`).textContent = "Update Tower";

    form.querySelector('input[name="panel-info"]').value =
      item.properties["panel-info"];
    form.querySelector('input[name="maki"]').value = item.properties.maki;
    form.querySelector('input[name="name"]').value = item.properties.name;
    form.querySelector('input[name="src"]').value = item.properties.src;
    form.querySelector('textarea[name="desc"]').value = item.properties.desc;
    form.querySelector('input[name="pitch"]').value = item.properties.pitch;
    form.querySelector('input[name="bearing"]').value = item.properties.bearing;
    form.querySelector('input[name="zoom"]').value = item.properties.zoom;
    form.querySelector(
      'input[name="coordinates"]'
    ).value = `${item.geometry.coordinates[0]}, ${item.geometry.coordinates[1]}`;
  }
});

document
  .querySelector("#cyberpunkPanel form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const id = this.dataset.id;

    const data = getFormData(this);

    const newItem = {
      type: "Feature",
      properties: {
        "panel-info": data["panel-info"],
        maki: data.maki,
        name: data.name,
        src: data.src,
        desc: data.desc,
        pitch: data.pitch,
        bearing: data.bearing,
        zoom: data.zoom,
      },
      geometry: {
        coordinates: parseCoordinates(data.coordinates),
        type: "Point",
      },
      id: id ? id : generateUUID(),
    };

    if (id) {
      const index = towersData.features.findIndex((item) => item.id === id);
      towersData.features[index] = newItem;
      this.dataset.id = "";
      addClass(editButton, "hidden");
      addClass(deleteButton, "hidden");
    } else {
      towersData.features.push(newItem);
      appendNewTower(newItem);
    }

    addClass(panel, "hidden");
    removeClass(nav, "hidden");
    resetFormInputs(this);
    loadTowerIcons(towersData);
    renderTowers(towersData);
    toggleMenu.disabled = false;
    removeClass(toggleMenu, "disabled");
  });

document.addEventListener("mousemove", function (e) {
  const cursor = document.querySelector(".cursor");
  const x = e.clientX;
  const y = e.clientY;
  cursor.style.left = `${x - cursor.offsetWidth / 2}px`;
  cursor.style.top = `${y - cursor.offsetHeight / 2}px`;
});

function generateUUID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function updateFormData(form, map) {
  if (isEditMode) {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const pitch = map.getPitch();
    const bearing = map.getBearing();

    form.querySelector(
      'input[name="coordinates"]'
    ).value = `${center.lng}, ${center.lat}`;
    form.querySelector('input[name="zoom"]').value = zoom;
    form.querySelector('input[name="pitch"]').value = pitch;
    form.querySelector('input[name="bearing"]').value = bearing;
  }
}

map.on("move", function () {
  updateFormData(form, map);
});

map.on("zoom", function () {
  updateFormData(form, map);
});

map.on("pitch", function () {
  updateFormData(form, map);
});

map.on("bearing", function () {
  updateFormData(form, map);
});

let framesPerSecond = 300;
let initialOpacity = 1;
let opacity = initialOpacity;
let initialRadius = 5;
let radius = initialRadius;
let maxRadius = 25;

function loadTowerIcons(data) {
  data.features.forEach((item) => {
    if (!map.hasImage(item.properties.maki)) {
      map.loadImage(item.properties.maki, function (error, image) {
        if (error) throw error;
        map.addImage(item.properties.maki, image);
      });
    }
  });
}

function renderTowers(data) {
  if (map.getSource("towerPoints")) {
    map.getSource("towerPoints").setData(data);
  } else {
    map.addSource("towerPoints", { type: "geojson", data });
  }

  if (!map.getLayer("dot")) {
    map.addLayer({
      id: "dot",
      type: "circle",
      source: "towerPoints",
      maxzoom: 14,
      paint: {
        "circle-radius": initialRadius,
        "circle-radius-transition": { duration: 0 },
        "circle-opacity-transition": { duration: 0 },
        "circle-color": "#ffffff",
        "circle-emissive-strength": 1,
        "circle-opacity": 0.6,
      },
    });
  }

  if (!map.getLayer("dot-1")) {
    map.addLayer({
      id: "dot-1",
      type: "circle",
      source: "towerPoints",
      maxzoom: 14,
      paint: {
        "circle-radius": 3,
        "circle-color": "#aaa",
        "circle-emissive-strength": 1,
        "circle-opacity": 1,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 2,
      },
    });
  }

  if (!map.getLayer("towersPin")) {
    map.addLayer({
      id: "towersPin",
      source: "towerPoints",
      type: "symbol",
      minzoom: 2,
      layout: {
        "icon-allow-overlap": true,
        "icon-image": ["get", "maki"],
        "icon-size": ["interpolate", ["linear"], ["zoom"], 2, 0.5, 12, 0.8],
        "symbol-placement": "point",
        "symbol-z-elevate": true,
        "text-field": ["to-string", ["get", "name"]],
        "text-font": ["Manrope Medium", "Arial Unicode MS Bold"],
        "text-anchor": "top",
        "text-offset": [0, 1.6],
        "text-size": ["interpolate", ["linear"], ["zoom"], 2, 11, 12, 13],
        "text-max-width": 5,
      },
      paint: {
        "text-color": [
          "interpolate",
          ["linear"],
          ["measure-light", "brightness"],
          0.28,
          "hsl(0, 0%, 100%)",
          0.3,
          "hsl(0, 0%, 0%)",
        ],
        "text-emissive-strength": 1,
        "text-halo-color": "hsl(0, 0%, 0%)",
        "text-halo-width": 1,
      },
    });

    map.on("click", "towersPin", (e) => {
      const clickedItem = e.features[0];
      flyTo(clickedItem);
      removeClass(popup, "hidden");
      updatePopupContent(
        clickedItem.properties.name,
        clickedItem.properties.src,
        clickedItem.properties.desc,
        clickedItem.id
      );
    });
  }

  // Start animation (only once)
  if (!map.__towerAnimationStarted) {
    map.__towerAnimationStarted = true;

    function animateMarker(timestamp) {
      requestAnimationFrame(animateMarker);
      radius += (maxRadius - radius) / framesPerSecond;
      opacity -= 0.9 / framesPerSecond;
      opacity = Math.max(0, opacity);
      map.setPaintProperty("dot", "circle-radius", radius);
      map.setPaintProperty("dot", "circle-opacity", opacity);
      if (opacity <= 0) {
        radius = initialRadius;
        opacity = initialOpacity;
      }
    }

    animateMarker(0);
  }
}

map.on("style.load", () => {
  loadTowerIcons(towersData);
  renderTowers(towersData);
});
