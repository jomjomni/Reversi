import Phaser from "phaser";
import Piece from "../classes/piece";

class reversiGame extends Phaser.Scene {
  public pieceLayer!: Phaser.Tilemaps.TilemapLayer;
  board!: Piece[][];
  WHITE_PLAYER = "white";
  BLACK_PLAYER = "black";
  putPlayer = this.WHITE_PLAYER;
  TITLE = "Reversi"
  turnPlayer!: Phaser.GameObjects.Text;
  guiWidth: number | undefined;
  guiWhitePieceNumber!: Phaser.GameObjects.Text;
  guiBlackPieceNumber!: Phaser.GameObjects.Text;
  whitePieceNumber = 0
  blackPieceNumber = 0
  guiGameEndText!: Phaser.GameObjects.Text;

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
    const platforms = map.createLayer("layer0", tileset, 0, 0);
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

    this.boardInitialize()
    this.pieceInitialize();

    this.guiWidth = platforms.width * platforms.scaleX
    this.add.text(this.guiWidth + 10, 10, this.TITLE, {font: '30px Arial'})
    this.turnPlayer = this.add.text(this.guiWidth + 10, 50, `This turn: ${this.putPlayer}`, {font: '30px Arial'})

    this.guiWhitePieceNumber = this.add.text(this.guiWidth + 10, 100, `White Pieces: ${this.whitePieceNumber}`, {font: '30px Arial'})
    this.guiBlackPieceNumber = this.add.text(this.guiWidth + 10, 150, `Black Pieces: ${this.blackPieceNumber}`, {font: '30px Arial'})
    this.countPiece()

    const button = this.add.rectangle(this.guiWidth + 150, 425, 100, 50, 0xffffff)
    this.add.text(this.guiWidth + 110, 410, `Reset`, {font: '30px Arial', color: '#000'})

    this.guiGameEndText = this.add.text(this.guiWidth + 10, 300, ``, {font: '30px Arial'})
  }

  resetGame() {
    for(let i = 0; i < this.board.length; i++){
      for(let j = 0; j < this.board.at(i)?.length; j++){
        this.pieceLayer.removeTileAt(i + 2, j + 2)
      }
    }
    this.boardInitialize()
    this.pieceInitialize()
    this.countPiece()
    this.putPlayer = this.WHITE_PLAYER
    this.turnPlayer.setText(`This turn: ${this.putPlayer}`)
    this.guiGameEndText.setText('')

  }

  boardInitialize() {
    this.board = []
    for(let i = 0; i < 6; i++){
      const boardX = []
      for(let j = 0; j < 6; j++){
        boardX.push(new Piece(i, j))
      }
      this.board.push(boardX)
    }
  }

  countPiece() {
    this.whitePieceNumber = 0
    this.blackPieceNumber = 0

    for(let i = 0; i < this.board.length; i++){
      for(let j = 0; j < this.board.at(i)?.length; j++){
        const piece = this.board.at(i)?.at(j)
        if(piece?.current_color == piece?.WHITE_PIECE){
          this.whitePieceNumber++
        }else if(piece?.current_color == piece?.BLACK_PIECE){
          this.blackPieceNumber++
        }
      }
    }

    this.guiWhitePieceNumber.setText(`White Pieces: ${this.whitePieceNumber}`)
    this.guiBlackPieceNumber.setText(`Black Pieces: ${this.blackPieceNumber}`)
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
    if(this.isSkip(this.putPlayer)){
      this.putPlayer = this.changePlayer(this.putPlayer)
      this.turnPlayer.setText(`This turn: ${this.putPlayer}(Skip)`)

      if(this.isSkip(this.putPlayer)){
        this.turnPlayer.setText(`Game is End.`)
        this.gameEnd()
      }
    }

    const worldPoint = this.input.activePointer.positionToCamera(
      this.cameras.main
    );

    if (this.input.manager.activePointer.isDown) {
      if(worldPoint.x >= this.guiWidth + 90 && worldPoint.x <= this.guiWidth + 200 && worldPoint.y >= 400 && worldPoint.y <= 450){
        this.resetGame()
        return
      }
      const pointX = Math.ceil(worldPoint.x / 48) - 1;
      const pointY = Math.ceil(worldPoint.y / 48) - 1;

      if (pointX >= 2 && pointX <= 7 && pointY >= 2 && pointY <= 7) {
        const targetPiece = this.board.at(pointX - 2).at(pointY - 2);

        if (targetPiece?.current_color == -1 && this.checkReverse(targetPiece.putPlayerColor(this.putPlayer), pointX - 2, pointY - 2, true)) {
          targetPiece.put(this.putPlayer);
          this.putPiece(this.putPlayer, pointX, pointY);
          this.putPlayer = this.changePlayer(this.putPlayer);
          this.turnPlayer.setText(`This turn: ${this.putPlayer}`)

          this.countPiece()
        }
      }
    }
  }

  checkReverse(putColor: number, pointX: number, pointY: number, realFlip: boolean): boolean {
    let flip = false
    flip = this.flipPiece(putColor, pointX, pointY, -1, -1, realFlip) || flip
    flip = this.flipPiece(putColor, pointX, pointY, 0, -1, realFlip) || flip
    flip = this.flipPiece(putColor, pointX, pointY, 1, -1, realFlip) || flip
    flip = this.flipPiece(putColor, pointX, pointY, -1, 0, realFlip) || flip
    flip = this.flipPiece(putColor, pointX, pointY, 1, 0, realFlip) || flip
    flip = this.flipPiece(putColor, pointX, pointY, -1, 1, realFlip) || flip
    flip = this.flipPiece(putColor, pointX, pointY, 0, 1, realFlip) || flip
    flip = this.flipPiece(putColor, pointX, pointY, 1, 1, realFlip) || flip
    return flip
  }

  flipPiece(current_color: number, pointX: number, pointY: number, vectorX: number, vectorY: number, realFlip: boolean): boolean {
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
            if(realFlip){
              for(let j = 0; j < flipPieces.length; j++){
                this.putPiece(this.putPlayer, flipPieces[j]?.current_pointX + 2, flipPieces[j]?.current_pointY + 2)
              }
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

  gameEnd(): void {
    this.countPiece()
    let winner = ""
    if(this.whitePieceNumber == this.blackPieceNumber){
      this.guiGameEndText.setText(`Tie Game!`)
      return
    }

    if(this.whitePieceNumber > this.blackPieceNumber){
      winner = "White"
    }else{
      winner = "Black"
    }
    this.guiGameEndText.setText(`${winner} is Winner!`)
  }

  isSkip(putPlayer: string): boolean {
    let resultSkip = true
    for(let i = 0; i < this.board.length; i++){
      for(let j = 0; j < this.board.at(i)?.length; j++){
        const piece = this.board.at(i)?.at(j)

        if(piece?.current_color == -1 && this.checkReverse(piece.putPlayerColor(putPlayer), i, j, false)){
          return false
        }
      }
    }
    return resultSkip
  }
}

export default reversiGame;

