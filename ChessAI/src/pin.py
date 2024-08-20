

class Pin:

  def __init__(self, square, dir) -> None:
    self.square = square
    self.dir = dir

  def __eq__(self, other) -> bool:
    return self.square == other.square and self.dir == other.dir
  