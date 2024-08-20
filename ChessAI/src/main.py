import pygame

from const import *
from game import Game
from move import Move


def main():
  pygame.init()
  screen = pygame.display.set_mode((WIDTH, HEIGHT))
  clock = pygame.time.Clock()
  game = Game()
  board = game.board
  ai = game.ai
  drag = game.drag
  squares = board.squares
  game_over = False
  started = False
  clicked_square = None
  running = True
  flip = False

  player_one = False
  player_two = False

  while running:

    human = player_one and board.player == "white" or player_two and board.player == "black"

    game.draw_game(screen, clicked_square, human, flip)

    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        pygame.quit()
        running = False
      elif event.type == pygame.MOUSEBUTTONDOWN and not game_over:
        drag.update_mouse(event.pos)

        clicked_row = drag.mouse_y // SQ_SIZE
        clicked_col = drag.mouse_x  // SQ_SIZE

        if flip:
          clicked_row = ROWS - 1 - clicked_row
          clicked_col = COLS - 1 - clicked_col

        clicked_square = squares[clicked_row][clicked_col]

        if clicked_square.has_team_piece(board.player) and human:
          piece = clicked_square.piece

          drag.save_initial(event.pos)
          drag.drag_piece(piece)

          game.draw_game(screen, clicked_square, human, flip)
        
  
      
      elif event.type == pygame.MOUSEMOTION:
        game.set_hover(event.pos)

        if drag.dragging:
          drag.update_mouse(event.pos)

          game.draw_game(screen, clicked_square, human, flip)

      elif event.type == pygame.MOUSEBUTTONUP and not game_over:
        if drag.dragging:
          drag.update_mouse(event.pos)

          release_row = drag.mouse_y // SQ_SIZE
          release_col = drag.mouse_x // SQ_SIZE

          if flip:
            release_row = ROWS - 1 - release_row
            release_col = COLS - 1 - release_col

          if not board.in_range(release_row, release_col):
            drag.undrag_piece()
            continue

          release_sqaure = squares[release_row][release_col]

          if release_sqaure != clicked_square and human:
            move = Move(clicked_square, release_sqaure, clicked_square.piece, release_sqaure.piece)

            if board.is_valid(move):
              capture = board.make_move(move)
              game.play_sound(capture)
              started = True
              clicked_square = None
              if player_one and player_two:
                flip = not flip


        drag.undrag_piece()
        game.draw_game(screen, clicked_square, human, flip)

      elif event.type == pygame.KEYDOWN:

        if event.key == pygame.K_t:
          game.change_theme()

        elif event.key == pygame.K_r:
          game.restart()
          board = game.board
          drag = game.drag
          squares = board.squares
          game_over = False
          started = False
          clicked_square = None
          flip = False
          ai = game.ai

        elif event.key == pygame.K_z and started:
          capture = board.undo_move()
          clicked_square = None
          if player_one and player_two:
            flip = not flip
          game.play_sound(capture)




    if board.checkmate:
      text = "white wins by checkmate" if board.player == "black" else "black wins by checkmate"
      game.draw_final_text(screen, text)
      game_over = True
    
    elif board.stalemate:
      game.draw_final_text(screen, "game drawn by stalemate")
      game_over = True

    if not game_over and not human:
      ai_move = ai.best_move()
      board.make_move(ai_move)
      game.animate_move(screen, clock, ai_move, flip)
      capture = ai_move.captured is not None or ai_move.en_passant
      started = True
      game.play_sound(capture)
      if player_one and player_two:
        flip = not flip

    pygame.display.update()
  
  pygame.quit()




if __name__ == "__main__":
  main()

  


    