import random

from board import Board
from move import Move
from piece import Piece
from const import *



class AI:

  def __init__(self, board: Board) -> None:
    self.board = board
    self.score = 0
    self.max_depth = 4


  def random_move(self) -> Move:
    num = random.randint(0, len(self.board.moves) - 1)
    return self.board.moves[num]
  
  # def best_move(self) -> Move:
  #   moves = self.board.moves
  #   board = self.board

  #   random.shuffle(moves)

  #   turn = 1 if board.player == "white" else -1

  #   best_move = None
  #   min_max_score = CHECKMATE

  #   for player_move in moves:
  #     board.make_move(player_move)
      
  #     rival_moves = board.moves
  #     max_score = -CHECKMATE

  #     if board.checkmate:
  #       max_score = -CHECKMATE
  #     elif board.stalemate:
  #       max_score = STALEMATE
  #     else:
  #       for rival_move in rival_moves:
  #         board.make_move(rival_move)

  #         if board.checkmate:
  #           score = -turn * CHECKMATE
  #         elif board.stalemate:
  #           score = 0
  #         else:
  #           score = -turn * board.material_score 

  #         if score > max_score:
  #           max_score = score

  #         board.undo_move()
      
  #     if max_score < min_max_score:
  #       min_max_score = max_score
  #       best_move = player_move

  #     board.undo_move()

  #   if best_move is None:
  #     return self.random_move()
    

  #   return best_move
  

  def best_move(self):
    turn_multipler = 1 if self.board.player == "white" else -1
    random.shuffle(self.board.moves)
    score, best_move = self.nega_max(self.max_depth, turn_multipler, -CHECKMATE, CHECKMATE)
    if best_move is None:
      best_move = self.random_move()
    return best_move
  

  # def min_max(self, depth, player):
  #   global best_move

  #   if depth == 0:
  #     return self.score_fn()
    
  #   board = self.board
  #   valid_moves = board.moves
  #   if player:
  #     max_score = -CHECKMATE
  #     for move in valid_moves:
  #       board.make_move(move)
  #       score = self.min_max(depth - 1, not player)
  #       if score > max_score:
  #         max_score = score
  #         if depth == MAX_DEPTH:
  #           best_move = move
  #       board.undo_move()

  #     return max_score

  #   else:
  #     min_score = CHECKMATE
  #     for move in valid_moves:
  #       board.make_move(move)
  #       score = self.min_max(depth - 1, not player)
  #       if score < min_score:
  #         min_score = score
  #         if depth == MAX_DEPTH:
  #           best_move = move
  #       board.undo_move()
      
  #     return min_score


  def nega_max(self, depth, turn_multiplier, alpha, beta):
    if depth == 0:
      return turn_multiplier * self.score_fn(), None
    
    valid_moves = self.board.moves
    max_score = -CHECKMATE
    best_move = None
    for move in valid_moves:
      self.board.make_move(move)
      score, next_move = self.nega_max(depth - 1, -turn_multiplier, -beta, -alpha)
      score = -score
      if score > max_score:
        max_score = score
        if depth == self.max_depth:
          best_move = move


      self.board.undo_move()

      if max_score > alpha:
        alpha = max_score

      if alpha >= beta:
        break

    return max_score, best_move

  def score_fn(self):
    board = self.board
    if board.checkmate:
      if board.player == "white":
        return -CHECKMATE
      else:
        return CHECKMATE
    elif board.stalemate:
      return STALEMATE
    else:
      return self.board.material_score

  


  def material_score(self):
    score = 0
    for row in range(ROWS):
      for col in range(COLS):
        square = self.board.squares[row][col]
        if square.has_piece():
          piece_name = square.piece.color + " " + square.piece.name
          piece_score = PIECE_SCORES[piece_name][row][col]
          if square.piece.color == "white":
            score += (square.piece.value + piece_score)
          else:
            score -= (square.piece.value + piece_score)
    return score
  



    