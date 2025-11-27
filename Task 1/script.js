const images = document.querySelectorAll('.gallery img');
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.close');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');

let currentIndex = 0;

// OPEN LIGHTBOX
images.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;
    showImage();
    lightbox.style.display = 'flex';
  });
});

// CLOSE LIGHTBOX
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

// NEXT IMAGE
nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex >= images.length) currentIndex = 0;
  showImage();
});

// PREVIOUS IMAGE
prevBtn.addEventListener('click', () => {
  currentIndex--;
  if (currentIndex < 0) currentIndex = images.length - 1;
  showImage();
});

function showImage() {
  lightboxImg.src = images[currentIndex].src;
}
