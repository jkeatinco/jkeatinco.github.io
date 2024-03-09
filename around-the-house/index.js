import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0";

env.allowLocalModels = false;

const fileUpload = document.getElementById("file-upload");
const imageContainer = document.getElementById("image-container");
const status = document.getElementById("status");

status.textContent = "Loading model...";

const detector = await pipeline("object-detection", "Xenova/detr-resnet-50");

status.textContent = "Ready";

fileUpload.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
  
    const reader = new FileReader();
  
    // Set up a callback when the file is loaded
    reader.onload = function (e2) {
      imageContainer.innerHTML = "";
      const image = document.createElement("img");
      image.src = e2.target.result;
      imageContainer.appendChild(image);
      detect(image);
    };
    reader.readAsDataURL(file);
  });

  async function detect(img) {
    status.textContent = "Analysing...";
    const output = await detector(img.src, {
      threshold: 0.5,
      percentage: true,
    });
    status.textContent = "";
    console.log("output", output);
    output.forEach(renderBox);
  }

  // Render a bounding box and label on the image
function renderBox({ box, label }) {
    const { xmax, xmin, ymax, ymin } = box;
  
    // Generate a random color for the box
    const color = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, 0);
  
    // Draw the box
    const boxElement = document.createElement("div");
    boxElement.className = "bounding-box";
    Object.assign(boxElement.style, {
      borderColor: color,
      left: 100 * xmin + "%",
      top: 100 * ymin + "%",
      width: 100 * (xmax - xmin) + "%",
      height: 100 * (ymax - ymin) + "%",
    });
  
    // Draw the label
    const labelElement = document.createElement("span");
    labelElement.textContent = label;
    labelElement.className = "bounding-box-label";
    labelElement.style.backgroundColor = color;
  
    boxElement.appendChild(labelElement);
    imageContainer.appendChild(boxElement);
  }