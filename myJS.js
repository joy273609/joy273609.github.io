$(function () {
    // 點擊卡片顯示對應 modal
    $(".card").click(function () {
    const target = $(this).data("target");
    $(".modal-overlay").fadeIn(200);
    $(target).fadeIn(200);
    });

    // 點擊關閉按鈕或遮罩關閉所有 modal
    $(".close-btn, .modal-overlay").click(function () {
    $(".modal-overlay").fadeOut(200);
    $(".modal").fadeOut(200);
    });
});

//跑馬燈
$(function(){
    $("#openExhibition").click(function(){
    $("#overlay, #modal-EXHIBITION").fadeIn(200);
    });
    $("#closeExhibition, #overlay").click(function(){
    $("#overlay, #modal-EXHIBITION").fadeOut(200);
    });
});

$(function () {

    /**
     * 初始化輪播功能
     * @param {string} carouselSelector - 輪播容器的選擇器
     */
    function initCarousel(carouselSelector) {
        const $carousel = $(carouselSelector);
        const $track = $carousel.find('.carousel-track');
        const $slide = $carousel.find('.carousel-slide'); // 只有一個 slide
        const $images = $carousel.find('.carousel-slide img'); // 所有圖片
        const $dots = $carousel.find('.dot');
        const $prevBtn = $carousel.find('.prev');
        const $nextBtn = $carousel.find('.next');
        
        let currentSlide = 0;
        const totalSlides = $images.length; // 使用圖片數量
        let autoplayInterval;
        let isTransitioning = false;

        /**
         * 更新輪播顯示
         */
        function updateCarousel() {
            if (isTransitioning) return;
            
            isTransitioning = true;
            
            // 計算移動距離：每次移動 100/7 %
            const translateX = -currentSlide * (100 / totalSlides);
            
            // 移動整個 slide 來顯示對應的圖片
            $slide.css('transform', `translateX(${translateX}%)`);
            
            // 更新點點導航的活動狀態
            $dots.removeClass('active');
            $dots.eq(currentSlide).addClass('active');
            
            // 過渡動畫完成後重置標記
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }

        /**
         * 切換到下一張圖片
         */
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }

        /**
         * 切換到上一張圖片
         */
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        /**
         * 跳轉到指定圖片
         * @param {number} slideIndex - 目標圖片索引
         */
        function goToSlide(slideIndex) {
            if (slideIndex >= 0 && slideIndex < totalSlides && slideIndex !== currentSlide) {
                currentSlide = slideIndex;
                updateCarousel();
            }
        }

        /**
         * 開始自動播放
         */
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 6000); // 改為6秒
        }
        
        /**
         * 停止自動播放
         */
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        // ===== 事件綁定 =====
        
        // 箭頭按鈕點擊事件
        $nextBtn.on('click', function(e) {
            e.stopPropagation();
            nextSlide();
            stopAutoplay();
            setTimeout(startAutoplay, 3000);
        });
        
        $prevBtn.on('click', function(e) {
            e.stopPropagation();
            prevSlide();  
            stopAutoplay();
            setTimeout(startAutoplay, 3000);
        });
        
        // 點點導航點擊事件
        $dots.on('click', function(e) {
            e.stopPropagation();
            const slideIndex = $(this).data('slide');
            goToSlide(slideIndex);
            stopAutoplay();
            setTimeout(startAutoplay, 2000);
        });

        // 滑鼠懸停控制自動播放
        $carousel.hover(
            function() {
                stopAutoplay();
            },
            function() {
                startAutoplay();
            }
        );

        // 觸摸滑動支持
        let startX = 0;
        let endX = 0;
        
        $carousel.on('touchstart', function(e) {
            startX = e.originalEvent.touches[0].clientX;
        });
        
        $carousel.on('touchend', function(e) {
            endX = e.originalEvent.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                stopAutoplay();
                setTimeout(startAutoplay, 3000);
            }
        });

        // 初始化輪播
        updateCarousel();
        startAutoplay();
        
        return {
            next: nextSlide,
            prev: prevSlide,
            goTo: goToSlide,
            startAutoplay: startAutoplay,
            stopAutoplay: stopAutoplay,
            getCurrentSlide: () => currentSlide,
            getTotalSlides: () => totalSlides
        };
    }

    // ===== 初始化所有輪播 =====
    const carousels = {};
    
    carousels.flim = initCarousel('[data-carousel="flim"]');
    carousels.calendar = initCarousel('[data-carousel="calendar"]');
    carousels.helper = initCarousel('[data-carousel="helper"]');
    carousels.dog = initCarousel('[data-carousel="dog"]');

    // ===== 全域鍵盤控制 =====
    $(document).keydown(function(e) {
        if (e.keyCode === 27) {
            $(".modal-overlay").fadeOut(300);
            $(".modal").fadeOut(300);
            return;
        }
        
        const $openModal = $('.modal:visible');
        if ($openModal.length > 0) {
            const $carousel = $openModal.find('.image-carousel');
            if ($carousel.length > 0) {
                if (e.keyCode === 37) {
                    e.preventDefault();
                    $carousel.find('.prev').click();
                } else if (e.keyCode === 39) {
                    e.preventDefault();
                    $carousel.find('.next').click();
                }
            }
        }
    });

    // ===== 輔助功能 =====
    function preloadImages(imageUrls) {
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    function getCarouselImageUrls(carouselSelector) {
        const urls = [];
        $(carouselSelector).find('.carousel-slide img').each(function() {
            urls.push($(this).attr('src'));
        });
        return urls;
    }

    $('.card').on('click', function() {
        const target = $(this).data('target');
        const $targetModal = $(target);
        const $carousel = $targetModal.find('.image-carousel');
        
        if ($carousel.length > 0) {
            const imageUrls = getCarouselImageUrls($carousel);
            preloadImages(imageUrls);
        }
    });

});