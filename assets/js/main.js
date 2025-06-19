(function ($) {
  "use strict";

  var cfg = {
      scrollDuration: 800, // smoothscroll duration
    },
    $WIN = $(window);

  // Add the User Agent to the <html>
  // will be used for IE10 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0))
  var doc = document.documentElement;
  doc.setAttribute("data-useragent", navigator.userAgent);

  // svg fallback
  if (!Modernizr.svg) {
    $(".header-logo img").attr("src", "images/logo.png");
  }

  /* Preloader
   * -------------------------------------------------- */
  var ssPreloader = function () {
    $("html").addClass("ss-preload");

    $WIN.on("load", function () {
      //force page scroll position to top at page refresh
      $("html, body").animate({ scrollTop: 0 }, "normal");

      // will first fade out the loading animation
      $("#loader").fadeOut("slow", function () {
        // will fade out the whole DIV that covers the website.
        $("#preloader").delay(300).fadeOut("slow");
      });

      // for hero content animations
      $("html").removeClass("ss-preload");
      $("html").addClass("ss-loaded");
    });
  };

  /* Menu on Scrolldown
   * ------------------------------------------------------ */
  var ssMenuOnScrolldown = function () {
    var menuTrigger = $(".header-menu-toggle");

    $WIN.on("scroll", function () {
      if ($WIN.scrollTop() > 150) {
        menuTrigger.addClass("opaque");
      } else {
        menuTrigger.removeClass("opaque");
      }
    });
  };

  /* OffCanvas Menu
   * ------------------------------------------------------ */
  var ssOffCanvas = function () {
    var menuTrigger = $(".header-menu-toggle"),
      nav = $(".header-nav"),
      closeButton = nav.find(".header-nav__close"),
      siteBody = $("body"),
      mainContents = $("section, footer");

    // open-close menu by clicking on the menu icon
    menuTrigger.on("click", function (e) {
      e.preventDefault();
      siteBody.toggleClass("menu-is-open");
    });

    // close menu by clicking the close button
    closeButton.on("click", function (e) {
      e.preventDefault();
      menuTrigger.trigger("click");
    });

    // close menu clicking outside the menu itself
    siteBody.on("click", function (e) {
      if (
        !$(e.target).is(
          ".header-nav, .header-nav__content, .header-menu-toggle, .header-menu-toggle span"
        )
      ) {
        siteBody.removeClass("menu-is-open");
      }
    });
  };

  /* Masonry
   * ---------------------------------------------------- */
  var ssMasonryFolio = function () {
    var containerBricks = $(".masonry");

    containerBricks.imagesLoaded(function () {
      containerBricks.masonry({
        itemSelector: ".masonry__brick",
        resize: true,
        columnWidth: 576,
        columnHeight: 920,
      });
    });
  };

  /* photoswipe
   * ----------------------------------------------------- */
  var ssPhotoswipe = function () {
    var items = [],
      $pswp = $(".pswp")[0],
      $folioItems = $(".item-folio");

    // get items
    $folioItems.each(function (i) {
      var $folio = $(this),
        $thumbLink = $folio.find(".thumb-link"),
        $title = $folio.find(".item-folio__title"),
        $caption = $folio.find(".item-folio__caption"),
        $titleText = "<h4>" + $.trim($title.html()) + "</h4>",
        $captionText = $.trim($caption.html()),
        $href = $thumbLink.attr("href"),
        $size = $thumbLink.data("size").split("x"),
        $width = $size[0],
        $height = $size[1];

      var item = {
        src: $href,
        w: $width,
        h: $height,
      };

      if ($caption.length > 0) {
        item.title = $.trim($titleText + $captionText);
      }

      items.push(item);
    });

    // bind click event
    $folioItems.each(function (i) {
      $(this).on("click", function (e) {
        e.preventDefault();
        var options = {
          index: i,
          showHideOpacity: true,
        };

        // initialize PhotoSwipe
        var lightBox = new PhotoSwipe(
          $pswp,
          PhotoSwipeUI_Default,
          items,
          options
        );
        lightBox.init();
      });
    });
  };

  /* Smooth Scrolling
   * ------------------------------------------------------ */
  var ssSmoothScroll = function () {
    $(".smoothscroll").on("click", function (e) {
      var target = this.hash,
        $target = $(target);

      e.preventDefault();
      e.stopPropagation();

      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $target.offset().top,
          },
          cfg.scrollDuration,
          "swing"
        )
        .promise()
        .done(function () {
          // check if menu is open
          if ($("body").hasClass("menu-is-open")) {
            $(".header-menu-toggle").trigger("click");
          }

          window.location.hash = target;
        });
    });
  };

  /* Alert Boxes
   * ------------------------------------------------------ */
  var ssAlertBoxes = function () {
    $(".alert-box").on("click", ".alert-box__close", function () {
      $(this).parent().fadeOut(500);
    });
  };

  /* Animate On Scroll
   * ------------------------------------------------------ */
  var ssAOS = function () {
    AOS.init({
      offset: 200,
      duration: 600,
      easing: "ease-in-sine",
      delay: 300,
      once: true,
      disable: "mobile",
    });
  };

  /* Lazy Loading
   * ------------------------------------------------------ */
  var ssLazyLoading = function () {
    // Check if Intersection Observer is supported
    if (!("IntersectionObserver" in window)) {
      // Fallback for older browsers - load all images immediately
      loadAllImages();
      return;
    }

    // Create intersection observer
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const container = entry.target;
            const img = container.querySelector(".lazy-image");
            const src = container.getAttribute("data-src");

            if (src && img) {
              loadImage(img, src, container);
              observer.unobserve(container);
            }
          }
        });
      },
      {
        // Load images when they're 100px away from being visible
        rootMargin: "100px 0px",
        threshold: 0.01,
      }
    );

    // Observe all lazy-load containers
    const lazyContainers = document.querySelectorAll(".lazy-load");
    lazyContainers.forEach((container) => {
      imageObserver.observe(container);
    });

    // Load first 4 images immediately for better UX
    const firstImages = Array.from(lazyContainers).slice(0, 4);
    firstImages.forEach((container) => {
      const img = container.querySelector(".lazy-image");
      const src = container.getAttribute("data-src");
      if (src && img) {
        loadImage(img, src, container);
        imageObserver.unobserve(container);
      }
    });
  };

  // Function to load a single image
  function loadImage(img, src, container) {
    const tempImg = new Image();

    tempImg.onload = function () {
      img.src = src;
      container.classList.add("loaded");

      // Preload next images for smoother experience
      preloadNextImages(container);
    };

    tempImg.onerror = function () {
      // If image fails to load, still mark as loaded to hide skeleton
      container.classList.add("loaded");
      img.style.display = "none";
    };

    tempImg.src = src;
  }

  // Preload next few images for smoother scrolling
  function preloadNextImages(currentContainer) {
    const allContainers = Array.from(document.querySelectorAll(".lazy-load"));
    const currentIndex = allContainers.indexOf(currentContainer);
    const nextContainers = allContainers.slice(
      currentIndex + 1,
      currentIndex + 3
    );

    nextContainers.forEach((container) => {
      if (!container.classList.contains("loaded")) {
        const img = container.querySelector(".lazy-image");
        const src = container.getAttribute("data-src");
        if (src && img) {
          const tempImg = new Image();
          tempImg.onload = function () {
            img.src = src;
            container.classList.add("loaded");
          };
          tempImg.src = src;
        }
      }
    });
  }

  // Fallback function for older browsers
  function loadAllImages() {
    const lazyContainers = document.querySelectorAll(".lazy-load");
    lazyContainers.forEach((container) => {
      const img = container.querySelector(".lazy-image");
      const src = container.getAttribute("data-src");
      if (src && img) {
        loadImage(img, src, container);
      }
    });
  }

  /* PhotoSwipe Gallery
   * ------------------------------------------------------ */
  var ssPhotoGallery = function () {
    // Photo Gallery data
    var galleryItems = [
      {
        src: "./assets/images/photos/slider-photo1.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 1",
      },
      {
        src: "./assets/images/photos/slider-photo2.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 2",
      },
      {
        src: "./assets/images/photos/slider-photo3.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 3",
      },
      {
        src: "./assets/images/photos/slider-photo4.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 4",
      },
      {
        src: "./assets/images/photos/slider-photo5.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 5",
      },
      {
        src: "./assets/images/photos/slider-photo6.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 6",
      },
      {
        src: "./assets/images/photos/slider-photo7.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 7",
      },
      {
        src: "./assets/images/photos/slider-photo8.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 8",
      },
      {
        src: "./assets/images/photos/slider-photo9.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 9",
      },
      {
        src: "./assets/images/photos/slider-photo10.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 10",
      },
      {
        src: "./assets/images/photos/slider-photo11.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 11",
      },
      {
        src: "./assets/images/photos/slider-photo12.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 12",
      },
      {
        src: "./assets/images/photos/slider-photo13.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 13",
      },
      {
        src: "./assets/images/photos/slider-photo14.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 14",
      },
      {
        src: "./assets/images/photos/slider-photo15.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 15",
      },
      {
        src: "./assets/images/photos/slider-photo16.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 16",
      },
      {
        src: "./assets/images/photos/slider-photo17.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 17",
      },
      {
        src: "./assets/images/photos/slider-photo18.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 18",
      },
      {
        src: "./assets/images/photos/slider-photo19.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 19",
      },
      {
        src: "./assets/images/photos/slider-photo20.jpg",
        w: 1200,
        h: 800,
        title: "Atlas Photo 20",
      },
    ];

    // Global function to open PhotoSwipe
    window.openPhotoSwipe = function (index) {
      var pswpElement = document.querySelectorAll(".pswp")[0];

      // Update gallery items with currently loaded images
      updateGalleryItems();

      // Define options
      var options = {
        index: index,
        shareEl: true,
        fullscreenEl: true,
        zoomEl: true,
        tapToClose: true,
        tapToToggleControls: true,
        closeOnScroll: false,
        history: false,
        focus: false,
        showAnimationDuration: 333,
        hideAnimationDuration: 333,
      };

      // Initialize PhotoSwipe
      var gallery = new PhotoSwipe(
        pswpElement,
        PhotoSwipeUI_Default,
        galleryItems,
        options
      );

      // Add download button
      gallery.listen("uiUpdate", function () {
        var downloadBtn = gallery.ui.bar.querySelector(
          ".pswp__button--download"
        );
        if (!downloadBtn) {
          downloadBtn = document.createElement("button");
          downloadBtn.className = "pswp__button pswp__button--download";
          downloadBtn.title = "Download image";
          downloadBtn.onclick = function () {
            var currentItem = gallery.currItem;
            downloadImage(
              currentItem.src,
              "atlas-photo-" + (gallery.getCurrentIndex() + 1) + ".jpg"
            );
          };
          gallery.ui.bar.appendChild(downloadBtn);
        }
      });

      gallery.init();
    };

    // Update gallery items with loaded images
    function updateGalleryItems() {
      const photoItems = document.querySelectorAll(".photo-item");
      photoItems.forEach((item, index) => {
        const img = item.querySelector(".lazy-image");
        if (img && img.src && img.src !== "") {
          galleryItems[index].src = img.src;
        }
      });
    }

    // Global function to download image
    window.downloadImage = function (imageUrl, fileName) {
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        })
        .catch((error) => {
          // Fallback method
          const a = document.createElement("a");
          a.href = imageUrl;
          a.download = fileName;
          a.target = "_blank";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
    };
  };

  /* Initialize
   * ------------------------------------------------------ */
  (function clInit() {
    ssPreloader();
    ssMenuOnScrolldown();
    ssOffCanvas();
    ssMasonryFolio();
    ssPhotoswipe();
    ssLazyLoading();
    ssPhotoGallery();
    ssSmoothScroll();
    ssAlertBoxes();
    ssAOS();
  })();
})(jQuery);
