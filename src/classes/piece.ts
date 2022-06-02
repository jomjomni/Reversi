import Phaser from "phaser";

class Piece {
  WHITE_PIECE = 25
  BLACK_PIECE = 24

  current_color: number;

  constructor(){
    this.current_color = -1;
  }

  put(from_player: string){
    if(from_player == "white"){
      this.current_color = this.WHITE_PIECE;
    }else{
      this.current_color = this.BLACK_PIECE;
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