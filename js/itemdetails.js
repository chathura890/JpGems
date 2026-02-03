/* -------------------------
   Data & initial values
   ------------------------- */
const product = {
  name: "Premium Blue Sapphire Collection",
  price: 1250.00,       // USD
  stock: 12,
  description: document.getElementById ? null : '', // description shown in HTML
  images: [
    "../images/blue-sapphires.jpg",
    "../images/bs1.jpg", 
    "../images/img1.jpg",
    "../images/img2.jpg",
    "../images/img3.jpg",
    "../images/img4.jpg"
  ],
  video: "https://www.w3schools.com/html/mov_bbb.mp4"
};

/* Shipping rates (base shipping USD) - illustrative */
const shippingRates = {
  US: 35.00,
  GB: 42.00,
  AU: 55.00,
  DE: 45.00,
  LK: 8.00,
  IN: 12.00,
  JP: 48.00,
  CA: 50.00
};

/* Tax rates by country (percentage) - illustrative */
const taxRates = {
  US: 0.07,
  GB: 0.20,
  AU: 0.10,
  DE: 0.19,
  LK: 0.08,
  IN: 0.18,
  JP: 0.10,
  CA: 0.13
};

/* DOM refs */
const mediaStage = document.querySelector('.media-stage');
const thumbColumn = document.getElementById('thumbColumn');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');

const productNameEl = document.getElementById('productName');
const priceValueEl = document.getElementById('priceValue');
const stockCountEl = document.querySelector('.stock span');

const countrySelect = document.getElementById('countrySelect');
const shippingCostText = document.getElementById('shippingCostText');
const taxText = document.getElementById('taxText');
const totalText = document.getElementById('totalText');

const buyNowBtn = document.getElementById('buyNowBtn');
const addToCartBtn = document.getElementById('addToCartBtn');
const sellerContactEl = document.getElementById('sellerContact');

const zoomModal = document.getElementById('zoomModal');
const zoomMedia = document.querySelector('.zoom-media');
const closeZoomBtn = document.querySelector('.close-zoom');

// Review form elements
const reviewForm = document.getElementById('reviewForm');
const starRatingInputs = document.querySelectorAll('input[name="rating"]');
const starRatingLabels = document.querySelectorAll('.star-rating label');

// Error handling for missing elements
if (!reviewForm) console.warn('Review form not found');
if (starRatingInputs.length === 0) console.warn('Star rating inputs not found');
if (starRatingLabels.length === 0) console.warn('Star rating labels not found');

/* -------------------------
   Initialize page
   ------------------------- */
let currentIndex = 0; // 0..images.length (last index may be video)
const mediaItems = [...product.images, product.video]; // last is video

function formatUSD(v){ return `$${v.toFixed(2)}`; }

function initPage(){
  productNameEl.textContent = product.name;
  priceValueEl.textContent = formatUSD(product.price);
  stockCountEl.textContent = product.stock;

  // render main viewer
  renderMedia(currentIndex);

  // render thumbnails (images then video thumb)
  thumbColumn.innerHTML = '';
  mediaItems.forEach((src, idx) => {
    const t = document.createElement('div'); t.className = 'thumb'; t.dataset.index = idx;
    if(idx === mediaItems.length - 1){ // video
      t.innerHTML = `<video muted preload="metadata" src="${src}"></video>`;
    } else {
      t.innerHTML = `<img src="${src}" alt="thumb-${idx}">`;
    }
    t.addEventListener('click', ()=> {
      currentIndex = idx; renderMedia(currentIndex);
      highlightThumb(currentIndex);
    });
    thumbColumn.appendChild(t);
  });
  highlightThumb(currentIndex);

  // initial shipping calc
  updateShipping();

  // some example feedback
  addFeedbackToList({name:'Ayesha', rating:5, comment:'Beautiful gem and quick delivery!'});
  addFeedbackToList({name:'Mark', rating:4, comment:'Great product - nicely packaged.'});
}

