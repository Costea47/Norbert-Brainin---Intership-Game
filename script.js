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

    // Create text object for slice number and make it invisible
    this.sliceText = this.add
      .text(centerX + offset, this.centerY - maxRadius - 50, "", {
        color: "#ffffff",
        fontSize: "32px",
      })
      .setOrigin(0.5, 0.8);
    this.sliceText.setVisible(false);

    // Initialize total score and create text object for displaying the score
    this.totalScore = 0;
    this.scoreText = this.add.text(10, 10, "Score: 0", {
      color: "#ffffff",
      fontSize: "32px",
    });
    this.scoreText.setVisible(false); // Make the score text invisible

    // Create text object for overall rank
    this.rankText = this.add
      .text(centerX, 10, "Song:", { color: "#ffffff", fontSize: "24px" })
      .setOrigin(0.5, 0);

    // Create text object for "of 50" after the rank
    this.rankOfText = this.add
      .text(centerX + 143, 23, "", { color: "#ffffff", fontSize: "18px" })
      .setOrigin(0, 0.5);
    this.rankOfText.setVisible(false); // Make the "of 50" text invisible initially

    // Create text object for spins remaining
    this.spinsRemainingText = this.add
      .text(centerX, 34, "Spins Remaining: " + this.maxSpins, {
        color: "#ffffff",
        fontSize: "24px",
      })
      .setOrigin(0.5, 0);

    // Create text object for spin instructions
    this.spinInstructionsText = this.add
      .text(centerX, 58, "Hold the space bar to spin.", {
        color: "#FFFF00",
        fontSize: "24px",
      })
      .setOrigin(0.5, 0);

    // Create a semi-transparent black background for the text
    const textBackground = this.add
      .rectangle(0, 0, this.cameras.main.width, 100, 0x000000, 0.5)
      .setOrigin(0, 0);
    textBackground.setPosition(0, 10);

    // Add the semi-transparent black background to the scene
    this.add.existing(textBackground);

    // Add the text objects to a separate container
    this.textContainer = this.add.container(0, 0);
    this.textContainer.add(this.scoreText);
    this.textContainer.add(this.rankText);
    this.textContainer.add(this.rankOfText);
    this.textContainer.add(this.spinsRemainingText);
    this.textContainer.add(this.spinInstructionsText);
  }

  handleSpaceDown() {
    if (
      !this.isSpinning &&
      !this.controlsDisabled &&
      this.spinCount < this.maxSpins
    ) {
      this.isKeyHeldDown = true;
    }
  }

  handleSpaceUp() {
    this.isKeyHeldDown = false;
  }

  update(time, delta) {
    if (this.isKeyHeldDown) {
      // If the space bar is held down, accelerate the rotation speed
      this.rotationSpeed = Math.min(
        this.rotationSpeed + this.rotationAcceleration,
        this.maxRotationSpeed
      );
      this.hasSpun = true; // Set hasSpun to true when the wheel is spun
      this.isSpinning = true; // Set isSpinning flag to true
      this.maxSpeedReached = this.rotationSpeed === this.maxRotationSpeed; // Set maxSpeedReached flag
    }

    this.container.angle -= this.rotationSpeed; // Reverse the wheel spin direction

    // Gradually decelerate the wheel when the space bar is not pressed
    if (!this.isKeyHeldDown && this.rotationSpeed > 0) {
      this.rotationSpeed = Math.max(
        this.rotationSpeed - this.rotationDeceleration,
        0
      );
    }

    // Update slice text
    const numShapes = 10;
    const sliceAngle =
      ((((this.container.angle % 360) + 360) % 360) - 0.5 - 1 / numShapes) /
      (360 / numShapes);
    const sliceNumber = Math.floor(sliceAngle + 1);
    this.sliceText.setText(sliceNumber === 0 ? 1 : 11 - sliceNumber);

    // Update score when the wheel stops, but only if it has spun at least once and maximum speed was achieved
    if (
      this.hasSpun &&
      this.rotationSpeed === 0 &&
      this.lastRotationSpeed !== 0
    ) {
      this.isSpinning = false; // Reset isSpinning flag
      if (this.maxSpeedReached) {
        this.spinCount++; // Increment spin count
        this.totalScore += sliceNumber === 0 ? 1 : 51 - sliceNumber;
        this.scoreText.setText("Score: " + this.totalScore);
        this.rankText.setText("Song: " + this.calculateRank());

        // If no spins remaining, update rank text color to yellow and remove spins remaining, spin instructions, and yellow line
        if (this.spinCount === this.maxSpins) {
          const centerX = this.cameras.main.centerX;
          this.rankOfText.setVisible(false); // Clear the "of 50" text
          this.spinsRemainingText
            .setText("Refresh the page to restart.")
            .setFontSize(40)
            .setPosition(centerX, 72); // Increase font size and move down the "Refresh the page" text
          this.spinInstructionsText.setText("");
          this.gameEnded = true; // Set the gameEnded flag
          this.endGameTimer = 2000; // Set the end game timer to 2 seconds
        } else {
          this.spinsRemainingText.setText(
            "Spins Remaining: " + (this.maxSpins - this.spinCount)
          ); // Update spins remaining
          if (!this.firstSpinCompleted) {
            this.firstSpinCompleted = true; // Set the firstSpinCompleted flag
            this.rankOfText.setVisible(true); // Make the "of 50" text visible
          }
        }
      } else {
        // Maximum speed not achieved, disable controls and update spin instruction text
        this.controlsDisabled = true;
        this.spinInstructionsText
          .setText("Full spin required, please.")
          .setColor("#ff0000")
          .setFontSize(42); // Increase font size by 50%
        this.spinInstructionTimer = 3000; // Set timer for 3 seconds
      }
      this.maxSpeedReached = false; // Reset maxSpeedReached flag
    }

    // Update spin instruction text after 3 seconds if maximum speed was not achieved
    if (this.spinInstructionTimer > 0) {
      this.spinInstructionTimer -= delta;
      if (this.spinInstructionTimer <= 0) {
        this.controlsDisabled = false;
        this.spinInstructionsText
          .setText("Hold the space bar to spin.")
          .setColor("#FFFF00")
          .setFontSize(24); // Reset font size
      }
    }

    // Disable controls if the game has ended
    if (this.gameEnded) {
      this.controlsDisabled = true;
      this.endGameTimer -= delta;
      if (this.endGameTimer <= 0) {
        this.yellowLine.setVisible(false); // Remove the yellow line
        this.shatterWheel(); // Call the shatterWheel method after 2 seconds
      }
    }

    this.lastRotationSpeed = this.rotationSpeed;
  }

  shatterWheel() {
    if (!this.wheelShattered) {
      this.wheelShattered = true; // Set the wheelShattered flag to true

      // Add a tween to shatter the wheel
      this.tweens.add({
        targets: this.container,
        angle: this.container.angle + 360 * 2, // Rotate the container by 720 degrees
        duration: 1000, // Duration of the rotation
        onComplete: () => {
          // After the rotation completes, scatter the slices
          this.container.list.forEach((slice, index) => {
            const randomX = Phaser.Math.Between(
              -this.cameras.main.width / 2,
              this.cameras.main.width / 2
            );
            const randomY = Phaser.Math.Between(
              -this.cameras.main.height / 2,
              this.cameras.main.height / 2
            );
            const randomRotation = Phaser.Math.Between(-180, 180);

            this.tweens.add({
              targets: slice,
              x: randomX,
              y: randomY,
              angle: randomRotation,
              duration: 1000,
              ease: "Cubic.easeOut",
              delay: index * 50, // Add a delay to scatter the slices one by one
            });
          });
        },
      });
    }
  }

  calculateRank() {
    const numShapes = 50;
    const rank = 51 - this.totalScore / this.spinCount;
    const placeSuffix = ["th", "st", "nd", "rd"];
    const v = Math.floor(rank);
    const suffix =
      v % 10 === 1 && v !== 11
        ? placeSuffix[1]
        : v % 10 === 2 && v !== 12
        ? placeSuffix[2]
        : v % 10 === 3 && v !== 13
        ? placeSuffix[3]
        : placeSuffix[0];
    return v + suffix;
  }
}

