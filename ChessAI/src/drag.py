from const import *

class Drag:

  def __init__(self) -> None:
    self.mouse_x = 0
    self.mouse_y = 0
    self.initial_row = 0
    self.initial_col = 0
    self.piece = None
    self.dragging = False

  def update_mouse(self, pos):
    self.mouse_x, self.mouse_y = pos

  def save_initial(self, pos):
    self.initial_row = pos[1] // SQ_SIZE
    self.initial_col = pos[0] // SQ_SIZE

  def drag_piece(self, piece):
    self.piece = piece
    self.dragging = True

  def undrag_piece(self):
    self.piece = None
    self.dragging = False

  def draw(self, surface):
    image = self.piece.drag_image
    center = (self.mouse_x, self.mouse_y)
    rect = image.get_rect(center = center)

    surface.blit(image, rect)