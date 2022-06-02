import Phaser from "phaser";
import reverseGame from "./scenes/reverseGame";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  scene: [reverseGame]
};

const reverse = new Phaser.Game(config);