// class Example extends Phaser.Scene {
//   constructor() {
//     super({ key: "exampleScene" });
//     this.isKeyHeldDown = false;
//     this.rotationSpeed = 0;
//     this.maxRotationSpeed = 5.5;
//     this.rotationAcceleration = 0.075;
//     this.rotationDeceleration = this.rotationAcceleration / 2.5; // Deceleration speed relative to acceleration speed
//     this.hasSpun = false;
//     this.spinCount = 0; // Keep track of the number of spins
//     this.maxSpins = 5; // Maximum number of spins
//     this.controlsDisabled = false; // Flag to disable controls
//     this.spinInstructionTimer = 0; // Timer for spin instruction text
//     this.isSpinning = false; // Flag to track if the wheel is spinning
//     this.lastRotationSpeed = 0; // Keep track of the last rotation speed
//     this.maxSpeedReached = false; // Flag to track if maximum speed was reached
//     this.gameEnded = false; // Flag to track if the game has ended
//     this.firstSpinCompleted = false; // Flag to track if the first spin has completed
//     this.wheelShattered = false; // Flag to track if the wheel has been shattered
//     this.endGameTimer = 0; // Timer for end game process
//   }

//   preload() {
//     this.load.image(
//       "gameShowHost",
//       "https://play.rosebud.ai/assets/profile-pic (22).png?Nyit"
//     );
//     this.load.image(
//       "gameShowStudio",
//       "https://play.rosebud.ai/assets/_cf46d69a-7125-446c-b70f-8e213864d0fb.jpg?07ru"
//     );
//   }

