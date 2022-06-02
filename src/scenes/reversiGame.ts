import Phaser from "phaser";

class reversiGame extends Phaser.Scene {
  public pieceLayer!: Phaser.Tilemaps.TilemapLayer;

  preload() {
    this.load.image("tileset", "assets/tilemaps/tiles/tileset.png");
    this.load.image("piece", "assets/tilemaps/tiles/piece.png");

    this.load.tilemapTiledJSON(
      "background",
      "assets/tilemaps/json/reversiBG.json"
    );
  }

  create() {
    const map = this.make.tilemap({ key: "background" });
    const tileset = map.addTilesetImage("background", "tileset");
    const platforms = map.createLayer("layser0", tileset, 0, 0);
    platforms.setScale(6, 6);
    platforms.depth = -1;

    const piecemap = this.make.tilemap({
      width: 96,
      height: 96,
      tileWidth: 16,
      tileHeight: 16,
    });
    const tiles = piecemap.addTilesetImage("piece", "piece", 16, 16);
    this.pieceLayer = piecemap.createBlankLayer("ground", tiles);
    this.pieceLayer.setScale(3, 3);
    this.pieceLayer.depth = 1;

    this.pieceClear();
  }

  pieceClear() {
    this.pieceLayer.putTileAt(24, 4, 4);
    this.pieceLayer.putTileAt(24, 5, 5);
    this.pieceLayer.putTileAt(25, 4, 5);
    this.pieceLayer.putTileAt(25, 5, 4);
  }

  update() {
    const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    if (this.input.manager.activePointer.isDown) {
      const pointX = Math.ceil(worldPoint.x / 48)- 1
      const pointY = Math.ceil(worldPoint.y / 48)- 1

      if(pointX >= 2 && pointX <= 7 && pointY >= 2 && pointY <= 7)
      this.pieceLayer.putTileAt(25, pointX, pointY);
    }
  }
}
export default reversiGame;
