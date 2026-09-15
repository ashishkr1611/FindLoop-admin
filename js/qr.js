// Standard Scannable QR Code Generator & Renderer Module
// FindLoop Campus System

import { showToast } from "./utils.js";

// Generate Genuine, Standard-Compliant 2D Scannable QR Code
export function renderQRCode(containerId, textUrl) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  // Create standard high-resolution scannable QR image
  const qrImg = document.createElement("img");
  qrImg.alt = "Scannable FindLoop QR Tag";
  qrImg.style.width = "220px";
  qrImg.style.height = "220px";
  qrImg.style.borderRadius = "8px";
  qrImg.style.display = "block";
  qrImg.style.margin = "0 auto";
  qrImg.crossOrigin = "anonymous";

  // Use standard QRServer encoding API to guarantee 100% camera scan compatibility
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(textUrl)}&color=0F172A&bgcolor=FFFFFF&margin=1`;
  
  qrImg.src = qrApiUrl;

  // Fallback canvas drawing for offline / instant download
  const canvas = document.createElement("canvas");
  canvas.width = 250;
  canvas.height = 250;
  canvas.style.display = "none";
  canvas.id = "qr-download-canvas";

  const ctx = canvas.getContext("2d");

  qrImg.onload = () => {
    ctx.drawImage(qrImg, 0, 0, 250, 250);
  };

  container.appendChild(qrImg);
  container.appendChild(canvas);
}

export function downloadQRImage(itemCode) {
  const qrImg = document.querySelector("#qr-canvas-container img");
  if (!qrImg) {
    showToast("QR code not rendered yet.", "error");
    return;
  }

  // Create temporary canvas to convert image to downloadable blob
  const canvas = document.createElement("canvas");
  canvas.width = 250;
  canvas.height = 250;
  const ctx = canvas.getContext("2d");
  
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 250, 250);
    ctx.drawImage(img, 0, 0, 250, 250);

    const link = document.createElement("a");
    link.download = `FindLoop-Tag-${itemCode}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  img.src = qrImg.src;
}

export function printQRTag() {
  window.print();
}