//   create() {
//     // Add the game show studio background
//     const backgroundImage = this.add.image(0, 0, "gameShowStudio");
//     backgroundImage.setOrigin(0, 0);
//     backgroundImage.setScale(
//       this.scale.width / backgroundImage.width,
//       this.scale.height / backgroundImage.height
//     );

//     const centerX = this.cameras.main.centerX;
//     const maxRadius = Math.min(centerX, this.cameras.main.centerY) * 0.75;
//     this.centerY = this.cameras.main.height - maxRadius;
//     this.maxRadius = maxRadius;
//     const numShapes = 10;
//     const offset = 1.8;

//     const customColors = [
//       0xffcc99, // Light Pastel Orange
//       0xffbb99, // Lighter Orange
//       0xffddb3, // Light Peach
//       0xb4f8c8, // Mint (#B4F8C8)
//       0xfceca5, // Mimosa (#FCECA5)
//       0xffa08c, // Light Coral Pink
//       0xffc68f, // Light Apricot
//       0xfbe7c6, // Yellow (#FBE7C6)
//       0xffb289, // Lighter Red
//       0xb5eecb, // Seafoam Green (#B5EECB)
//     ];

//     this.container = this.add.container(centerX, this.centerY); // Container for wheel elements

//     // Create wheel slices
//     for (let i = 0; i < numShapes; i++) {
//       const startAngle = ((i / numShapes) * 2 - 0.5) * Math.PI;
//       const endAngle = (((i + 1) / numShapes) * 2 - 0.5) * Math.PI;

//       const colorValue = customColors[i % customColors.length]; // Cycle through custom colors

//       const graphics = this.add.graphics({
//         lineStyle: { width: 0 },
//         fillStyle: { color: colorValue },
//       });
//       graphics.beginPath();
//       graphics.arc(0, 0, maxRadius, startAngle, endAngle, false, true);
//       graphics.lineTo(0, 0);
//       graphics.closePath();
//       graphics.fillPath();
//       this.container.add(graphics);

//       // Add numbers to each slice
//       const midpointAngle = (startAngle + endAngle) / 2;
//       const textX = maxRadius * 0.955 * Math.cos(midpointAngle);
//       const textY = maxRadius * 0.955 * Math.sin(midpointAngle);
//       const text = this.add
//         .text(textX, textY, i + 1, { color: "#000000", fontSize: "30px" })
//         .setOrigin(0.5, 0.3);
//       text.angle = Phaser.Math.RadToDeg(midpointAngle + Math.PI / 2);
//       this.container.add(text);
//     }

//     // Add yellow line
//     const lineStartAngle = ((0 / numShapes) * 2 - 0.5) * Math.PI;
//     const offsetLine = 21;
//     const lineX1 = (maxRadius - offsetLine) * Math.cos(lineStartAngle) + offset;
//     const lineY1 = (maxRadius - offsetLine) * Math.sin(lineStartAngle);
//     const lineX2 = (maxRadius + 20) * Math.cos(lineStartAngle) + offset;
//     const lineY2 = (maxRadius + 20) * Math.sin(lineStartAngle);
//     this.yellowLine = this.add
//       .line(centerX, this.centerY, lineX1, lineY1, lineX2, lineY2, 0xffff00)
//       .setLineWidth(2);

//     // Add game show host image to the center of the wheel
//     const gameShowHost = this.add.image(0, 0, "gameShowHost").setScale(0.34); // Adjust the scale as needed
//     this.container.add(gameShowHost);

//     // Capture the space bar keydown and keyup events
//     this.input.keyboard.on("keydown-SPACE", this.handleSpaceDown, this);
//     this.input.keyboard.on("keyup-SPACE", this.handleSpaceUp, this);

