
    function $(elem){
  return document.querySelector(elem);
}

function $$(elem){
  return document.querySelectorAll(elem);
}

// beep
var audio = new Audio("https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/beep3.wav");

var imagesCtr = $$(".image-ctr"),
    images = $$(".image"),
    imagesLength = images.length - 1;

// nodelist to array
imagesCtr = [].slice.call(imagesCtr);

var sliderCtr = $(".slider-ctr"),
    videoBg = $(".video-bg"),
    title = $(".title"),
    detail = $(".detail");

// get the next siblings of selected element
function nextSiblings(x, y){
  var arr = [];
  for(y; y < x; x--){
    arr.push(x);
  }
  return arr.reverse();
}

// get the previous siblings of selected element
function prevSiblings(x){
  var arr = [];
  for(var y = -1, x = x - 1; y < x; x--){
    arr.push(x);
  }
  return arr;
}

var tl = new TimelineMax(),
    tlText = new TimelineMax(),
    tlAdditional = new TimelineMax();

images.forEach(function(image){
  
  image.addEventListener("click", function(){
      
    setTimeout(function(){
      videoBg.classList.add("active");
    }, 600);
    
    var index = parseInt(this.getAttribute("data-index")),
        yAnim = -40,
        thisImage = this;
    
    console.log(this)
    
    tlText
      .staggerTo([title, detail], .15, {
        y: -15,
        opacity: 0
      }, -.15)
      .set([title, detail], {
        y: 15
      })
    
    tl
      .set(thisImage, {
      className: "+=selected disabled"
    })
      .to(thisImage, .05, {
      scale: 1,
      easing: Elastic.easeOut
    })
      .to(thisImage, .15, {
      opacity: 0,
      y: yAnim,
      onComplete: nextTl
    })
      .set(thisImage, {
      y: yAnim * (-1),
    })
    
    prevSiblings(index).map(function(x){
      tl.set(imagesCtr[x], {
        className: "+=disabled"
      }).to(imagesCtr[x], .15, {
        opacity: 0,
        y: yAnim
      }).set(imagesCtr[x], {
        y: yAnim * (-1),
      })
    });
    
    function nextTl() {
      nextSiblings(imagesLength, index).map(function(x){
        tlAdditional.set(imagesCtr[x], {
          className: "+=disabled"
        }).to(imagesCtr[x], .15, {
          opacity: 0,
          y: yAnim
        }).set(imagesCtr[x], {
        y: yAnim * (-1),
      })
      })
    }
    
  });
  
  image.addEventListener("mouseenter", function(){
    this.children[0].classList.add("light-on");
  });
  
  image.addEventListener("mousemove", function(e){
    var w = this.offsetWidth,
        h = this.offsetHeight,
        o = 9 - e.offsetX / w * 18,
        a = 9 - e.offsetY / h * 18,
        n = e.offsetX - w / 2,
        r = e.offsetY - h / 2,
        s = Math.atan2(r, n),
        t = 180 * s / Math.PI - 90,
        transform = "translateY(" + -o + "px) translateX(" + -a + "px) rotateX(" + -a + "deg) rotateY(" + -o + "deg)";
    
    this.style.MozTransform = transform;
    this.style.WebkitTransform = transform;
    
    this.children[0].style.background = "linear-gradient(" + t + "deg, rgba(255,255,255," + e.offsetY / h / 2 + ") 0%,rgba(255,255,255,0) 60%)";
    
  });
  
  image.addEventListener("mouseleave", function(e){
    this.style.MozTransform = "none";
    this.style.WebkitTransform = "none";
    this.children[0].classList.remove("light-on");
  });
  
});

var closeBtn = $(".close");

closeBtn.addEventListener("mouseenter", function(){
  audio.play();
});

closeBtn.addEventListener("click", function(){
  videoBg.classList.remove("active");
  
  var imageSelected;
  
  imagesCtr.filter(function(x){
    if(x.classList.contains("selected")){
      return imageSelected = x;
    }
  });
  
  var index = parseInt(imageSelected.children[0].getAttribute("data-index"));
  
  tlText.staggerTo([title, detail], .15, {
    y: 0,
    opacity: 1
  }, .15)
  
  tl
    .to(imageSelected, .15, {
    delay: .15,
    opacity: 1,
    y: 0,
    onComplete: nextTl
  })
    .set(imageSelected, {
    className: "-=selected disabled",
    attr: {"style": "none"}
  })
  
  prevSiblings(index).map(function(x){
    tl
      .to(imagesCtr[x], .15, {
      opacity: 1,
      y: 0,
      delay:  -.05
    })
      .set(imagesCtr[x], {
      className: "-=disabled",
      attr: {"style": "none"}
    })
    
  });

  function nextTl() {
    nextSiblings(imagesLength, index).map(function(x){
      tlAdditional
        .to(imagesCtr[x], .15, {
        opacity: 1,
        y: 0,
        delay:  -.05
      })
        .set(imagesCtr[x], {
        className: "-=disabled",
        attr: {"style": "none"}
      })
    })
  }
  
});

balapaCop("Apple TV Interaction", "rgba(255,255,255,.8)");

  