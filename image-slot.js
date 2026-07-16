(function () {
  "use strict";
  class ImageSlot extends HTMLElement {
    connectedCallback() {
      if (this.querySelector("img")) return;
      const image = document.createElement("img");
      image.src = this.getAttribute("src") || "";
      image.alt = this.getAttribute("placeholder") || "";
      image.loading = "lazy";
      image.style.cssText = "display:block;width:100%;height:100%;object-fit:cover";
      if (this.getAttribute("shape") === "circle") image.style.borderRadius = "50%";
      if (this.getAttribute("shape") === "rounded") image.style.borderRadius = (this.getAttribute("radius") || "16") + "px";
      this.style.display = "block"; this.style.overflow = "hidden"; this.appendChild(image);
    }
  }
  if (!customElements.get("image-slot")) customElements.define("image-slot", ImageSlot);
}());
