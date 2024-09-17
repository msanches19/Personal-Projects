
WIDTH = 800
HEIGHT = 800

COLS = 8
ROWS = 8

SQ_SIZE = WIDTH // COLS

ALPHA_COLS = {
  0: "a",
  1: "b",
  2: "c",
  3: "d",
  4: "e",
  5: "f",
  6: "g",
  7: "h"
}


CHECKMATE = 1000
STALEMATE = 0

KNIGHT_SCORES = [
  [0.0, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.0],
  [0.1, 0.3, 0.5, 0.5, 0.5, 0.5, 0.3, 0.1],
  [0.2, 0.45, 0.6, 0.65, 0.65, 0.6, 0.45, 0.2],
  [0.25, 0.55, 0.75, 0.7, 0.7, 0.75, 0.55, 0.25],
  [0.225, 0.45, 0.6, 0.65, 0.65, 0.6, 0.45, 0.225],
  [0.2, 0.35, 0.45, 0.35, 0.35, 0.45, 0.35, 0.2],
  [0.05, 0.05, 0.2, 0.35, 0.35, 0.2, 0.05, 0.05],
  [0.0, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.0]
]

BISHOP_SCORES = [
[0.1, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.1],
[0.2, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.2],
[0.35, 0.4, 0.5, 0.6, 0.6, 0.5, 0.4, 0.35],
[0.2, 0.65, 0.5, 0.6, 0.6, 0.5, 0.65, 0.2],
[0.35, 0.4, 0.6, 0.6, 0.6, 0.6, 0.4, 0.35],
[0.35, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.35],
[0.2, 0.65, 0.4, 0.4, 0.4, 0.4, 0.65, 0.2],
[0.15, 0.2, 0.25, 0.2, 0.2, 0.25, 0.2, 0.15]
]

ROOK_SCORES = [
  [0.25, 0.25, 0.3, 0.4, 0.4, 0.3, 0.25, 0.25],
  [0.5, 0.7, 0.75, 0.75, 0.75, 0.75, 0.7, 0.5],
  [0.0, 0.25, 0.3, 0.35, 0.35, 0.3, 0.25, 0.0],
  [0.0, 0.25, 0.25, 0.3, 0.3, 0.25, 0.25, 0.0],
  [0.0, 0.25, 0.25, 0.3, 0.3, 0.25, 0.25, 0.0],
  [0.0, 0.25, 0.3, 0.35, 0.35, 0.3, 0.25, 0.0],
  [0.0, 0.25, 0.25, 0.45, 0.45, 0.25, 0.25, 0.0],
  [0.25, 0.25, 0.45, 0.65, 0.65, 0.45, 0.25, 0.25]
]

QUEEN_SCORES = [
  [0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.2, 0.1],
  [0.2, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.2],
  [0.2, 0.4, 0.5, 0.5, 0.5, 0.5, 0.4, 0.2],
  [0.3, 0.4, 0.5, 0.5, 0.5, 0.5, 0.4, 0.3],
  [0.4, 0.4, 0.5, 0.5, 0.5, 0.5, 0.4, 0.3],
  [0.2, 0.5, 0.5, 0.5, 0.5, 0.5, 0.4, 0.2],
  [0.2, 0.4, 0.5, 0.4, 0.4, 0.4, 0.4, 0.2],
  [0.0, 0.2, 0.2, 0.3, 0.3, 0.2, 0.2, 0.0]
]

PAWN_SCORES = [
  [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8],
  [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7],
  [0.3, 0.3, 0.4, 0.5, 0.5, 0.4, 0.3, 0.3],
  [0.25, 0.25, 0.3, 0.45, 0.45, 0.3, 0.25, 0.25],
  [0.2, 0.2, 0.2, 0.4, 0.4, 0.2, 0.2, 0.2],
  [0.25, 0.15, 0.1, 0.2, 0.2, 0.1, 0.15, 0.25],
  [0.25, 0.3, 0.3, 0.0, 0.0, 0.3, 0.3, 0.25],
  [0.0, 00., 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
]

KING_SCORES = [
  [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
  [0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7],
  [0.3, 0.3, 0.4, 0.5, 0.5, 0.4, 0.3, 0.3],
  [0.0, 0.0, 0.15, 0.15, 0.15, 0.15, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.15, 0.2, 0.0, 0.0, 0.0, 0.0, 0.2, 0.15],
  [0.4, 0.35, 0.1, 0.0, 0.0, 0.1, 0.35, 0.4]
]



PIECE_SCORES = {
  "white knight": KNIGHT_SCORES, 
  "black knight": KNIGHT_SCORES[::-1],
  "white bishop": BISHOP_SCORES,
  "black bishop": BISHOP_SCORES[::-1],
  "white rook": ROOK_SCORES,
  "black rook": ROOK_SCORES[::-1],
  "white queen": QUEEN_SCORES,
  "black queen": QUEEN_SCORES[::-1],
  "white pawn": PAWN_SCORES,
  "black pawn": PAWN_SCORES[::-1],
  "white king": KING_SCORES,
  "black king": KING_SCORES[::-1]
}

