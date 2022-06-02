import Phaser from "phaser";
import reversiGame from "./scenes/reversiGame";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  scene: [reversiGame]
};

const reversi = new Phaser.Game(config);