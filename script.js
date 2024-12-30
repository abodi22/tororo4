/****************************************************
  1. Function to start audio on user interaction.
*****************************************************/
function playAudio() {
  const audio = document.getElementById('bgAudio');
  audio.play().catch(e => {
    console.warn('Audio playback failed:', e);
  });
}

// Attach the playAudio function to the button
window.addEventListener('load', () => {
  const playButton = document.getElementById('playButton');
  playButton.addEventListener('click', playAudio);

  // Initialize the hearts animation after the page loads
  init();
});


/****************************************************
  2. Hearts + Poem Animation (EaselJS)
*****************************************************/
var canvas;
var stage;
var container;
var captureContainers;
var captureIndex;

function init() {
  canvas = document.getElementById("testCanvas");
  stage = new createjs.Stage(canvas);

  // Make canvas fill the screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var w = canvas.width;
  var h = canvas.height;

  container = new createjs.Container();
  stage.addChild(container);

  captureContainers = [];
  captureIndex = 0;

  // Create 100 hearts
  for (var i = 0; i < 100; i++) {
    var heart = new createjs.Shape();
    heart.graphics
      .beginFill(createjs.Graphics.getHSL(Math.random() * 30 - 45, 100, 50 + Math.random() * 30))
      .moveTo(0, -12).curveTo(1, -20, 8, -20)
      .curveTo(16, -20, 16, -10)
      .curveTo(16, 0, 0, 12)
      .curveTo(-16, 0, -16, -10)
      .curveTo(-16, -20, -8, -20)
      .curveTo(-1, -20, 0, -12);
    heart.y = -100;
    container.addChild(heart);
  }

  // New poem text
  var poemLines = [
    "يا بداية كل عام جديد، ويا أجمل شعور في حياتي.",
    "أنتِ ختام عامي القديم وبداية عامي الجديد.",
    "أحبك في ختام السنة وفي بدايتها، وحتى نهاية العمر.",
    "معك كل يوم هو عيد، وكل عام وأنا أحبك أكثر من العام الذي سبقه.",
    "يا أجمل رورو في حياتي، الله يديمك لي يا عيوني، ويبقى حبك أجمل نعمة لي للأبد.",
    "كل عام وأنتِ أجمل قمر بين نجوم."
  ];

  var text = new createjs.Text(poemLines.join("\n"), "bold 27px Verdana", "#DFCB60");
  text.textAlign = "center";
  text.x = w / 2;
  // Center the block of text vertically
  text.y = h / 2 - text.getMeasuredHeight() / 2;
  stage.addChild(text);

  // Prepare capture containers for a trailing effect
  for (var i = 0; i < 100; i++) {
    var captureContainer = new createjs.Container();
    captureContainer.cache(0, 0, w, h);
    captureContainers.push(captureContainer);
  }

  // Start the ticker
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on("tick", tick);
}

function tick(event) {
  var w = canvas.width;
  var h = canvas.height;
  var l = container.numChildren;

  // Move container to the next capture container for the trailing effect
  captureIndex = (captureIndex + 1) % captureContainers.length;
  stage.removeChildAt(0);
  var captureContainer = captureContainers[captureIndex];
  stage.addChildAt(captureContainer, 0);
  captureContainer.addChild(container);

  // Move hearts
  for (var i = 0; i < l; i++) {
    var heart = container.getChildAt(i);
    if (heart.y < -50) {
      heart._x = Math.random() * w;
      heart.y = h * (1 + Math.random()) + 50;
      heart.perX = (1 + Math.random() * 2) * h;
      heart.offX = Math.random() * h;
      heart.ampX = heart.perX * 0.1 * (0.15 + Math.random());
      heart.velY = -Math.random() * 2 - 1;
      heart.scale = Math.random() * 2 + 1;
      heart._rotation = Math.random() * 40 - 20;
      heart.alpha = Math.random() * 0.75 + 0.05;
      heart.compositeOperation = Math.random() < 0.33 ? "lighter" : "source-over";
    }
    var int = (heart.offX + heart.y) / heart.perX * Math.PI * 2;
    heart.y += heart.velY * heart.scaleX / 2;
    heart.x = heart._x + Math.cos(int) * heart.ampX;
    heart.rotation = heart._rotation + Math.sin(int) * 30;
  }

  // Update the capture container’s cache
  captureContainer.updateCache("source-over");

  // Draw everything
  stage.update(event);
}
