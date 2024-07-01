var StartScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function StartScene() {
    Phaser.Scene.call(this, { key: "startScene" });
  },

  preload: function () {
    this.load.image(
      "character1",
      "https://play.rosebud.ai/assets/Designer (6)-Photoroom.png?xuER"
    );
  },

  create: function () {
    // Add the character1 image to fill the entire screen
    this.add
      .image(0, 0, "character1")
      .setOrigin(0, 0)
      .setScale(this.scale.width / 1000, this.scale.height / 800);

    var title = this.add
      .text(200, 300, "", {
        color: "black",
        fontFamily: "Arial",
        fontSize: "60px",
        padding: 0,
      })
      .setStroke("#FFFFFF", 9);

    var startButton = this.add
      .text(300, 500, "Start", {
        color: "white",
        fontFamily: "Arial",
        fontSize: "40px",
        backgroundColor: "#F5CD9F",
        padding: { left: 50, right: 50, top: 10, bottom: 10 },
      })
      .setInteractive();

    startButton.on("pointerdown", () => this.scene.start("nextScene"));
    startButton.on("pointerover", () =>
      startButton.setBackgroundColor("#F5CD9F")
    );
    startButton.on("pointerout", () =>
      startButton.setBackgroundColor("rgba(0,0,0,0.6)")
    );
  },
});
class NextScene extends Phaser.Scene {
  constructor() {
    super({ key: "nextScene" });
  }

  preload() {
    this.load.image(
      "background2",
      "https://play.rosebud.ai/assets/Constantin Horghidan CV (3).pdf (1).png?CBS8"
    );
  }

  create() {
    // Add the background image to the scene
    const backgroundImage = this.add.image(0, 0, "background2");

    // Set the image to fill the entire screen while maintaining aspect ratio
    backgroundImage.setOrigin(0, 0);
    backgroundImage.setScale(
      this.scale.width / backgroundImage.width,
      this.scale.height / backgroundImage.height
    );

    // Add any additional content or functionality for the scene here
    // Add a button to go to the next scene
    const nextSceneButton = this.add
      .text(
        this.sys.canvas.width / 2,
        this.sys.canvas.height - 50,
        "Next Page",
        {
          fontSize: "30px",
          fill: "#ffffff",
          backgroundColor: "#F5CD9F",
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
          fontFamily: "Orbitron",
        }
      )
      .setInteractive();

    nextSceneButton.on("pointerdown", () => {
      // Add your code to transition to the next scene here
      // For example:
      this.scene.start("exampleScene");
    });
  }
}

class Example extends Phaser.Scene {
  constructor() {
    super({ key: "exampleScene" });
    this.isKeyHeldDown = false;
    this.rotationSpeed = 0;
    this.maxRotationSpeed = 5.5;
    this.rotationAcceleration = 0.075;
    this.rotationDeceleration = this.rotationAcceleration / 2.5; // Deceleration speed relative to acceleration speed
    this.hasSpun = false;
    this.spinCount = 0; // Keep track of the number of spins
    this.maxSpins = 5; // Maximum number of spins
    this.controlsDisabled = false; // Flag to disable controls
    this.spinInstructionTimer = 0; // Timer for spin instruction text
    this.isSpinning = false; // Flag to track if the wheel is spinning
    this.lastRotationSpeed = 0; // Keep track of the last rotation speed
    this.maxSpeedReached = false; // Flag to track if maximum speed was reached
    this.gameEnded = false; // Flag to track if the game has ended
    this.firstSpinCompleted = false; // Flag to track if the first spin has completed
    this.wheelShattered = false; // Flag to track if the wheel has been shattered
    this.endGameTimer = 0; // Timer for end game process
    this.currentSong = null;
  }

  preload() {
    this.load.image(
      "gameShowHost",
      "https://play.rosebud.ai/assets/profile-pic (22).png?Nyit"
    );
    this.load.image(
      "gameShowStudio",
      "https://play.rosebud.ai/assets/_cf46d69a-7125-446c-b70f-8e213864d0fb.jpg?07ru"
    );

    this.load.audio("song1", "https://play.rosebud.ai/assets/1.mp3?Ivtb");
    this.load.audio("song2", "https://play.rosebud.ai/assets/2.mp3?5O94");
    this.load.audio("song3", "https://play.rosebud.ai/assets/3.mp3?Q7xF");
    this.load.audio("song4", "https://play.rosebud.ai/assets/4.mp3?iHR8");
    this.load.audio("song5", "https://play.rosebud.ai/assets/5.mp3?PVZV");
    this.load.audio("song6", "https://play.rosebud.ai/assets/6.mp3?g9f4");
    this.load.audio("song7", "https://play.rosebud.ai/assets/7.mp3?3fHp");
    this.load.audio("song8", "https://play.rosebud.ai/assets/8.mp3?ijSz");
    this.load.audio("song9", "https://play.rosebud.ai/assets/9.mp3?SVYR");
    this.load.audio("song10", "https://play.rosebud.ai/assets/10.mp3?P60W");
  }

