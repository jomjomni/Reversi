import Phaser from "phaser";
import Piece from "../classes/piece";

class reversiGame extends Phaser.Scene {
  public pieceLayer!: Phaser.Tilemaps.TilemapLayer;
  board: Piece[][] = [
    [
      new Piece(0, 0),
      new Piece(0, 1),
      new Piece(0, 2),
      new Piece(0, 3),
      new Piece(0, 4),
      new Piece(0, 5),
    ],
    [
      new Piece(1, 0),
      new Piece(1, 1),
      new Piece(1, 2),
      new Piece(1, 3),
      new Piece(1, 4),
      new Piece(1, 5),
    ],
    [
      new Piece(2, 0),
      new Piece(2, 1),
      new Piece(2, 2),
      new Piece(2, 3),
      new Piece(2, 4),
      new Piece(2, 5),
    ],
    [
      new Piece(3, 0),
      new Piece(3, 1),
      new Piece(3, 2),
      new Piece(3, 3),
      new Piece(3, 4),
      new Piece(3, 5),
    ],
    [
      new Piece(4, 0),
      new Piece(4, 1),
      new Piece(4, 2),
      new Piece(4, 3),
      new Piece(4, 4),
      new Piece(4, 5),
    ],
    [
      new Piece(5, 0),
      new Piece(5, 1),
      new Piece(5, 2),
      new Piece(5, 3),
      new Piece(5, 4),
      new Piece(5, 5),
    ],
  ];
  WHITE_PLAYER = "white";
  BLACK_PLAYER = "black";
  putPlayer = this.WHITE_PLAYER;

  constructor() {
    super({ key: "reversiGame" });
  }

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

    this.pieceInitialize();
  }
  pieceInitialize() {
    this.putPiece(this.WHITE_PLAYER, 4, 4);
    this.putPiece(this.WHITE_PLAYER, 5, 5);
    this.putPiece(this.BLACK_PLAYER, 4, 5);
    this.putPiece(this.BLACK_PLAYER, 5, 4);
  }

  putPiece(player: string, vartical: number, horizontal: number): void {
    if (vartical < 2 || vartical > 7 || horizontal < 2 || horizontal > 7) {
      return;
    }
    const piece = this.board.at(vartical - 2).at(horizontal - 2);
    piece?.put(player);

    this.pieceLayer.putTileAt(piece?.current_color, vartical, horizontal);
  }

  update() {
    const worldPoint = this.input.activePointer.positionToCamera(
      this.cameras.main
    );

    if (this.input.manager.activePointer.isDown) {
      const pointX = Math.ceil(worldPoint.x / 48) - 1;
      const pointY = Math.ceil(worldPoint.y / 48) - 1;

      if (pointX >= 2 && pointX <= 7 && pointY >= 2 && pointY <= 7) {
        const targetPiece = this.board.at(pointX - 2).at(pointY - 2);

        if (targetPiece?.current_color == -1 && this.checkReverse(targetPiece.putPlayerColor(this.putPlayer), pointX - 2, pointY - 2)) {
          targetPiece.put(this.putPlayer);
          this.putPiece(this.putPlayer, pointX, pointY);
          this.putPlayer = this.changePlayer(this.putPlayer);
        }
      }
    }
  }
  checkReverse(putColor: number, pointX: number, pointY: number): boolean {
    let flip = false
    flip = this.flipPiece(putColor, pointX, pointY, -1, -1) || flip
    flip = this.flipPiece(putColor, pointX, pointY, 0, -1) || flip
    flip = this.flipPiece(putColor, pointX, pointY, 1, -1) || flip
    flip = this.flipPiece(putColor, pointX, pointY, -1, 0) || flip
    flip = this.flipPiece(putColor, pointX, pointY, 1, 0) || flip
    flip = this.flipPiece(putColor, pointX, pointY, -1, 1) || flip
    flip = this.flipPiece(putColor, pointX, pointY, 0, 1) || flip
    flip = this.flipPiece(putColor, pointX, pointY, 1, 1) || flip
    return flip
  }

  flipPiece(current_color: number, pointX: number, pointY: number, vectorX: number, vectorY: number): boolean {
    const targetPieces = []
    const flipPieces = []
    let positionX = pointX + vectorX
    let positionY = pointY + vectorY
    while(positionX >= 0 && positionX <= 5 && positionY >= 0 && positionY <= 5){
      targetPieces.push(this.board.at(positionX).at(positionY))
      positionX = positionX + vectorX
      positionY = positionY + vectorY
    }

    if(targetPieces.length >= 2){
      if(targetPieces[0]?.current_color == -1){
        return false
      }
      for(let i = 0; i < targetPieces.length; i++){
        if(targetPieces[i]?.current_color != current_color){
          flipPieces.push(targetPieces[i])
        }else if(targetPieces[i]?.current_color == current_color || targetPieces[i]?.current_color == -1){
          if(flipPieces.length != 0){
            for(let j = 0; j < flipPieces.length; j++){
              this.putPiece(this.putPlayer, flipPieces[j]?.current_pointX + 2, flipPieces[j]?.current_pointY + 2)
            }
            return true
          }else{
            return false
          }
        }
      }
    }
    return false
  }

  changePlayer(putPlayer: string): string {
    if (putPlayer == this.WHITE_PLAYER) {
      return this.BLACK_PLAYER;
    } else {
      return this.WHITE_PLAYER;
    }
  }
}
export default reversiGame;

