document.addEventListener('DOMContentLoaded', function () {
    const sliderContainer = document.getElementById('masonicSlider');
    const slidesWrapper = sliderContainer.querySelector('.slides');
    const originalSlidesFromDOM = Array.from(slidesWrapper.querySelectorAll('.slide[data-original-index]'));
    const progressBarContainer = sliderContainer.querySelector('.progress-bar-container');
    const prevNavButton = sliderContainer.querySelector('.slider-nav-button.prev');
    const nextNavButton = sliderContainer.querySelector('.slider-nav-button.next');

    let logicalCurrentIndex = 0;
    const numOriginalSlides = originalSlidesFromDOM.length;
    let autoSlideInterval;
    const autoSlideDelay = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--autoplay-delay') || '7s') * 1000;

    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    let dragPrevTranslate = 0;
    let slideWidth = slidesWrapper.clientWidth;
    
    let allSlidesInDom = []; 
    let progressBars = [];
    let hoverPausedAutoplay = false;


    if (numOriginalSlides === 0) {
        console.error("Nenhum slide original encontrado.");
        if(prevNavButton) prevNavButton.style.display = 'none';
        if(nextNavButton) nextNavButton.style.display = 'none';
        return;
    }
    
    const getCloneOffset = () => numOriginalSlides > 1 ? 1 : 0;
    
    function setupInfiniteSlider() {
        if (numOriginalSlides > 1) {
            const firstClone = originalSlidesFromDOM[0].cloneNode(true);
            firstClone.removeAttribute('data-original-index');
            firstClone.classList.add('slide-clone');
            slidesWrapper.appendChild(firstClone);

            const lastClone = originalSlidesFromDOM[numOriginalSlides - 1].cloneNode(true);
            lastClone.removeAttribute('data-original-index');
            lastClone.classList.add('slide-clone');
            slidesWrapper.insertBefore(lastClone, slidesWrapper.firstChild);
        }
        allSlidesInDom = Array.from(slidesWrapper.children);
        
        currentTranslate = -(logicalCurrentIndex + getCloneOffset()) * slideWidth; 
        dragPrevTranslate = currentTranslate;
        slidesWrapper.style.transform = `translateX(${currentTranslate}px)`;
    }

    function createProgressBars() {
        progressBarContainer.innerHTML = '';
        progressBars = [];
        for (let i = 0; i < numOriginalSlides; i++) {
            const barItem = document.createElement('div');
            barItem.classList.add('progress-bar-item');
            barItem.dataset.index = i;
            
            const barFill = document.createElement('div');
            barFill.classList.add('progress-bar-fill');
            barItem.appendChild(barFill);

            barItem.addEventListener('click', () => {
                goToSlide(i);
                // resetAutoplayAfterInteraction será chamado no transitionend
            });
            progressBarContainer.appendChild(barItem);
            progressBars.push(barItem);
        }
    }
    
    function updateActiveProgressBar(animateFill = false) {
        progressBars.forEach((bar, index) => {
            const fill = bar.querySelector('.progress-bar-fill');
            bar.classList.remove('active');
            fill.style.transition = 'none';
            fill.style.width = '0%';
            
            if (index === logicalCurrentIndex) {
                bar.classList.add('active');
                if (animateFill) {
                    void fill.offsetWidth; 
                    fill.style.transition = `width ${autoSlideDelay / 1000}s linear`;
                    fill.style.width = '100%';
                }
            }
        });
    }

    function updateActiveSlideVisuals(animateProgressBarFill = false) {
        originalSlidesFromDOM.forEach((slide, index) => {
            slide.classList.toggle('active', index === logicalCurrentIndex);
        });
        updateActiveProgressBar(animateProgressBarFill);
    }
    
    function setSliderPosition(withTransition = false) {
        slidesWrapper.classList.toggle('transitioning', withTransition);
        slidesWrapper.style.transform = `translateX(${currentTranslate}px)`;
    }

    function handleInfiniteLoopJump() {
        slidesWrapper.classList.remove('transitioning'); 

        if (logicalCurrentIndex >= numOriginalSlides) { 
            logicalCurrentIndex = 0;
        } else if (logicalCurrentIndex < 0) { 
            logicalCurrentIndex = numOriginalSlides - 1;
        }
        
        currentTranslate = -(logicalCurrentIndex + getCloneOffset()) * slideWidth;
        
        slidesWrapper.style.transform = `translateX(${currentTranslate}px)`;
        dragPrevTranslate = currentTranslate; 
        updateActiveSlideVisuals(true);
    }

    function goToSlide(index) {
        stopAutoplay();

        slidesWrapper.classList.add('transitioning');
        
        let targetDomPositionIndex;

        if (index >= numOriginalSlides) {
            targetDomPositionIndex = numOriginalSlides + getCloneOffset();
        } else if (index < 0) {
            targetDomPositionIndex = 0; 
        } else {
            targetDomPositionIndex = index + getCloneOffset();
        }
        
        logicalCurrentIndex = index;
        currentTranslate = -(targetDomPositionIndex * slideWidth);
        
        setSliderPosition(true);
    }
    
    slidesWrapper.addEventListener('transitionend', () => {
        slidesWrapper.classList.remove('transitioning');
        
        if (logicalCurrentIndex >= numOriginalSlides || logicalCurrentIndex < 0) {
            handleInfiniteLoopJump();
        } else {
            dragPrevTranslate = currentTranslate;
            updateActiveSlideVisuals(true);
        }
        resetAutoplayAfterInteraction();
    });

    window.addEventListener('resize', () => {
        slideWidth = slidesWrapper.clientWidth;
        currentTranslate = -((logicalCurrentIndex + getCloneOffset()) * slideWidth);
        dragPrevTranslate = currentTranslate;
        setSliderPosition(false);
        updateActiveProgressBar(true);
    });

    function nextSlide() { goToSlide(logicalCurrentIndex + 1); }
    function prevSlide() { goToSlide(logicalCurrentIndex - 1); }

    function startAutoplay() {
        stopAutoplay();
        if (numOriginalSlides > 1) {
            autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
        }
    }
    function stopAutoplay() { clearInterval(autoSlideInterval); }
    
    function resetAutoplayAfterInteraction() {
        stopAutoplay();
        startAutoplay();
        if (!isDragging) {
                updateActiveProgressBar(true);
        }
    }

    function handleTouchStart(event) {
        if (slidesWrapper.classList.contains('transitioning') && !isDragging) return;
        
        stopAutoplay();
        const activeFill = progressBarContainer.querySelector('.progress-bar-item.active .progress-bar-fill');
        if (activeFill) {
            const computedWidth = getComputedStyle(activeFill).width;
            activeFill.style.transition = 'none';
            activeFill.style.width = computedWidth;
        }

        isDragging = true;
        startPosition = getPositionX(event);
        slidesWrapper.classList.remove('transitioning');
    }

    function handleTouchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            let diff = currentPosition - startPosition;
            currentTranslate = dragPrevTranslate + diff;
            
            if (event.type === 'touchmove' && Math.abs(diff) > 10) {
                event.preventDefault();
            }
            setSliderPosition(false);
        }
    }

    function handleTouchEnd() {
        if (!isDragging) return;
        isDragging = false;

        const movedBy = currentTranslate - dragPrevTranslate;
        const threshold = slideWidth * 0.15;
        let targetLogicalIndex = logicalCurrentIndex;

        if (movedBy < -threshold) {
            targetLogicalIndex = logicalCurrentIndex + 1;
        } else if (movedBy > threshold) {
            targetLogicalIndex = logicalCurrentIndex - 1;
        }
        
        goToSlide(targetLogicalIndex);
        // resetAutoplayAfterInteraction() é chamado no transitionend
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // Event Listeners dos Botões de Navegação Manual
    if (prevNavButton && nextNavButton) {
        if (numOriginalSlides > 1) {
            prevNavButton.addEventListener('click', () => {
                prevSlide();
            });
            nextNavButton.addEventListener('click', () => {
                nextSlide();
            });
        } else {
            prevNavButton.style.display = 'none';
            nextNavButton.style.display = 'none';
        }
    }
    
    sliderContainer.addEventListener('mouseenter', () => {
        if (autoSlideInterval) {
            hoverPausedAutoplay = true;
            stopAutoplay();
            const activeFill = progressBarContainer.querySelector('.progress-bar-item.active .progress-bar-fill');
            if (activeFill) {
                const computedWidth = getComputedStyle(activeFill).width;
                activeFill.style.transition = 'none';
                activeFill.style.width = computedWidth;
            }
        }
    });
    sliderContainer.addEventListener('mouseleave', () => {
        if (hoverPausedAutoplay && !isDragging) {
                startAutoplay();
                updateActiveProgressBar(true);
        }
        hoverPausedAutoplay = false;
    });

    function initializeSlider() {
        if (numOriginalSlides > 0) {
            slideWidth = slidesWrapper.clientWidth; // Pega a largura correta inicial
            setupInfiniteSlider();
            createProgressBars();
            updateActiveSlideVisuals(true);
            startAutoplay();
        }
    }
    initializeSlider();
});