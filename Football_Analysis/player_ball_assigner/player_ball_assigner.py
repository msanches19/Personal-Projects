import sys
sys.path.append('../')
from utils import bbox_center, measure_distance

class PlayerBallAssigner:

  def __init__(self) -> None:
    self.max_player_ball_distance = 70

  def assign_ball_to_player(self, players, ball_bbox):
    ball_position = bbox_center(ball_bbox)

    min_distance = 999999
    assigned_player = None

    for player_id, player in players.items():
      player_bbox = player["bbox"]

      distance_left = measure_distance((player_bbox[0], player_bbox[-1]), ball_position)
      distance_right = measure_distance((player_bbox[2], player_bbox[-1]), ball_position)
      distance = min(distance_left, distance_right)

      if distance < min_distance:
        min_distance = distance
        if (min_distance < self.max_player_ball_distance):
          assigned_player = player_id

    return assigned_player
  





