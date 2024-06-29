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
  scene: [StartScene],
};

window.phaserGame = new Phaser.Game(config);