/* render main media (image or video) */
function renderMedia(idx){
  mediaStage.innerHTML = '';
  const src = mediaItems[idx];
  if(idx === mediaItems.length - 1){
    // show video element
    const video = document.createElement('video');
    video.src = src; video.controls = true; video.autoplay = false; video.preload='metadata';
    video.style.maxHeight = '100%';
    mediaStage.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = src; img.alt = `Product image ${idx+1}`;
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', ()=> openZoom(src, 'image'));
    mediaStage.appendChild(img);
  }
}

/* highlight thumbnail */
function highlightThumb(idx){
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  const activeThumb = document.querySelector(`.thumb[data-index="${idx}"]`);
  if(activeThumb) activeThumb.classList.add('active');
}

/* navigation */
leftArrow.addEventListener('click', ()=> {
  currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
  renderMedia(currentIndex);
  highlightThumb(currentIndex);
});
rightArrow.addEventListener('click', ()=> {
  currentIndex = (currentIndex + 1) % mediaItems.length;
  renderMedia(currentIndex);
  highlightThumb(currentIndex);
});

/* keyboard support */
document.addEventListener('keydown', (e)=> {
  if(e.key === 'ArrowLeft'){ leftArrow.click(); }
  if(e.key === 'ArrowRight'){ rightArrow.click(); }
  if(e.key === 'Escape' && !zoomModal.classList.contains('hidden')){ closeZoom(); }
});

/* -------------------------
   Zoom modal
   ------------------------- */
function openZoom(src, type='image'){
  zoomMedia.innerHTML = '';
  if(type === 'image'){
    const img = document.createElement('img'); img.src = src; img.alt = 'Zoom';
    zoomMedia.appendChild(img);
  } else {
    const v = document.createElement('video'); v.src = src; v.controls = true; v.autoplay = true;
    zoomMedia.appendChild(v);
  }
  zoomModal.classList.remove('hidden'); zoomModal.setAttribute('aria-hidden','false');
}
function closeZoom(){
  zoomModal.classList.add('hidden'); zoomModal.setAttribute('aria-hidden','true');
  zoomMedia.innerHTML = '';
}
closeZoomBtn.addEventListener('click', closeZoom);
zoomModal.addEventListener('click', (e)=> { if(e.target === zoomModal) closeZoom(); });

/* -------------------------
   Shipping calculation
   ------------------------- */
function updateShipping(){
  const country = countrySelect.value;
  const base = shippingRates[country] ?? 60.0;
  const taxRate = taxRates[country] ?? 0.10;
  // Example: tax applied on item price only (you can change to include shipping)
  const tax = (product.price) * taxRate;
  const total = product.price + base + tax;
  shippingCostText.textContent = formatUSD(base);
  taxText.textContent = formatUSD(tax);
  totalText.textContent = formatUSD(total);
}
countrySelect.addEventListener('change', updateShipping);

/* -------------------------
   Buy Now & Seller info
   ------------------------- */
buyNowBtn.addEventListener('click', ()=>{
  // reveal seller contact area
  sellerContactEl.classList.remove('hidden');
  sellerContactEl.setAttribute('aria-hidden','false');
  sellerContactEl.scrollIntoView({behavior:'smooth', block:'center'});
});

/* add to cart - simple visual feedback */
addToCartBtn.addEventListener('click', ()=>{
  addToCartBtn.textContent = 'Added ✓';
  addToCartBtn.disabled = true;
  setTimeout(()=> {
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.disabled = false;
  }, 1400);
});

/* -------------------------
   Feedback handling
   ------------------------- */
function addFeedbackToList({name, rating, comment}){
  const li = document.createElement('li'); li.className = 'feedback-item';
  const stars = '★'.repeat(rating) + '☆'.repeat(5-rating);
  li.innerHTML = `<strong>${escapeHtml(name)}</strong> <span style="color:#f39c12">${stars}</span>
    <p style="margin:6px 0 0;color:#1b2b40">${escapeHtml(comment)}</p>`;
  feedbackList.prepend(li);
}

/* -------------------------
   Init
   ------------------------- */

