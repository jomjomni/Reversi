class Piece {
  WHITE_PIECE = 25
  BLACK_PIECE = 24

  current_color: number;
  current_pointX: number;
  current_pointY: number;

  constructor(pointX: number, pointY: number){
    this.current_color = -1;
    this.current_pointX = pointX
    this.current_pointY = pointY
  }

  put(from_player: string){
    if(from_player == "white"){
      this.current_color = this.WHITE_PIECE;
    }else{
      this.current_color = this.BLACK_PIECE;
    }
  }

  putPlayerColor(from_player: string): number{
    if(from_player == "white"){
      return this.WHITE_PIECE;
    }else{
      return this.BLACK_PIECE;
    }

  }

  reverse(){
    if(this.current_color == this.WHITE_PIECE){
      this.current_color = this.BLACK_PIECE;
    }else{
      this.current_color = this.BLACK_PIECE;
    }
  }
}
export default Piece;