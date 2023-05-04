addEventListener(
  document.getElementById("button-language-toggle"),
  "click",
  function (e) {
    document.getElementById("header__language-menu").classList.toggle("active");
  }
);
addEventListener(
  document.getElementById("header__toggle-mobile-menu"),
  "click",
  function (e) {
    document.getElementById("header").classList.toggle("show-mobile-menu");
    document.body.classList.toggle("_no-scroll");
  }
);
const onMouseEnter = (e) => {
  e.target.dataset.isMouseIn = true; // move functions to a separate code block
};

const onMouseLeave = (e) => {
  e.target.dataset.isMouseIn = false;
};
const getRandomNumberExcludingRange = (lr, ur) => {
  let randomNumber;
  do {
    randomNumber = Math.random();
  } while (randomNumber >= lr && randomNumber <= ur);
  return randomNumber;
};
addEventListener(document, "DOMContentLoaded", function () {
  //domcontentload is not browser-comptaible a fallback is necessary
  function animateParticleGrid(
    particleGridSelector,
    particlesSelector,
    xyOffset
  ) {
    // console.log("animating particle grid");
    const particleGrid = document.getElementById(particleGridSelector);
    const particleGridRect = particleGrid.getBoundingClientRect();
    const particles = particleGrid.querySelectorAll(particlesSelector);
    const translateParticle = (p, pHeight, pWidth, yOffset, xOffset) => {
      // i++;
      // p.style["-webkit-transform"] = "translate(15px)";
      yOffset -=
        (Math.random() * 0.3 + 0.05) *
        (p.dataset.isMouseIn === "true" ? 0.5 : 1.0);
      // console.log(p.dataset.isMouseIn);
      if (yOffset + pHeight < 0) {
        yOffset = particleGridRect.height;
        xOffset = Math.floor(
          getRandomNumberExcludingRange(0.15, 0.85) *
            (particleGridRect.width - pWidth + 1)
        );
        p.style.transition = "none";
      }
      p.style.transform =
        "translateY( calc((" +
        yOffset +
        " / " +
        particleGridRect.height +
        ") * 100vh))"; // remember webkit transform --> although seems to work properly without it? may be catch the type of the browser and prefix if necessary?
      // p.style.transform = `translateY(calc((${yOffset} / ${particleGridRect.height}}) * 100vh))`; safari??
      // p.style.webkitTransform = `translateY(calc((${yOffset} / ${particleGridRect.height}}) * 100vh))`;
      requestAnimationFrame(() => {
        p.style.transition = "transform 20ms ease-in-out";
      });

      // p.style.left = `calc((${xOffset} / ${particleGridRect.width}) * 100vw)`;  safari??
      p.style.left =
        "calc((" + xOffset + "/" + particleGridRect.width + ") * 100vw)";
      // p.style["-webkit-transform"] = `translate(${i}px);`;
      // p.style["-webkit-transform"] = "translate(" + i + "px)";
      function animateParticle() {
        translateParticle(p, pHeight, pWidth, yOffset, xOffset);
      }
      let requestId = requestAnimationFrame(animateParticle);
      // if (document.body.classList.contains("not-visible")) {  // potential performance adjustments for not visible animated elements
      //   cancelAnimationFrame(requestId);
      // }
    };

    if (xyOffset.length === particles.length) {
      particles.forEach((p, i) => {
        // console.log("animating particle");
        // p.style["-webkit-transform"] = "translate(10px)";
        let pHeight = p.getBoundingClientRect().height;
        let pWidth = p.getBoundingClientRect().width;
        let xOffset = (xyOffset[i][0] / 1440) * particleGridRect.width;
        let yOffset = (xyOffset[i][1] / 1020) * particleGridRect.height;
        translateParticle(p, pHeight, pWidth, yOffset, xOffset);
        // setTimeout(
        //   () => translateParticle(p, pHeight, pWidth, yOffset, xOffset),
        //   Math.random() * 2000
        // );
        addEventListener(p, "mouseenter", onMouseEnter);
        addEventListener(p, "mouseleave", onMouseLeave); //check event compatibility
      });
    } else if (xyOffset === undefined) {
      //
    }
  }

  animateParticleGrid("home-hero-particle-grid", ".particle-container", [
    [44.23, 504.02],
    [150, 551],
    [1215.12, 182.29],
    [1302.5, 878.17],
    [1163, 730.72],
    [177.54, 294.15],
    [1237.8, 440.5],
    [251, 830],
  ]);

  function slider() {
    let xOffset = 0;
    let isMouseOver = false;
    let slideWidth = 120;
    let marginRight = 30;
    const mobileMedia = window.matchMedia("(max-width: 480px)");
    const tabletMedia = window.matchMedia("(max-width: 992px)");

    function updateMarginRight() {
      if (mobileMedia.matches) {
        marginRight = 80;
      } else if (tabletMedia.matches) {
        marginRight = 100;
      } else {
        marginRight = 30;
      }
    }

    updateMarginRight();

    function updateSlideWidth() {
      slideWidth = mobileMedia.matches ? 80 : tabletMedia.matches ? 100 : 120;
    }

    updateSlideWidth();

    const debouncedResizeHandler = debounce(() => {
      updateSlideWidth();
      mirrorSlides();
    }, 200);

    window.addEventListener("resize", debouncedResizeHandler);

    const slides = document
      .querySelector("#home-hero-partners-slider")
      .querySelector("._slider-slides");

    if (slides.children.length) {
      function mirrorSlides() {
        const mirroredClass = "mirrored-slide";
        const slidesLength =
          slides.children.length -
          slides.querySelectorAll(`.${mirroredClass}`).length;
        const slidesMirrors = Math.ceil(
          slides.getBoundingClientRect().width /
            ((slideWidth + marginRight) * 6)
        );

        for (let j = 0; j < slidesMirrors; j++) {
          for (let i = 0; i < slidesLength; i++) {
            const child = slides.children[i].cloneNode(true);
            child.classList.add(mirroredClass); // Add identifier class
            slides.appendChild(child);
          }
        }
      }

      mirrorSlides();

      function translateSlides() {
        const xIncrementor = isMouseOver ? 0.05 : 0.2;
        xOffset >= (slideWidth + marginRight) * 6
          ? (xOffset = 0)
          : (xOffset += xIncrementor);

        slides.style.transform = `translateX(-${xOffset}px)`;
      }

      const animationInterval = setInterval(translateSlides, 1000 / 60);

      slides.addEventListener("mouseover", () => {
        isMouseOver = true;
      });

      slides.addEventListener("mouseout", () => {
        isMouseOver = false;
      });
    }
  }

  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    };
  }

  slider();
});
