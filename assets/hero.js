const slider = document.getElementById("slider");
const slides = slider.children.length;
let currentIndex = 0;

setInterval(() => {
  currentIndex = (currentIndex + 1) % slides;
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}, 5000);