//     // Create text object for slice number and make it invisible
//     this.sliceText = this.add
//       .text(centerX + offset, this.centerY - maxRadius - 50, "", {
//         color: "#ffffff",
//         fontSize: "32px",
//       })
//       .setOrigin(0.5, 0.8);
//     this.sliceText.setVisible(false);

//     // Initialize total score and create text object for displaying the score
//     this.totalScore = 0;
//     this.scoreText = this.add.text(10, 10, "Score: 0", {
//       color: "#ffffff",
//       fontSize: "32px",
//     });
//     this.scoreText.setVisible(false); // Make the score text invisible

//     // Create text object for overall rank
//     this.rankText = this.add
//       .text(centerX, 10, "Song:", { color: "#ffffff", fontSize: "24px" })
//       .setOrigin(0.5, 0);

//     // Create text object for "of 10" after the rank
//     this.rankOfText = this.add
//       .text(centerX + 143, 23, "", { color: "#ffffff", fontSize: "18px" })
//       .setOrigin(0, 0.5);
//     this.rankOfText.setVisible(false); // Make the "of 10" text invisible initially

//     // Create text object for spins remaining
//     this.spinsRemainingText = this.add
//       .text(centerX, 34, "Spins Remaining: " + this.maxSpins, {
//         color: "#ffffff",
//         fontSize: "24px",
//       })
//       .setOrigin(0.5, 0);

//     // Create text object for spin instructions
//     this.spinInstructionsText = this.add
//       .text(centerX, 58, "Hold the space bar to spin.", {
//         color: "#FFFF00",
//         fontSize: "24px",
//       })
//       .setOrigin(0.5, 0);

//     // Create a semi-transparent black background for the text
//     const textBackground = this.add
//       .rectangle(0, 0, this.cameras.main.width, 100, 0x000000, 0.5)
//       .setOrigin(0, 0);
//     textBackground.setPosition(0, 10);

//     // Add the semi-transparent black background to the scene
//     this.add.existing(textBackground);

//     // Add the text objects to a separate container
//     this.textContainer = this.add.container(0, 0);
//     this.textContainer.add(this.scoreText);
//     this.textContainer.add(this.rankText);
//     this.textContainer.add(this.rankOfText);
//     this.textContainer.add(this.spinsRemainingText);
//     this.textContainer.add(this.spinInstructionsText);
//   }

//   handleSpaceDown() {
//     if (
//       !this.isSpinning &&
//       !this.controlsDisabled &&
//       this.spinCount < this.maxSpins
//     ) {
//       this.isKeyHeldDown = true;
//     }
//   }

//   handleSpaceUp() {
//     this.isKeyHeldDown = false;
//   }

//   update(time, delta) {
//     if (this.isKeyHeldDown) {
//       // If the space bar is held down, accelerate the rotation speed
//       this.rotationSpeed = Math.min(
//         this.rotationSpeed + this.rotationAcceleration,
//         this.maxRotationSpeed
//       );
//       this.hasSpun = true; // Set hasSpun to true when the wheel is spun
//       this.isSpinning = true; // Set isSpinning flag to true
//       this.maxSpeedReached = this.rotationSpeed === this.maxRotationSpeed; // Set maxSpeedReached flag
//     }

//     this.container.angle -= this.rotationSpeed; // Reverse the wheel spin direction

//     // Gradually decelerate the wheel when the space bar is not pressed
//     if (!this.isKeyHeldDown && this.rotationSpeed > 0) {
//       this.rotationSpeed = Math.max(
//         this.rotationSpeed - this.rotationDeceleration,
//         0
//       );
//     }

//     // Update slice text
//     const numShapes = 10; // Number of shapes (slices) on the wheel
//     const sliceAngle =
//       ((((this.container.angle % 360) + 360) % 360) - 0.5 - 1 / numShapes) /
//       (360 / numShapes);
//     const sliceNumber = Math.floor(sliceAngle + 1);
//     this.sliceText.setText(sliceNumber === 0 ? 1 : 11 - sliceNumber); // Update the text showing the current slice number

//     // Update score when the wheel stops, but only if it has spun at least once and maximum speed was achieved
//     if (
//       this.hasSpun &&
//       this.rotationSpeed === 0 &&
//       this.lastRotationSpeed !== 0
//     ) {
//       this.isSpinning = false; // Reset isSpinning flag
//       if (this.maxSpeedReached) {
//         this.spinCount++; // Increment spin count
//         this.totalScore += sliceNumber === 0 ? 1 : 11 - sliceNumber;
//         this.scoreText.setText("Score: " + this.totalScore);
//         this.rankText.setText("Song: " + this.calculateRank()); // Update the rank text to show the current song

