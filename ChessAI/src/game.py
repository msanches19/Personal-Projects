import pygame

from board import Board
from layout import Layout
from drag import Drag
from const import *
from ai import AI
from move import Move



class Game:
  
  def __init__(self) -> None:
    self.board = Board()
    self.ai = AI(self.board)
    self.layout = Layout()
    self.drag = Drag()
    self.hover_square = None
    self.moved_piece = None
    self.captured_piece = None


  def draw_bg(self, surface) -> None:
    theme = self.layout.theme

    for row in range(ROWS):
      for col in range(COLS):
        color = theme.bg.light if (row + col) % 2 == 0 else theme.bg.dark
        sq = (col * SQ_SIZE, row * SQ_SIZE, SQ_SIZE, SQ_SIZE)
        pygame.draw.rect(surface, color, sq)

        if col == 0:
          color = theme.bg.dark if row % 2 == 0 else theme.bg.light
          label = self.layout.index_font.render(str(ROWS-row), 1, color)
          pos = (5, 5 + row * SQ_SIZE)
          surface.blit(label, pos)

        if row == 7:
            color = theme.bg.dark if (row + col) % 2 == 0 else theme.bg.light
            label = self.layout.index_font.render(ALPHA_COLS[col], 1, color)
            pos = (col * SQ_SIZE + SQ_SIZE - 20, HEIGHT - 20)
            surface.blit(label, pos)

  def draw_pieces(self, surface, flip):

    for row in range(ROWS):
      for col in range(COLS):
        draw_row = ROWS - 1 - row if flip else row
        draw_col = COLS - 1 - col if flip else col
        sq = self.board.squares[draw_row][draw_col]
        if sq.has_piece():
          piece = sq.piece
          if piece is not self.drag.piece and piece is not self.moved_piece:
            image = piece.image
            center = col * SQ_SIZE + SQ_SIZE / 2, row * SQ_SIZE + SQ_SIZE / 2
            rect = image.get_rect(center = center)
            surface.blit(image, rect)
          elif piece is self.moved_piece and self.captured_piece is not None:
            image = self.captured_piece.image
            center = col * SQ_SIZE + SQ_SIZE / 2, row * SQ_SIZE + SQ_SIZE / 2
            rect = image.get_rect(center = center)
            surface.blit(image, rect)

  def draw_moves(self, surface, piece, flip) -> None:
    theme = self.layout.theme

    if piece is not None and piece.color == self.board.player:
      for move in piece.moves:
        final_col = COLS - 1 - move.final.col if flip else move.final.col
        final_row = ROWS - 1 - move.final.row if flip else move.final.row
        color = theme.moves.light if (final_row + final_col) % 2 == 0 else theme.moves.dark
        square = (final_col * SQ_SIZE, final_row * SQ_SIZE, SQ_SIZE, SQ_SIZE)
        pygame.draw.rect(surface, color, square)

  def draw_last_move(self, surface, flip) -> None:
    theme = self.layout.theme

    if self.board.last_move:
      move = self.board.last_move
      initial = move.initial
      final = move.final
      for pos in (initial, final):
        pos_row = ROWS - 1 - pos.row if flip else pos.row
        pos_col = COLS - 1 - pos.col if flip else pos.col
        color = theme.trace.light if (pos_row + pos_col) % 2 == 0 else theme.trace.dark
        square = (pos_col * SQ_SIZE, pos_row * SQ_SIZE, SQ_SIZE, SQ_SIZE)
        pygame.draw.rect(surface, color, square)

  def draw_hover(self, surface):
    if self.hover_square is not None:
      color = (180, 180, 180)
      square = (self.hover_square.col * SQ_SIZE, self.hover_square.row * SQ_SIZE, SQ_SIZE, SQ_SIZE)
      pygame.draw.rect(surface, color, square, width=4)

  def highlight_square(self, surface, square, flip):
    if square is not None:
      col = COLS - square.col - 1 if flip else square.col
      row = ROWS - square.row - 1 if flip else square.row
      color = self.layout.theme.highlight
      square = (col * SQ_SIZE, row * SQ_SIZE, SQ_SIZE, SQ_SIZE)
      pygame.draw.rect(surface, color, square, width=6)

  def draw_final_text(self, surface, text):
    font = self.layout.font
    message = font.render(text, False, self.layout.theme.font)
    location = pygame.Rect(0, 0, WIDTH, HEIGHT).move(WIDTH / 2 - message.get_width() / 2, HEIGHT / 2 - message.get_height() / 2)
    surface.blit(message, location)


  def set_hover(self, pos):
    col, row = pos
    if 0 <= col < WIDTH and 0 <= row < HEIGHT:
      self.hover_square = self.board.squares[row // SQ_SIZE][col // SQ_SIZE]
    else:
      self.hover_square = None

  def change_theme(self):
    self.layout.change_theme()
  
  def restart(self):
    self.__init__()

  def play_sound(self, captured):
    if captured:
      self.layout.capture_sound.play()
    else:
      self.layout.move_sound.play()

  def draw_game(self, screen, square, human, flip):
    piece = square.piece if square is not None else None
    self.draw_bg(screen)
    self.draw_last_move(screen, flip)
    if human:
      self.draw_moves(screen, piece, flip)
    self.draw_pieces(screen, flip)
    self.draw_hover(screen)
    self.highlight_square(screen, square, flip)
    if self.drag.dragging:
      self.drag.draw(screen)
  
  def animate_move(self, screen, clock, move: Move, flip):
    start_row = move.initial.row
    start_col = move.initial.col
    col_diff = move.final.col - start_col
    row_diff = move.final.row - start_row
    frames_per_square = 10
    frame_count = (abs(col_diff) + abs(row_diff)) * frames_per_square
    self.moved_piece = move.piece
    self.captured_piece = move.captured
    if move.en_passant:
      self.captured_piece = self.board.squares[move.final.row - move.piece.dir][move.final.col].piece
    for frame in range(frame_count + 1):
      row, col = start_row + row_diff * frame / frame_count, start_col + col_diff * frame / frame_count
      self.draw_bg(screen)
      self.draw_pieces(screen, flip)

      image = move.piece.image
      center_x = col * SQ_SIZE + SQ_SIZE / 2
      center_y = row * SQ_SIZE + SQ_SIZE / 2
      rect = image.get_rect(center=(center_x, center_y))
      screen.blit(image, rect)

      pygame.display.update()
      clock.tick(60)
    
    self.moved_piece = None
    self.captured_piece = None

    self.draw_bg(screen)
    self.draw_pieces(screen, flip)