  create() {
    // Add the game show studio background
    const backgroundImage = this.add.image(0, 0, "gameShowStudio");
    backgroundImage.setOrigin(0, 0);
    backgroundImage.setScale(
      this.scale.width / backgroundImage.width,
      this.scale.height / backgroundImage.height
    );

    const centerX = this.cameras.main.centerX;
    const maxRadius = Math.min(centerX, this.cameras.main.centerY) * 0.75;
    this.centerY = this.cameras.main.height - maxRadius;
    this.maxRadius = maxRadius;
    const numShapes = 10;
    const offset = 1.8;

    const customColors = [
      0xffcc99, // Light Pastel Orange
      0xffbb99, // Lighter Orange
      0xffddb3, // Light Peach
      0xb4f8c8, // Mint (#B4F8C8)
      0xfceca5, // Mimosa (#FCECA5)
      0xffa08c, // Light Coral Pink
      0xffc68f, // Light Apricot
      0xfbe7c6, // Yellow (#FBE7C6)
      0xffb289, // Lighter Red
      0xb5eecb, // Seafoam Green (#B5EECB)
    ];

    this.container = this.add.container(centerX, this.centerY); // Container for wheel elements

    // Create wheel slices
    for (let i = 0; i < numShapes; i++) {
      const startAngle = ((i / numShapes) * 2 - 0.5) * Math.PI;
      const endAngle = (((i + 1) / numShapes) * 2 - 0.5) * Math.PI;

      const colorValue = customColors[i % customColors.length]; // Cycle through custom colors

      const graphics = this.add.graphics({
        lineStyle: { width: 0 },
        fillStyle: { color: colorValue },
      });
      graphics.beginPath();
      graphics.arc(0, 0, maxRadius, startAngle, endAngle, false, true);
      graphics.lineTo(0, 0);
      graphics.closePath();
      graphics.fillPath();
      this.container.add(graphics);

      // Add numbers to each slice
      const midpointAngle = (startAngle + endAngle) / 2;
      const textX = maxRadius * 0.955 * Math.cos(midpointAngle);
      const textY = maxRadius * 0.955 * Math.sin(midpointAngle);
      const text = this.add
        .text(textX, textY, i + 1, { color: "#000000", fontSize: "30px" })
        .setOrigin(0.5, 0.3);
      text.angle = Phaser.Math.RadToDeg(midpointAngle + Math.PI / 2);
      this.container.add(text);
    }

    // Add yellow line
    const lineStartAngle = ((0 / numShapes) * 2 - 0.5) * Math.PI;
    const offsetLine = 21;
    const lineX1 = (maxRadius - offsetLine) * Math.cos(lineStartAngle) + offset;
    const lineY1 = (maxRadius - offsetLine) * Math.sin(lineStartAngle);
    const lineX2 = (maxRadius + 20) * Math.cos(lineStartAngle) + offset;
    const lineY2 = (maxRadius + 20) * Math.sin(lineStartAngle);
    this.yellowLine = this.add
      .line(centerX, this.centerY, lineX1, lineY1, lineX2, lineY2, 0xffff00)
      .setLineWidth(2);

    // Add game show host image to the center of the wheel
    const gameShowHost = this.add.image(0, 0, "gameShowHost").setScale(0.34); // Adjust the scale as needed
    this.container.add(gameShowHost);

    // Capture the space bar keydown and keyup events
    this.input.keyboard.on("keydown-SPACE", this.handleSpaceDown, this);
    this.input.keyboard.on("keyup-SPACE", this.handleSpaceUp, this);

    // Instruction text
    this.instructionText = this.add.text(
      centerX,
      0.25 * this.cameras.main.centerY,
      "HOLD 'SPACE' TO SPIN",
      {
        color: "#F4C4B7",
        fontSize: "34px",
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
      }
    );
    this.instructionText.setOrigin(0.5);

    // Add instruction text for holding down space bar
    this.holdSpaceText = this.add.text(
      centerX,
      0.25 * this.cameras.main.centerY,
      "HOLD 'SPACE' TO SPIN",
      {
        color: "#F4C4B7",
        fontSize: "34px",
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
      }
    );
    this.holdSpaceText.setOrigin(0.5);

    // Add pointer image
    const pointerImage = this.add.image(
      centerX,
      this.centerY - maxRadius + 10,
      "pointer"
    );
    pointerImage.setScale(0.1);

    // Preload all audio files
    this.songs = [];
    for (let i = 1; i <= 10; i++) {
      const song = this.sound.add(`song${i}`);
      this.songs.push(song);
    }
  }

