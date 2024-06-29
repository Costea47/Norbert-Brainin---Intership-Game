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
  scene: [StartScene, NextScene],
};

window.phaserGame = new Phaser.Game(config);
