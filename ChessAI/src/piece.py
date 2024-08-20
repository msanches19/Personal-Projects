import os
import pygame
from abc import abstractmethod

class Piece:

  def __init__(self, color, name) -> None:
    self.color = color
    self.name = name
    self.image = self.set_image()
    self.drag_image = self.set_image(size=128)
    self.moved = False
    self.moves = []
    self.last = None
    self.captured = []
  
  def set_image(self, size=80):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(current_dir, '..', 'assets')
    image_path = os.path.join(
      assets_dir,
      'images',
      f'imgs-{size}px',
      f'{self.color}_{self.name}.png'
    )
    return pygame.image.load(image_path)
  
  @abstractmethod
  def notation(self):
    pass

  def set_moves(self, moves):
    self.moves = moves

  def clear_moves(self):
    self.moves.clear()

  def set_last_move(self, move):
    self.last = move

  def is_ally(self, color):
    return self.color == color

  def is_enemy(self, color):
    return self.color != color
  
  def __str__(self) -> str:
    return self.color + " " + self.name
  
  def __repr__(self) -> str:
    return self.color + " " + self.name
  
  def __eq__(self, other: object) -> bool:
    return other.name == self.name

class Pawn(Piece):
  def __init__(self, color) -> None:
    super().__init__(color, "pawn")
    self.dir = -1 if color == "white" else 1
    self.value = 1
  
  def notation(self):
    return ''


class Knight(Piece):
  def __init__(self, color) -> None:
    super().__init__(color, "knight")
    self.value = 3

  def notation(self):
    return 'N'


class Bishop(Piece):
  def __init__(self, color) -> None:
    super().__init__(color, "bishop")
    self.value = 3
  
  def notation(self):
    return 'B'
  

class Rook(Piece):
  def __init__(self, color) -> None:
    super().__init__(color, "rook")
    self.value = 5

  def notation(self):
    return 'R'


class Queen(Piece):
  def __init__(self, color, promotion=False) -> None:
    super().__init__(color, "queen")
    self.value = 9
    self.promotion = promotion
  
  def notation(self):
    return 'Q'


class King(Piece):
  def __init__(self, color) -> None:
    super().__init__(color, "king")
    self.value = 1000

  def notation(self):
    return 'K'