  handleSpaceDown(event) {
    if (!this.isKeyHeldDown && !this.controlsDisabled && !this.gameEnded) {
      this.isKeyHeldDown = true;
      this.holdSpaceText.setVisible(true); // Show the hold space text

      // Stop the currently playing song if there is one
      if (this.currentSong) {
        this.currentSong.stop();
        this.currentSong = null;
      }

      // Reset rotation speed and flags
      this.rotationSpeed = 0;
      this.hasSpun = false;
      this.maxSpeedReached = false;
    }
  }

  handleSpaceUp(event) {
    if (this.isKeyHeldDown) {
      this.isKeyHeldDown = false;
      this.holdSpaceText.setVisible(false); // Hide the hold space text
      if (this.rotationSpeed > 0) {
        this.spinCount++; // Increment the spin count
        this.hasSpun = true;
        this.lastRotationSpeed = this.rotationSpeed; // Store the last rotation speed
        if (this.rotationSpeed >= this.maxRotationSpeed) {
          this.maxSpeedReached = true;
          this.rotationSpeed = this.maxRotationSpeed; // Cap the rotation speed at the maximum
        }
      }
    }
  }

  update() {
    if (this.isKeyHeldDown && !this.controlsDisabled && !this.gameEnded) {
      this.rotationSpeed += this.rotationAcceleration;
      this.rotationSpeed = Math.min(this.rotationSpeed, this.maxRotationSpeed);
      this.container.angle += this.rotationSpeed;
      this.hasSpun = true;
    } else if (!this.isKeyHeldDown && this.hasSpun) {
      this.rotationSpeed -= this.rotationDeceleration;
      if (this.rotationSpeed <= 0) {
        this.rotationSpeed = 0;
        this.hasSpun = false;

        if (this.maxSpeedReached) {
          // Select the slice based on the final angle of the wheel
          const selectedSlice = Math.floor(
            (((this.container.angle % 360) + 360) % 360) / (360 / 10)
          );

          // Play the corresponding song
          this.currentSong = this.songs[selectedSlice];
          this.currentSong.play();

          this.maxSpeedReached = false;
        }
      }
      this.container.angle += this.rotationSpeed;
    }

    if (this.spinCount >= this.maxSpins) {
      this.endGameTimer++;
      if (this.endGameTimer >= 150) {
        if (this.currentSong) {
          this.currentSong.stop();
        }
        this.scene.start("endScene"); // Transition to the end scene
      }
    }
  }
}

var EndScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function EndScene() {
    Phaser.Scene.call(this, { key: "endScene" });
  },

  preload: function () {
    this.load.image(
      "background2",
      "https://play.rosebud.ai/assets/IMG_20230620_214017.png?Uop6"
    );
  },

  create: function () {
    // Add the background image to the scene
    const backgroundImage = this.add.image(0, 0, "background2");

    // Set the image to fill the entire screen while maintaining aspect ratio
    backgroundImage.setOrigin(0, 0);
    backgroundImage.setScale(
      this.scale.width / backgroundImage.width,
      this.scale.height / backgroundImage.height
    );

    // Add any additional content or functionality for the scene here
    // Add a button to restart the game
    const restartButton = this.add
      .text(
        this.sys.canvas.width / 2,
        this.sys.canvas.height - 50,
        "Restart Game",
        {
          fontSize: "30px",
          fill: "#ffffff",
          backgroundColor: "#F5CD9F",
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
          fontFamily: "Orbitron",
        }
      )
      .setInteractive();

    restartButton.on("pointerdown", () => {
      // Restart the game
      this.scene.start("startScene");
    });
  },
});

const config = {
  type: Phaser.AUTO,
  parent: "renderDiv",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
  },
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 0.5 },
      debug: true, // set to false in production
    },
  },
  scene: [StartScene, NextScene, Example, EndScene],
};

window.phaserGame = new Phaser.Game(config);
