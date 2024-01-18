const tabLinks = document.getElementsByClassName("tab-links");
const tabContents = document.getElementsByClassName("tab-contents");
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");
const canvas = document.querySelector("canvas");
const loader = document.getElementById("preloader");
const track = document.getElementById("image-track");

function openTab(tabName){

    for(tabLink of tabLinks){
        tabLink.classList.remove("active-link")
    }
    for(tabContent of tabContents){
        tabContent.classList.remove("active-tab")
    }
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabName).classList.add('active-tab');
}

// cursor thingy

const textArray = ["3D", "sculpting", "VFX", "Motion Design"];
const typingDelay = 100;
const erasingDelay = 60;
const newTextDelay = 2000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if(textArrayIndex>=textArray.length) textArrayIndex=0;
    setTimeout(type, typingDelay + 1100);
  }
}

document.addEventListener("DOMContentLoaded", function() { // On DOM Load initiate the effect
  if(textArray.length) setTimeout(type, newTextDelay + 250);
});

function autoScroll() {

  function autoMini(desiredValue){
    // Specify the container element by its ID
    console.log("yeagh");
    var container = document.getElementById('autoscroll');
    console.log(!!container);
    // Scroll the container horizontally by a fixed amount (adjust as needed)
    container.scrollLeft += 1;
    console.log(container.scrollLeft);
    
    if(container.scrollLeft>desiredValue){
      console.log("naur");
      clearInterval(interval);
    }
  }
  // setInterval(autoMini(300), 1);

}

// Set an interval to call the autoScroll function every 2 seconds (2000 milliseconds)
setInterval(autoScroll, 2000);


// scrolll things ---------------------------------
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const context = canvas.getContext("2d");
  const frameCount = 120;

  const currentFrame = (index) => `./BH-frames/${(index + 1).toString()}.png`;  

  const images = [];

  let frame = {frame: 0};

  for(let i = 1; i<frameCount; i++){
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }


  gsap.to(frame, {
    frame: frameCount-1,
    snap: 'frame',
    ease: "none",
    scrollTrigger: {
      scrub: true,
      start: "0% start",
      end: "50% center"
      
    },
    onUpdate: render,
  })



  images[0].onload = render;

  function render(){
    context.canvas.width = images[0].width;
    context.canvas.height = images[0].height;
    context.clearRect(0,0, canvas.width, canvas.height);
    if (document.readyState === 'complete') {
    context.drawImage(images[frame.frame], 0, 0);
    }
  }

  // loader.style.display = 'none';
  // this.document.body.style.overflowY = 'auto';
  
  window.addEventListener("load", function(){
      loader.style.display = 'none';
      this.document.body.style.overflowY = 'auto';
  });
  let intervalID = setInterval(loadCheck, 1000);

  function loadCheck() {
    console.log("a");
    if(loader.style.display != 'none'){
    console.log("b");
      if (document.readyState === 'complete') {
        console.log("c");
        loader.style.display = 'none';
        this.document.body.style.overflowY = 'auto';
      }
    }
}



  // bottom gallery slider here


  const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;
  
  const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";  
    track.dataset.prevPercentage = track.dataset.percentage;
  }
  
  const handleOnMove = e => {
    if(track.dataset.mouseDownAt === "0") return;
    
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
          maxDelta = window.innerWidth;
    
    const percentage = (mouseDelta / maxDelta) * -100,
          nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
          nextPercentage = (Math.max(Math.min(nextPercentageUnconstrained, 0), -100));
    
    track.dataset.percentage = nextPercentage;
    
    track.animate({
      transform: `translate(${nextPercentage*3.5}%, 0%)`
    }, { duration: 1200, fill: "forwards" });
    
    for(const image of track.getElementsByClassName("image")) {
      image.animate({
        objectPosition: `${100 + nextPercentage}% center`
      }, { duration: 1200, fill: "forwards" });
    }
  }
  
  window.onmousedown = e => handleOnDown(e);
  
  window.ontouchstart = e => handleOnDown(e.touches[0]);
  
  window.onmouseup = e => handleOnUp(e);
  
  window.ontouchend = e => handleOnUp(e.touches[0]);
  
  window.onmousemove = e => handleOnMove(e);
  
  window.ontouchmove = e => handleOnMove(e.touches[0]);