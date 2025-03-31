<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Advanced Multi-Slot Frame Animation Tool</title>
  <style>
    /* Basic styling */
    body {
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1e1e2f, #2a2a40);
      color: white;
      font-family: Arial, sans-serif;
      overflow: hidden;
    }

    h1 {
      margin-bottom: 20px;
      font-size: 2.5rem;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }

    /* Container for the slots and animation */
    .container {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    /* Slots for images */
    .slots {
      display: grid;
      grid-template-columns: repeat(3, 1fr); /* 3 columns */
      gap: 10px;
      width: 300px;
    }

    .slot {
      width: 100px;
      height: 100px;
      border: 2px dashed #444;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.1);
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
    }

    .slot:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }

    .slot img {
      max-width: 100%;
      max-height: 100%;
      display: none; /* Hide initially */
    }

    .slot.active img {
      display: block; /* Show when image is added */
    }

    .slot .delete-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      background: red;
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      cursor: pointer;
      display: none;
    }

    .slot:hover .delete-btn {
      display: block;
    }

    /* Animation container */
    .animation-container {
      width: 500px;
      height: 500px;
      border: 5px solid #444;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      background-color: #000;
      position: relative;
    }

    /* Frames/images in the animation */
    .frame {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    }

    .frame.active {
      opacity: 1;
    }

    /* Controls */
    .controls {
      margin-top: 20px;
      display: flex;
      gap: 10px;
      align-items: center;
    }

    /* Button styling */
    button {
      padding: 10px 20px;
      font-size: 16px;
      background-color: #444;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #666;
    }

    /* Frame preview */
    .frame-preview {
      display: flex;
      gap: 5px;
      margin-top: 20px;
    }

    .frame-preview img {
      width: 50px;
      height: 50px;
      border: 2px solid #444;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .frame-preview img:hover {
      transform: scale(1.1);
    }
  </style>
</head>
<body>
  <h1>Advanced Frame Animation Tool</h1>
  <div class="container">
    <!-- Slots for images -->
    <div class="slots" id="slots">
      <div class="slot" data-index="0">Slot 1</div>
      <div class="slot" data-index="1">Slot 2</div>
      <div class="slot" data-index="2">Slot 3</div>
    </div>

    <!-- Animation container -->
    <div class="animation-container" id="animation-container">
      <!-- Frames will be dynamically added here -->
    </div>
  </div>

  <div class="controls">
    <!-- Play/Pause button -->
    <button id="play-pause-btn">Play</button>

    <!-- Speed control -->
    <label for="speed-control">Speed:</label>
    <input type="range" id="speed-control" min="50" max="500" value="200">

    <!-- Redirect button -->
    <button id="redirect-btn">Go to Another Page</button>

    <!-- Save Animation button -->
    <button id="save-btn">Save as GIF</button>
  </div>

  <!-- Frame Preview -->
  <div class="frame-preview" id="frame-preview"></div>

  <script>
    const slots = document.getElementById("slots");
    const animationContainer = document.getElementById("animation-container");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const speedControl = document.getElementById("speed-control");
    const redirectBtn = document.getElementById("redirect-btn");
    const saveBtn = document.getElementById("save-btn");
    const framePreview = document.getElementById("frame-preview");

    let frames = [];
    let currentFrameIndex = 0;
    let isPlaying = false;
    let intervalId;

    // Function to handle image upload
    slots.addEventListener("click", (event) => {
      const slot = event.target;
      if (slot.classList.contains("slot")) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = document.createElement("img");
              img.src = e.target.result;
              slot.innerHTML = ""; // Clear slot text
              slot.appendChild(img);
              slot.classList.add("active");

              // Add frame to animation container
              const frame = img.cloneNode();
              frame.classList.add("frame");
              animationContainer.appendChild(frame);

              // Update frames array
              frames.push(frame);

              // Add frame to preview
              const previewImg = img.cloneNode();
              previewImg.addEventListener("click", () => {
                frames.forEach((f) => f.classList.remove("active"));
                frame.classList.add("active");
              });
              framePreview.appendChild(previewImg);

              // Add delete button
              const deleteBtn = document.createElement("button");
              deleteBtn.classList.add("delete-btn");
              deleteBtn.textContent = "×";
              deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                slot.innerHTML = "Slot " + (slot.dataset.index + 1);
                slot.classList.remove("active");
                animationContainer.removeChild(frame);
                framePreview.removeChild(previewImg);
                frames = frames.filter((f) => f !== frame);
              });
              slot.appendChild(deleteBtn);
            };
            reader.readAsDataURL(file);
          }
        };

        input.click();
      }
    });

    // Drag-and-drop functionality
    slots.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    slots.addEventListener("drop", (e) => {
      e.preventDefault();
      const slot = e.target;
      if (slot.classList.contains("slot")) {
        const file = e.dataTransfer.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            slot.innerHTML = "";
            slot.appendChild(img);
            slot.classList.add("active");

            const frame = img.cloneNode();
            frame.classList.add("frame");
            animationContainer.appendChild(frame);
            frames.push(frame);

            const previewImg = img.cloneNode();
            previewImg.addEventListener("click", () => {
              frames.forEach((f) => f.classList.remove("active"));
              frame.classList.add("active");
            });
            framePreview.appendChild(previewImg);

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.textContent = "×";
            deleteBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              slot.innerHTML = "Slot " + (slot.dataset.index + 1);
              slot.classList.remove("active");
              animationContainer.removeChild(frame);
              framePreview.removeChild(previewImg);
              frames = frames.filter((f) => f !== frame);
            });
            slot.appendChild(deleteBtn);
          };
          reader.readAsDataURL(file);
        }
      }
    });

    // Function to start the animation
    function startAnimation() {
      if (frames.length === 0) return;

      isPlaying = true;
      playPauseBtn.textContent = "Pause";

      intervalId = setInterval(() => {
        frames.forEach((frame) => frame.classList.remove("active"));
        frames[currentFrameIndex].classList.add("active");
        currentFrameIndex = (currentFrameIndex + 1) % frames.length;
      }, speedControl.value);
    }

    // Function to stop the animation
    function stopAnimation() {
      isPlaying = false;
      playPauseBtn.textContent = "Play";
      clearInterval(intervalId);
    }

    // Play/Pause button functionality
    playPauseBtn.addEventListener("click", () => {
      if (isPlaying) {
        stopAnimation();
      } else {
        startAnimation();
      }
    });

    // Speed control functionality
    speedControl.addEventListener("input", () => {
      if (isPlaying) {
        stopAnimation();
        startAnimation();
      }
    });

    // Redirect button functionality
    redirectBtn.addEventListener("click", () => {
      window.location.href = "another-page.html"; // Replace with the name of your HTML file
    });

    // Save as GIF functionality (requires gif.js library)
    saveBtn.addEventListener("click", () => {
      alert("Save as GIF functionality is not implemented yet. Use a library like gif.js!");
    });
  </script>
</body>
</html>