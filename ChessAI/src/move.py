from square import Square
from piece import *

class Move:

  def __init__(self, initial: Square, final: Square, piece: Piece, captured=None) -> None:
    self.initial = initial
    self.final = final
    self.piece = piece
    self.captured = final.piece

    self.promotion = False
    self.en_passant = False
    if isinstance(piece, Pawn):
      if (final.row == 0 and piece.color == "white") or (final.row == 7 and piece.color == "black"):
        self.promotion = True
      elif abs(final.col - initial.col) == 1 and captured is None:
        self.en_passant = True

    self.queen_castle = False
    self.king_castle = False
    if isinstance(piece, King):
      if final.col - initial.col == 2:
        self.king_castle = True
      elif final.col - initial.col == -2:
        self.queen_castle = True

    self.first = False if piece.moved else True

  def notation(self):
    capture = 'x' if self.captured is not None else ''
    return self.piece.notation() + capture + self.final.notation()
  
  def __eq__(self, other) -> bool:
    return self.initial == other.initial and self.final == other.final
  
  def __str__(self) -> str:
    return "(" + self.initial.__str__() + "), (" + self.final.__str__() + ")"
  
  def __repr__(self) -> str:
    return self.__str__()