//         // If no spins remaining, update rank text color to yellow and remove spins remaining, spin instructions, and yellow line
//         if (this.spinCount === this.maxSpins) {
//           const centerX = this.cameras.main.centerX;
//           this.rankOfText.setVisible(false); // Clear the "of 10" text
//           this.spinsRemainingText
//             .setText("Refresh the page to restart.")
//             .setFontSize(40)
//             .setPosition(centerX, 72); // Increase font size and move down the "Refresh the page" text
//           this.spinInstructionsText.setText("");
//           this.gameEnded = true; // Set the gameEnded flag
//           this.endGameTimer = 2000; // Set the end game timer to 2 seconds
//         } else {
//           this.spinsRemainingText.setText(
//             "Spins Remaining: " + (this.maxSpins - this.spinCount)
//           ); // Update spins remaining
//           if (!this.firstSpinCompleted) {
//             this.firstSpinCompleted = true; // Set the firstSpinCompleted flag
//             this.rankOfText.setVisible(true); // Make the "of 10" text visible
//           }
//         }
//       } else {
//         // Maximum speed not achieved, disable controls and update spin instruction text
//         this.controlsDisabled = true;
//         this.spinInstructionsText
//           .setText("Full spin required, please.")
//           .setColor("#ff0000")
//           .setFontSize(42); // Increase font size by 50%
//         this.spinInstructionTimer = 3000; // Set timer for 3 seconds
//       }
//       this.maxSpeedReached = false; // Reset maxSpeedReached flag
//     }

//     // Update spin instruction text after 3 seconds if maximum speed was not achieved
//     if (this.spinInstructionTimer > 0) {
//       this.spinInstructionTimer -= delta;
//       if (this.spinInstructionTimer <= 0) {
//         this.controlsDisabled = false;
//         this.spinInstructionsText
//           .setText("Hold the space bar to spin.")
//           .setColor("#FFFF00")
//           .setFontSize(24); // Reset font size
//       }
//     }

//     // Disable controls if the game has ended
//     if (this.gameEnded) {
//       this.controlsDisabled = true;
//       this.endGameTimer -= delta;
//       if (this.endGameTimer <= 0) {
//         this.yellowLine.setVisible(false); // Remove the yellow line
//         this.shatterWheel(); // Call the shatterWheel method after 2 seconds
//       }
//     }

//     this.lastRotationSpeed = this.rotationSpeed;
//   }

//   calculateRank() {
//     const numShapes = 10; // Number of shapes (slices) on the wheel
//     const rank = 11 - this.totalScore / this.spinCount;
//     const placeSuffix = ["th", "st", "nd", "rd"];
//     const v = Math.floor(rank);
//     const suffix =
//       v % 10 === 1 && v !== 11
//         ? placeSuffix[1]
//         : v % 10 === 2 && v !== 12
//         ? placeSuffix[2]
//         : v % 10 === 3 && v !== 13
//         ? placeSuffix[3]
//         : placeSuffix[0];
//     return v + suffix;
//   }

//   // Shatter the wheel into pieces
//   shatterWheel() {
//     if (this.wheelShattered) return; // Exit if the wheel has already been shattered

//     const numPieces = 10; // Number of pieces to shatter into
//     const angleOffset = Math.PI / numPieces;
//     const speedRange = { min: 300, max: 600 };
//     const containerX = this.container.x;
//     const containerY = this.container.y;

//     for (let i = 0; i < numPieces; i++) {
//       const angle = (i / numPieces) * Math.PI * 2;
//       const piece = this.add.graphics();
//       piece.fillStyle(0xffffff, 1);
//       piece.slice(
//         containerX,
//         containerY,
//         this.maxRadius,
//         angle,
//         angle + angleOffset,
//         true
//       );
//       piece.fillPath();

//       const body = this.physics.add
//         .existing(piece)
//         .body.setCircle(this.maxRadius, -this.maxRadius, -this.maxRadius);
//       body.setVelocity(
//         Phaser.Math.Between(speedRange.min, speedRange.max) *
//           Math.cos(angle + angleOffset / 2),
//         Phaser.Math.Between(speedRange.min, speedRange.max) *
//           Math.sin(angle + angleOffset / 2)
//       );
//       body.setAngularVelocity(
//         Phaser.Math.Between(speedRange.min, speedRange.max) / 4
//       );
//     }

//     this.container.setVisible(false); // Hide the original container
//     this.wheelShattered = true; // Set the wheelShattered flag
//   }
// }

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
  scene: [StartScene, NextScene, Example],
};

window.phaserGame = new Phaser.Game(config);