// Star rating functionality
if (starRatingLabels.length > 0) {
  starRatingLabels.forEach((label, index) => {
    label.addEventListener('mouseover', () => {
      starRatingLabels.forEach((lbl, i) => {
        if (i >= index) {
          lbl.style.color = '#ffd166';
        } else {
          lbl.style.color = '#ddd';
        }
      });
    });
    
    label.addEventListener('mouseout', () => {
      const checkedInput = document.querySelector('input[name="rating"]:checked');
      if (checkedInput) {
        const checkedIndex = Array.from(starRatingInputs).indexOf(checkedInput);
        starRatingLabels.forEach((lbl, i) => {
          if (i >= checkedIndex) {
            lbl.style.color = '#ffd166';
          } else {
            lbl.style.color = '#ddd';
          }
        });
      } else {
        starRatingLabels.forEach(lbl => lbl.style.color = '#ddd');
      }
    });
  });
}

// Review form submission
if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reviewerName').value.trim();
    const title = document.getElementById('reviewTitle').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    
    if (!name || !title || !comment || !ratingInput) {
      alert('Please fill in all required fields and select a rating.');
      return;
    }
    
    const rating = parseInt(ratingInput.value);
    
    // Create new review element
    const newReview = createReviewElement({
      name,
      title,
      comment,
      rating,
      date: 'Just now'
    });
    
    // Insert at the top of reviews list
    const reviewsList = document.querySelector('.reviews-list');
    const firstReview = reviewsList.querySelector('.review-item');
    if (firstReview) {
      reviewsList.insertBefore(newReview, firstReview);
    } else {
      reviewsList.appendChild(newReview);
    }
    
    // Reset form
    reviewForm.reset();
    starRatingLabels.forEach(label => label.style.color = '#ddd');
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = '<i class="fa-solid fa-check-circle"></i> Thank you! Your review has been submitted.';
    successMsg.style.cssText = `
      background: #dcfce7; border: 1px solid #86efac; color: #166534;
      padding: 12px; border-radius: 8px; margin-bottom: 15px;
      display: flex; align-items: center; gap: 8px;
    `;
    
    reviewForm.parentNode.insertBefore(successMsg, reviewForm);
    setTimeout(() => successMsg.remove(), 5000);
  });
}

// Create review element function
function createReviewElement({name, title, comment, rating, date}) {
  const reviewItem = document.createElement('div');
  reviewItem.className = 'review-item';
  
  const stars = Array.from({length: 5}, (_, i) => 
    `<i class="fa-${i < rating ? 'solid' : 'regular'} fa-star"></i>`
  ).join('');
  
  reviewItem.innerHTML = `
    <div class="review-header">
      <div class="reviewer-info">
        <div class="reviewer-avatar">${name.charAt(0).toUpperCase()}</div>
        <div class="reviewer-details">
          <h4>${name}</h4>
          <div class="review-stars">${stars}</div>
          <span class="review-date">${date}</span>
        </div>
      </div>
      <div class="review-title">${title}</div>
    </div>
    <div class="review-content">
      <p>${comment}</p>
      <div class="review-helpful">
        <button class="helpful-btn"><i class="fa-solid fa-thumbs-up"></i> Helpful (0)</button>
      </div>
    </div>
  `;
  
  return reviewItem;
}

// Load more reviews functionality
const loadMoreBtn = document.querySelector('.load-more-reviews');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    // Simulate loading more reviews
    const reviewsList = document.querySelector('.reviews-list');
    const newReview = createReviewElement({
      name: 'John Doe',
      title: 'Great Product!',
      comment: 'Very satisfied with this purchase. The quality is excellent and shipping was fast.',
      rating: 4,
      date: '3 weeks ago'
    });
    
    reviewsList.insertBefore(newReview, loadMoreBtn);
    
    // Update button text temporarily
    const originalText = loadMoreBtn.innerHTML;
    loadMoreBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
    loadMoreBtn.disabled = true;
    
    setTimeout(() => {
      loadMoreBtn.innerHTML = originalText;
      loadMoreBtn.disabled = false;
    }, 1000);
  });
}

initPage();
