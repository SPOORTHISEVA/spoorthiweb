
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});


mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});


const faders = document.querySelectorAll('.fade-in-up');
const appearOptions = {
    threshold: 0.1, 
    rootMargin: "0px 0px -50px 0px" 
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('animate');
            appearOnScroll.unobserve(entry.target);
        }
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});


function setupCarousel(containerId, prevButtonId, nextButtonId, dotsContainerId) {
    const carouselContainer = document.querySelector(`#${containerId}`);
    const carouselTrack = carouselContainer.querySelector('.carousel-track');
    const carouselItems = carouselTrack.querySelectorAll('.carousel-item');
    const prevButton = document.getElementById(prevButtonId);
    const nextButton = document.getElementById(nextButtonId);
    const dotsContainer = document.getElementById(dotsContainerId);

    let currentDotIndex = 0; 

    const itemsPerView = () => {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    };

    const updateCarousel = () => {
        if (carouselItems.length === 0) {
            if (prevButton) prevButton.style.display = 'none';
            if (nextButton) nextButton.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
            return;
        } else {
             if (prevButton) prevButton.style.display = 'flex';
             if (nextButton) nextButton.style.display = 'flex';
             if (dotsContainer) dotsContainer.style.display = 'flex';
        }

      
        const firstItemIndexForCurrentPage = currentDotIndex * itemsPerView();
        const actualCarouselIndex = Math.min(firstItemIndexForCurrentPage, carouselItems.length - 1);

        
        const offset = -carouselItems[actualCarouselIndex].offsetLeft;
        carouselTrack.style.transform = `translateX(${offset}px)`;
        updateDots();
    };

    const createDots = () => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = ''; 
        const totalDots = Math.ceil(carouselItems.length / itemsPerView());
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentDotIndex = i; 
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
    };

    const updateDots = () => {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.dot').forEach((dot, index) => {
            if (index === currentDotIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    prevButton.addEventListener('click', () => {
        currentDotIndex = Math.max(0, currentDotIndex - 1);
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        const totalDots = Math.ceil(carouselItems.length / itemsPerView());
        currentDotIndex = Math.min(totalDots - 1, currentDotIndex + 1);
        updateCarousel();
    });

    
    window.addEventListener('resize', () => {
        currentDotIndex = 0; 
        createDots();
        updateCarousel();
    });

    
    createDots();
    updateCarousel();
}


document.addEventListener('DOMContentLoaded', () => {
    const galleryCarousel = document.querySelector('#gallery .carousel-container');
    if (galleryCarousel) {
        galleryCarousel.id = 'gallery-carousel-container';
        setupCarousel('gallery-carousel-container', 'gallery-prev', 'gallery-next', 'gallery-dots');
    }

    const videosCarousel = document.querySelector('#videos .carousel-container');
    if (videosCarousel) {
        videosCarousel.id = 'videos-carousel-container';
        setupCarousel('videos-carousel-container', 'videos-prev', 'videos-next', 'videos-dots');
    }
});