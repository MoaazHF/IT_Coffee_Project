const legacySlider = document.querySelector('.slider-wrapper');
if (legacySlider) {
    new Swiper('.slider-wrapper', {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}

const productsSlider = document.querySelector('.products-swiper');
if (productsSlider) {
    new Swiper('.products-swiper', {
        loop: true,
        speed: 650,
        spaceBetween: 20,
        slidesPerView: 3,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.products-swiper .swiper-button-next',
            prevEl: '.products-swiper .swiper-button-prev',
        },
        pagination: {
            el: '.products-swiper .swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            0: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
        },
    });
}
window.onload = function() {
    window.scrollTo(0, 0); // Scrolls to top on page load
};
// Get the button
let scrollToTopBtn = document.getElementById("scrollToTopBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
