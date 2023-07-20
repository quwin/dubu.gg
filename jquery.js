$(function() {
  $( ".draggable" ).draggable();
});

const canvas = document.getElementById('drawing-board');
const background = document.getElementById('background');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');
const backgroundCtx = background.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;
const characters = ['aimi', 'asher', 'atlas', 'drekar', 'dubu', 'era', 'estelle', 'finii', 'juliette', 'juno', 'kai', 'luna', 'octavia', 'rasmus', 'rune', 'vyce', 'x', 'zentaro'];
const maps = ['images/Ai.Mis App.png', 'images/Ahten City.png', 'images/Demon Dais.png', 'images/Atlas Lab.png', 'images/Oni Village.png', 'images/Night Market.png'];


canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;
background.width = window.innerWidth - canvasOffsetX;
background.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 3;
let startX;
let startY;
let mapindex = 5;
let barrierslefttop = true;
let barriersrighttop = true;
let barriersleftbot = true;
let barriersrightbot = true;
let ally = true;

var img = new Image();
img.onload = function() {
    backgroundCtx.drawImage(img, 768, 0, 768*3, 2160, background.width/5, 0, background.width*3/5, background.width*9/16);
    barrierCheck();
};
img.src = maps[mapindex];

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (e.target.id === 'barrierslefttop') {
      barrierslefttop = !barrierslefttop;
      barrierCheck();
    }
    if (e.target.id === 'barriersrighttop') {
      barriersrighttop = !barriersrighttop;
      barrierCheck();
    }
    if (e.target.id === 'barriersleftbot') {
      barriersleftbot = !barriersleftbot;
      barrierCheck();
    }
    if (e.target.id === 'barriersrightbot') {
      barriersrightbot = !barriersrightbot;
      barrierCheck();
    }
    if (e.target.id === 'ally') {
      ally = !ally;
    }

    if (e.target.id === 'oni') {
      mapindex = 4;
      img.src = maps[mapindex];
    }
    if (e.target.id === 'ahten') {
      mapindex = 1;
      img.src = maps[mapindex];
    }
    if (e.target.id === 'aimiapp') {
      mapindex = 0;
      img.src = maps[mapindex];
    }
    if (e.target.id === 'atlaslab') {
      mapindex = 3;
      img.src = maps[mapindex];
    }
    if (e.target.id === 'night') {
      mapindex = 5;
      img.src = maps[mapindex];
    }
    if (e.target.id === 'demon') {
      mapindex = 2;
      img.src = maps[mapindex];
    }
});

function barrierCheck(){
  if (mapindex == 2) {
    clipImgSide(0, 0, 1280, 2160, 0, 0, background.width/3, background.width*9/16);
    clipImgSide(1280*2, 0, 1280, 2160, background.width*2/3, 0, background.width/3, background.width*9/16)
  }
  else if (mapindex < 2) {
    if (!barrierslefttop) {
      imgSide(0, 0, background.width/5, background.width*9/16, ' left.png');
    }
    else {
      clipImgSide(0, 0, 768, 2160, 0, 0, background.width/5, background.width*9/16)
    }
    if (!barriersrighttop) {
      imgSide(background.width*4/5, 0, background.width/5, background.width*9/16, ' right.png');
    }
    else {
      clipImgSide(768*4, 0, 768, 2160, background.width*4/5, 0, background.width/5, background.width*9/16)
    }
  }
  else {
    if (!barrierslefttop && !!!barriersleftbot) {
      imgSide(0, 0, background.width/3, background.width*9/16, ' left.png');
    }
    else if (!barrierslefttop) {
      imgSide(0, 0, background.width/3, background.width*9/16, ' left top.png');
    }
    else if (!barriersleftbot) {
      imgSide(0, 0, background.width/3, background.width*9/16, ' left bot.png');
    }
    else {
      clipImgSide(0, 0, 1280, 2160, 0, 0, background.width/3, background.width*9/16)
    }
    if (!barriersrighttop && !barriersrightbot) {
      imgSide(background.width*2/3, 0, background.width/3, background.width*9/16, ' right.png');
    }
    else if (!barriersrighttop) {
      imgSide(background.width*2/3, 0, background.width/3, background.width*9/16, ' right top.png');
    }
    else if (!barriersrightbot) {
      imgSide(background.width*2/3, 0, background.width/3, background.width*9/16, ' right bot.png');
    }
    else {
      clipImgSide(1280*2, 0, 1280, 2160, background.width*2/3, 0, background.width/3, background.width*9/16)
    }
  }
}

function imgSide(x, y, width, height, string) {
  let imgside = new Image();

  imgside.onload = function () {
    backgroundCtx.drawImage(imgside, x, y, width, height);
  }
  imgside.src = img.src.slice(0, img.src.length - 4) + string;
}

function clipImgSide(sx, sy, swidth, sheight, x, y,  width, height) {
  let imgside = new Image();

  imgside.onload = function () {
    backgroundCtx.drawImage(imgside, sx, sy, swidth, sheight, x, y,  width, height);
  }
  imgside.src = img.src;
}


toolbar.addEventListener('mousedown', e => {
  if (characters.includes(e.target.id)) {
    newSticker('images/' + e.target.id + '.png');
  }
});

function newSticker(src) {
  let img = new Image(canvas.width/30, canvas.width/30);
    img.src = src;
    img.classList.add('draggable');
    img.draggable = false;
    img.style.position = 'absolute';
    if (!ally) {
      img.style.border = '2px solid #cb4465'
    }
    document.getElementById('center').appendChild(img);

    // Start dragging immediately
    let offsetX = img.getBoundingClientRect().left + 45;
    let offsetY = img.getBoundingClientRect().top + 45;
    
    function moveSticker(event) {
      img.style.left = (event.clientX - offsetX) + 'px';
      img.style.top = (event.clientY - offsetY) + 'px';
    }

    function stopDragging() {
      outOfBounds();
      window.removeEventListener('mousemove', moveSticker);
      window.removeEventListener('mouseup', stopDragging);
    }

    window.addEventListener('mousemove', moveSticker);
    window.addEventListener('mouseup', stopDragging);

    $( ".draggable" ).draggable({
      // idk why this doesn't work if I call outOfBounds() instead of repeating the function
      stop: function() {
        var stickerElements = document.getElementsByClassName('draggable');
        for (var i = 0; i < stickerElements.length; i++) {
          var x = stickerElements[i].getBoundingClientRect().right;
          var y = stickerElements[i].getBoundingClientRect().top;
          if (x < canvasOffsetX || x > (canvasOffsetX + canvas.offsetWidth) ||
              y <canvasOffsetY || y > (canvas.offsetTop + canvas.offsetHeight)) {
            stickerElements[i].remove();
          }
        }
      }
    });
}

function outOfBounds() {
  // Get the current position of the sticker
  var stickerElements = document.getElementsByClassName('draggable');

  for (var i = 0; i < stickerElements.length; i++) {
    // Get the current position of the sticker
    var x = stickerElements[i].getBoundingClientRect().right;
    var y = stickerElements[i].getBoundingClientRect().top;

    // Check if the sticker is outside the canvas boundaries
    if (x < canvasOffsetX || x > (canvasOffsetX + canvas.offsetWidth) ||
        y <canvasOffsetY || y > (canvas.offsetTop + canvas.offsetHeight)) {
      // Sticker is outside the canvas, remove it
      stickerElements[i].remove();
    }
  }
}


toolbar.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if(e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }
    
});

const draw = (e) => {
    if(!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);