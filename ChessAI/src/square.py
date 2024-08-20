from const import *

class Square:

  def __init__(self, row, col, piece=None) -> None:
    self.row = row
    self.col = col
    self.piece = piece

  def add_piece(self, piece):
    self.piece = piece
  
  def remove_piece(self):
    self.piece = None

  def has_piece(self):
    return self.piece is not None
  
  def is_empty(self):
    return self.piece is None
  
  def has_enemy_piece(self, color):
    return self.piece is not None and self.piece.color != color
  
  def has_team_piece(self, color):
    return self.has_piece() and self.piece.color == color

  def is_empty_or_has_enemy(self, color):
    return self.is_empty() or self.has_enemy_piece(color)

  def notation(self):
    return f'{ALPHA_COLS[self.col]}{self.row + 1}'
  
  def __eq__(self, other) -> bool:
    return self.row == other.row and self.col == other.col
  
  def __str__(self) -> str:
    return f'{self.row}, {self.col}'
  
  def __repr__(self) -> str:
    return self.__str__()

