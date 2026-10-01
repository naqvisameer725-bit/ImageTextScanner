const imageInput = document.getElementById("imageInput");
const scanBtn = document.getElementById("scanBtn");
const result = document.getElementById("result");
const status = document.getElementById("status");
const copyBtn = document.getElementById("copyBtn");

scanBtn.addEventListener("click", async () => {
  if (!imageInput.files.length) {
    status.textContent = "Please select an image first.";
    return;
  }

  const file = imageInput.files[0];

  status.textContent = "Scanning image...";
  result.value = "";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("apikey", "helloworld");
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");

  try {
    const response = await fetch(
      "https://api.ocr.space/parse/image",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    if (data.ParsedResults && data.ParsedResults.length > 0) {
      result.value = data.ParsedResults
        .map(item => item.ParsedText)
        .join("\n");

      status.textContent = "✓ Text extracted!";
    } else {
      status.textContent = "No text found.";
    }

  } catch (error) {
    console.error(error);
    status.textContent = "Error scanning image.";
  }
});

copyBtn.addEventListener("click", async () => {
  if (!result.value) return;

  await navigator.clipboard.writeText(result.value);
  status.textContent = "✓ Text copied!";
});
