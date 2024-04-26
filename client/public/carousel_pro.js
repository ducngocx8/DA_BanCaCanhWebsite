var category_carousel_right = document.querySelector(
  ".category_carousel_right"
);
var interval;
if (category_carousel_right) {
  clearInterval(interval);
  var carousel_images = document.querySelector(".carousel_images"); // slideList
  var images = carousel_images.querySelectorAll("img");
  var pre = document.querySelector(".pre_bg-main");
  var next = document.querySelector(".next_bg-main");
  var len = images.length;
  var index = 0;
  var sliderWidth = category_carousel_right.offsetWidth;
  window.addEventListener("resize", () => {
    sliderWidth = category_carousel_right.offsetWidth;
  });

  var preSlide = function () {
    if (index > 1) {
      index -= 2;
      carousel_images.style.left = "-" + index * sliderWidth + "px";
      index++;
    } else if (index === 1) {
      index -= 1;
      carousel_images.style.left = "-" + index * sliderWidth + "px";
      index++;
    }
  };

  var nextSlide = function () {
    if (index < len) {
      carousel_images.style.left = "-" + index * sliderWidth + "px";
      index++;
    } else if (index === len) {
      carousel_images.style.left = "0px";
      index = 1;
    }
  };

  next.addEventListener("click", nextSlide);
  pre.addEventListener("click", preSlide);

  interval = setInterval(nextSlide, 4000);
}
