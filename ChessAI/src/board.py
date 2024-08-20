from const import *
from square import Square
from move import Move
from piece import *
from pin import Pin
from check import Check

class Board:

  def __init__(self) -> None:
    self.squares = [[Square(row, col) for col in range(COLS)] for row in range(ROWS)]  # 2d array representation of board
    self._add_pieces("white")
    self._add_pieces("black")
    self.white_piece_squares = [self.squares[row][col] for row in range(6, ROWS) for col in range(COLS)]  # Squares containing a white piece
    self.black_piece_squares = [self.squares[row][col] for row in range(2) for col in range(COLS)]  # Squares containing a black piece
    self.move_log = []  # List of moves made
    self.player = "white"  # Current player. Either white or black
    self.last_move = None  # Last move made
    self.white_king_square = self.squares[7][4]  # White king's current square
    self.black_king_square = self.squares[0][4]  # Black king's current square
    self.in_check = False  # Whether current player is in check
    self.checks = []  # List of checks against current player
    self.pins = []  # List of current player's pinned pieces
    self.en_passant = [None]
    self.moves = []  # List of current player's valid moves
    self.checkmate = False  # Whether current player is in checkmate
    self.stalemate = False  # Whether game is in stalemate 
    self.material_score = 0

    self.valid_moves()

    

  def _add_pieces(self, color) -> None:
    pawn_row, piece_row = (6, 7) if color == "white" else (1, 0)

    # add pawns
    for col in range(COLS):
      self.squares[pawn_row][col].add_piece(Pawn(color))
    

    # add rooks
    self.squares[piece_row][0].add_piece(Rook(color))
    self.squares[piece_row][7].add_piece(Rook(color))

    # add knights
    self.squares[piece_row][1].add_piece(Knight(color))
    self.squares[piece_row][6].add_piece(Knight(color))

    # add bishops
    self.squares[piece_row][2].add_piece(Bishop(color))
    self.squares[piece_row][5].add_piece(Bishop(color))

    # add queen
    self.squares[piece_row][3].add_piece(Queen(color))

    # add king
    self.squares[piece_row][4].add_piece(King(color))

  def make_move(self, move: Move):
    initial = move.initial
    final = move.final

    piece = move.piece
    if isinstance(piece, King):
      if self.player == "white":
        self.white_king_square = final
      else:
        self.black_king_square = final

    
    if self.player == "white":
      piece_squares = self.white_piece_squares
      rival_squares = self.black_piece_squares

      self.material_score -= PIECE_SCORES[piece.__str__()][initial.row][initial.col]
      self.material_score += PIECE_SCORES[piece.__str__()][final.row][final.col]
    else:
      piece_squares = self.black_piece_squares
      rival_squares = self.white_piece_squares

      self.material_score += PIECE_SCORES[piece.__str__()][initial.row][initial.col]
      self.material_score -= PIECE_SCORES[piece.__str__()][final.row][final.col]

    initial.remove_piece()  

    piece_squares.remove(initial)
    piece_squares.append(final)

    

    if move.captured:
      rival_squares.remove(final)
      piece.captured.append(move.captured)
      if self.player == "white":
        self.material_score += (move.captured.value + PIECE_SCORES[move.captured.__str__()][final.row][final.col])
      else:
        self.material_score -= (move.captured.value + PIECE_SCORES[move.captured.__str__()][final.row][final.col])

    if move.promotion:
      self.squares[final.row][final.col].add_piece(Queen(piece.color, promotion=True))
      if self.player == "white":
        self.material_score += (8 + PIECE_SCORES["white queen"][final.row][final.col])
      else:
        self.material_score -= (8 + PIECE_SCORES["black queen"][final.row][final.col])
    elif move.en_passant:
      piece.captured.append(self.en_passant[-1][1].piece)

      rival_squares.remove(self.en_passant[-1][1])

      if self.player == "white":
        self.material_score += (1 + PIECE_SCORES["black pawn"][final.row + 1][final.col])
      else:
        self.material_score -= (1 + PIECE_SCORES["white pawn"][final.row - 1][final.col])

      self.squares[final.row][final.col].add_piece(piece)
      self.en_passant[-1][1].remove_piece()

    elif move.king_castle:
      self.squares[final.row][final.col].add_piece(piece)
      self.squares[final.row][5].add_piece(self.squares[final.row][7].piece)
      self.squares[final.row][7].remove_piece()

      piece_squares.append(self.squares[final.row][5])
      piece_squares.remove(self.squares[final.row][7])
    elif move.queen_castle:
      self.squares[final.row][final.col].add_piece(piece)
      self.squares[final.row][3].add_piece(self.squares[final.row][0].piece)
      self.squares[final.row][0].remove_piece()

      piece_squares.append(self.squares[final.row][3])
      piece_squares.remove(self.squares[final.row][0])
    else:
      self.squares[final.row][final.col].add_piece(piece)

    if isinstance(piece, Pawn) and abs(initial.row - final.row) == 2:
      en_passant_row = initial.row + piece.dir
      self.en_passant.append((self.squares[en_passant_row][initial.col], final))
    else:
      self.en_passant.append(None)


    piece.moved = True
    piece.clear_moves()
    piece.set_last_move(move)
    self.last_move = move
    self.move_log.append(move)

    self.next_turn()

    self.valid_moves()

    return move.captured or move.en_passant

  def valid_moves(self):
    self.moves = []

    squares = self.squares
    color = self.player
    
    king_square = self.white_king_square if color == "white" else self.black_king_square
    piece_squares = self.white_piece_squares if color == "white" else self.black_piece_squares
    self.in_check, self.checks, self.pins = self.pins_and_checks()

    king_row = king_square.row
    king_col = king_square.col

    for square in piece_squares:
      possible_moves = []
      if self.in_check:
        if len(self.checks) == 1:
          possible_moves = self.possible_moves(square)
          check = self.checks[0]
          enemy_piece = check.square.piece
          valid_piece_squares = []
          if isinstance(enemy_piece, Knight):
            valid_piece_squares.append(check.square)
          else:
            row_dir, col_dir = check.dir
            for i in range(1, COLS):
              next_row = king_row + i * row_dir
              next_col = king_col + i * col_dir
              next_square = squares[next_row][next_col]
              valid_piece_squares.append(next_square)
              if next_square == check.square: 
                break
          
          for i in range(len(possible_moves) -1, -1, -1):
            move = possible_moves[i]
            if not isinstance(move.piece, King):
              if move.final not in valid_piece_squares:
                possible_moves.pop(i)
        else:
          possible_moves = self.king_moves(square)
      else:
        possible_moves = self.possible_moves(square)

      square.piece.set_moves(possible_moves)
      self.moves += possible_moves
      
    if len(self.moves) == 0:
      if self.in_check:
        self.checkmate = True
      else:
        self.stalemate = True
    
    

  def possible_moves(self, initial: Square):

    piece = initial.piece

    if isinstance(piece, Pawn):
      return self.pawn_moves(initial)
    elif isinstance(piece, Knight):
      return self.knight_moves(initial)
    elif isinstance(piece, Bishop):
      return self.bishop_moves(initial)
    elif isinstance(piece, Rook):
      return self.rook_moves(initial)
    elif isinstance(piece, Queen):
      return self.queen_moves(initial)
    elif isinstance(piece, King):
      return self.king_moves(initial)

    return []
  
     
  def pawn_moves(self, square):
    row = square.row
    col = square.col
    squares = self.squares
    pawn = square.piece
    moves = []

    pinned = False
    pin_direction = ()
    for pin in self.pins:
      if pin.square == square:
        pinned = True
        pin_direction = pin.dir
        self.pins.remove(pin)
        break

    if not pinned or abs(pin_direction[0]) == 1 and pin_direction[1] == 0:
      if not pawn.moved:
        for i in range(1, 3):
          next_row = row + i * pawn.dir
          next_square = squares[next_row][col]
          if next_square.is_empty():
            moves.append(Move(square, next_square, pawn))
          else: break
      else:
        next_row = row + 1 * pawn.dir
        next_square = squares[next_row][col]
        if next_square.is_empty():
          moves.append(Move(square, next_square, pawn))
    
    for i in (-1, 1):
      if not pinned or pin_direction[1] == i:
        next_row = row + 1 * pawn.dir
        next_col = col + i
        if self.in_range(next_row, next_col):
          next_square = squares[next_row][next_col]
          if next_square.has_enemy_piece(pawn.color):
            moves.append(Move(square, next_square, pawn, captured=next_square.piece))
          elif self.en_passant[-1] and next_square == self.en_passant[-1][0]:
            king_row = self.white_king_square.row if self.player == "white" else self.black_king_square.row
            attacking_piece = False
            blocking_piece = False
            if king_row == row:
              king_col = self.white_king_square.col if self.player == "white" else self.black_king_square.col
              if king_col < col:  # king is to the left of the pawn
                if i == -1:
                  inside_range = range(king_col + 1, col - 1)
                  outside_range = range(col + 1, COLS)
                else:
                  inside_range = range(king_col + 1, col)
                  outside_range = range(col + 2, COLS)
              else:  # king is to the right of the pawn
                if i == -1:
                  inside_range = range(king_col - 1, col, -1)
                  outside_range = range(col - 2, -1, -1)
                else:
                  inside_range = range(king_col - 1, col + 1, -1)
                  outside_range = range(col - 1, -1, -1)
              for next_col in inside_range:
                row_square = squares[row][next_col]
                if row_square.has_piece():
                  blocking_piece = True
                  break
              if blocking_piece:
                moves.append(Move(square, next_square, pawn))
                continue
              for next_col in outside_range:
                row_square = squares[row][next_col]
                if row_square.has_enemy_piece(self.player):
                  next_piece = row_square.piece
                  if isinstance(next_piece, Rook) or isinstance(next_piece, Queen):
                    attacking_piece = True
                elif row_square.has_piece():
                  blocking_piece = True
              if not attacking_piece or blocking_piece:
                moves.append(Move(square, next_square, pawn))
            else:
              moves.append(Move(square, next_square, pawn))

    return moves


  def knight_moves(self, square):
    for pin in self.pins:
      if pin.square == square:
        return []
    row = square.row
    col = square.col
    squares = self.squares
    knight = square.piece
    moves = []

    possible = [
       (-2, -1),
       (-2, 1),
       (-1, -2),
       (-1, 2),
       (1, -2),
       (1, 2),
       (2, -1),
       (2, 1)
      ]
    
    for row_dir, col_dir in possible:
      next_row = row + row_dir
      next_col = col + col_dir
      if self.in_range(next_row, next_col):
        next_square = squares[next_row][next_col]
        if next_square.is_empty():
          moves.append(Move(square, next_square, knight))
        elif next_square.has_enemy_piece(knight.color):
          moves.append(Move(square, next_square, knight, captured=next_square.piece))

    return moves


  def bishop_moves(self, square):
    row = square.row
    col = square.col
    squares = self.squares
    bishop = square.piece
    moves = []

    pinned = False
    pin_direction = ()

    for pin in self.pins:
      if pin.square == square:
        pinned = True
        pin_direction = pin.dir
        self.pins.remove(pin)
        break

    directions = [
      (1, 1), 
      (1, -1), 
      (-1, 1),
      (-1, -1)
      ]
    
    for row_dir, col_dir in directions:
      if not pinned or pin_direction == (row_dir, col_dir) or pin_direction == (-row_dir, -col_dir):
        for i in range(1, COLS):
          next_row = row + i * row_dir
          next_col = col + i * col_dir
          if self.in_range(next_row, next_col):
            next_square = squares[next_row][next_col]
            if next_square.is_empty():
              moves.append(Move(square, next_square, bishop))
            elif next_square.has_enemy_piece(bishop.color):
              moves.append(Move(square, next_square, bishop, next_square.piece))
              break
            else: break
          else: break
    return moves
      
    
  def rook_moves(self, square):
    row = square.row
    col = square.col
    squares = self.squares
    rook = square.piece
    moves = []

    pinned = False
    pin_direction = ()

    for pin in self.pins:
      if pin.square == square:
        pinned = True
        pin_direction = pin.dir
        if not isinstance(rook, Queen):
          self.pins.remove(pin)
        break

    directions = [
      (-1, 0),
      (0, -1),
      (0, 1),
      (1, 0)
    ]

    for row_dir, col_dir in directions:
      for i in range(1, COLS):
        if not pinned or pin_direction == (row_dir, col_dir) or pin_direction == (row_dir, -col_dir) or pin_direction == (-row_dir, col_dir):
          next_row = row + i * row_dir
          next_col = col + i * col_dir
          if self.in_range(next_row, next_col):
            next_square = squares[next_row][next_col]
            if next_square.is_empty():
              moves.append(Move(square, next_square, rook))
            elif next_square.has_enemy_piece(rook.color):
              moves.append(Move(square, next_square, rook, captured=next_square.piece))
              break
            else: break
    
    return moves


  def queen_moves(self, square):
    return self.rook_moves(square) + self.bishop_moves(square)


  def king_moves(self, square):
    row = square.row
    col = square.col
    squares = self.squares
    king = square.piece
    moves = []

    directions = [
        (-1, -1),
        (-1, 0),
        (-1, 1),
        (0, -1),
        (0, 1),
        (1, -1),
        (1, 0),
        (1, 1)
    ]
      
    for row_dir, col_dir in directions:
      next_row = row + row_dir
      next_col = col + col_dir
      if self.in_range(next_row, next_col):
        next_square = squares[next_row][next_col]
        if next_square.is_empty():
          in_check, checks, pins = self.pins_and_checks(potential=next_square)
          if not in_check:
            moves.append(Move(square, next_square, king))
        elif next_square.has_enemy_piece(king.color):
          in_check, checks, pins = self.pins_and_checks(potential=next_square)
          if not in_check:
            moves.append(Move(square, next_square, king, next_square.piece))


    left_square = squares[row][0]
    right_square = squares[row][7]
    if not king.moved and not self.in_check:
      if left_square.has_piece() and isinstance(left_square.piece, Rook):
        left_rook = left_square.piece
        if not left_rook.moved:
          if squares[row][1].is_empty() and squares[row][2].is_empty() and squares[row][3].is_empty():
            valid = True
            for i in [2, 3]:
              in_check, checks, pins = self.pins_and_checks(potential=squares[row][i])
              if in_check:
                valid = False
                break
            if valid:
              moves.append(Move(square, squares[row][2], king))
      if right_square.has_piece() and isinstance(right_square.piece, Rook):
        right_rook = right_square.piece
        if not right_rook.moved:
          if squares[row][5].is_empty() and squares[row][6].is_empty():
            valid = True
            for i in [5, 6]:
              in_check, checks, pins = self.pins_and_checks(potential=squares[row][i])
              if in_check:
                valid = False
                break
            if valid:
              moves.append(Move(square, squares[row][6], king))

      
    return moves


  def pins_and_checks(self, potential=None) -> tuple[bool, list[Check], list[Pin]]:
    squares = self.squares
    pins = []
    checks = []
    in_check = False
    color = self.player
    king_square = potential
    if king_square is None:
      king_square = self.white_king_square if color == "white" else self.black_king_square
    king_row = king_square.row
    king_col = king_square.col

    directions = [
      (-1, 0),
      (0, -1),
      (1, 0),
      (0, 1),
      (-1, -1),
      (-1, 1),
      (1, -1),
      (1, 1)
    ]

    for d, (row_dir, col_dir) in enumerate(directions):
      possible_pin = None
      for i in range(1, COLS):
        next_row = king_row + i * row_dir
        next_col = king_col + i * col_dir
        if self.in_range(next_row, next_col):
          next_square = squares[next_row][next_col]
          if next_square.has_piece():
            piece = next_square.piece
            if piece.is_ally(color):
              if isinstance(piece, King):
                continue
              if possible_pin is None:
                possible_pin = Pin(next_square, (row_dir, col_dir))
              else: break
            else:
              if 0 <= d <= 3 and isinstance(piece, Rook):
                if possible_pin:
                  pins.append(possible_pin)
                else:
                  in_check = True
                  checks.append(Check(next_square, (row_dir, col_dir)))
                break

              elif 0 <= d <= 3 and isinstance(piece, Queen):
                if possible_pin:
                  pins.append(possible_pin)
                else:
                  in_check = True
                  checks.append(Check(next_square, (row_dir, col_dir)))
                break

              elif 4 <= d <= 7 and isinstance(piece, Bishop):
                if possible_pin:
                  pins.append(possible_pin)
                else:
                  in_check = True
                  checks.append(Check(next_square, (row_dir, col_dir)))
                break

              elif 4 <= d <= 7 and isinstance(piece, Queen):
                if possible_pin:
                  pins.append(possible_pin)
                else:
                  in_check = True
                  checks.append(Check(next_square, (row_dir, col_dir)))
                break

              elif i == 1 and color == "white" and 4 <= d <= 5 and isinstance(piece, Pawn):
                in_check = True
                checks.append(Check(next_square, (row_dir, col_dir)))
                break
              elif i == 1 and color == "black" and 6 <= d <= 7 and isinstance(piece, Pawn):
                in_check = True
                checks.append(Check(next_square, (row_dir, col_dir)))
                break
              elif i == 1 and isinstance(piece, King):
                in_check = True
                checks.append(Check(next_square, (row_dir, col_dir)))
                break
              else: break
        else: break


    knight_moves = [
      (-2, -1),
      (-2, 1),
      (-1, -2),
      (-1, 2),
      (1, -2),
      (1, 2),
      (2, -1),
      (2, 1)
    ]

    for knight_row, knight_col in knight_moves:
      next_row = king_row + knight_row
      next_col = king_col + knight_col

      if self.in_range(next_row, next_col):
        next_square = squares[next_row][next_col]
        if next_square.has_enemy_piece(color):
          enemy = next_square.piece
          if isinstance(enemy, Knight):
            in_check = True
            checks.append(Check(next_square, (knight_row, knight_col)))

    return (in_check, checks, pins)  


              




  def is_valid(self, move: Move):
    return move in move.piece.moves

  def next_turn(self):
    self.player = "black" if self.player == "white" else "white"

  def in_range(self, row, col):
    return 0 <= row < 8 and 0 <= col < 8
  

  def undo_move(self):
    if self.last_move:
      move = self.last_move

      initial = move.initial
      final = move.final

      piece = move.piece

      self.move_log.pop()
      if len(self.move_log) == 0:
        self.last_move = None
      else:
        self.last_move = self.move_log[len(self.move_log) - 1]

      self.en_passant.pop()

      self.next_turn()

      if isinstance(piece, King):
        if self.player == "white":
          self.white_king_square = initial
        else:
          self.black_king_square = initial

      if self.player == "white":
        piece_squares = self.white_piece_squares
        rival_squares = self.black_piece_squares

        self.material_score -= PIECE_SCORES[piece.__str__()][final.row][final.col]
        self.material_score += PIECE_SCORES[piece.__str__()][initial.row][initial.col]

      else:
        piece_squares = self.black_piece_squares
        rival_squares = self.white_piece_squares

        self.material_score += PIECE_SCORES[piece.__str__()][final.row][final.col]
        self.material_score -= PIECE_SCORES[piece.__str__()][initial.row][initial.col]

      
      initial.add_piece(move.piece)
      piece_squares.append(initial)
      piece_squares.remove(final)
      if move.captured:
        final.add_piece(move.captured)
        rival_squares.append(final)
        piece.captured.pop()

        if piece.color == "white":
          self.material_score -= (move.captured.value + PIECE_SCORES[move.captured.__str__()][final.row][final.col])
        else:
          self.material_score += (move.captured.value + PIECE_SCORES[move.captured.__str__()][final.row][final.col])

      else:
        final.remove_piece()

      if move.en_passant:
        turn = 1 if piece.color == "white" else -1
        captured_pawn_square = self.squares[final.row + turn][final.col]
        captured_pawn_square.add_piece(piece.captured[-1])
        piece.captured.pop()
        rival_squares.append(captured_pawn_square)

        if piece.color == "white":
          self.material_score -= (1 + PIECE_SCORES["black pawn"][final.row + 1][final.col])
        else:
          self.material_score += (1 + PIECE_SCORES["white pawn"][final.row - 1][final.col])
      
      

      if move.king_castle:
        king_row = 7 if piece.color == "white" else 0
        rook_sqaure = self.squares[king_row][5]
        piece_squares.remove(rook_sqaure)
        self.squares[king_row][7].add_piece(rook_sqaure.piece)
        rook_sqaure.remove_piece()
        piece_squares.append(self.squares[king_row][7])
      elif move.queen_castle:
        king_row = 7 if piece.color == "white" else 0
        rook_sqaure = self.squares[king_row][3]
        piece_squares.remove(rook_sqaure)
        self.squares[king_row][0].add_piece(rook_sqaure.piece)
        rook_sqaure.remove_piece()
        piece_squares.append(self.squares[king_row][0])
      elif move.promotion:
        if piece.color == "white":
          self.material_score -= (8 + PIECE_SCORES["white queen"][final.row][final.col]) 
        else:
          self.material_score += (8 + PIECE_SCORES["black queen"][final.row][final.col])

      if move.first:
        piece.moved = False

      self.checkmate = False
      self.stalemate = False

      self.valid_moves()

      return move.captured or move.en_passant
    











  



    
    



  

