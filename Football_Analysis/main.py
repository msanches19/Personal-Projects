import cv2
import numpy as np
from utils import read_video, save_video
from trackers import Tracker
from team_assigner import TeamAssigner
from player_ball_assigner import PlayerBallAssigner
from camera_movement_estimator import CameraMovementEstimator
from view_transformer import ViewTransformer
from speed_distance_estimator import SpeedDistanceEstimator

def main():
  frames = read_video('input_videos/08fd33_4.mp4')

  tracker = Tracker('models/football_best.pt')
  
  tracks = tracker.get_obj_tracks(frames, save=True, save_path='stubs/track_stubs6.pkl')

  tracker.add_position_to_tracks(tracks)

  camera_movement_estimator = CameraMovementEstimator(frames)
  camera_movement_per_frame = camera_movement_estimator.get_camera_movement(True,'stubs/camera_movement_stub.pk1')

  camera_movement_estimator.adjust_track_positions(tracks, camera_movement_per_frame)

  view_transformer = ViewTransformer()
  view_transformer.add_perspectives_to_tracks(tracks)

  tracks["ball"] = tracker.interpolate_ball_positions(tracks["ball"])

  speed_distance_estimator = SpeedDistanceEstimator()
  speed_distance_estimator.add_to_tracks(tracks)

  team_assigner = TeamAssigner()
  team_assigner.assign_team_color(frames[0], tracks["players"][0])

  for frame_num, player_track in enumerate(tracks["players"]):
    for player_id, track in player_track.items():
      team = team_assigner.get_player_team(frames[frame_num], track["bbox"], player_id)
      tracks["players"][frame_num][player_id]["team"] = team
      tracks["players"][frame_num][player_id]["team_color"] = team_assigner.team_colors[team]

  player_ball_assigner = PlayerBallAssigner()

  team_ball_control = []
  last_team = None
  count = 0
  

  for frame_num, player_track in enumerate(tracks["players"]):
    ball_bbox = tracks["ball"][frame_num][1]["bbox"]
    assigned_player = player_ball_assigner.assign_ball_to_player(player_track, ball_bbox)

    if assigned_player is not None and not tracks["players"][frame_num][assigned_player]["is_gk"]:
      tracks["players"][frame_num][assigned_player]["has_ball"] = True
      last_team = tracks["players"][frame_num][assigned_player]["team"]
      team_ball_control.append(last_team)
    else:
      count += 1
      last_team = None if count > 10 else last_team
      team_ball_control.append(last_team)

  team_ball_control = np.array(team_ball_control)



  output_frames = tracker.draw_annotations(frames, tracks, team_ball_control)

  output_frames = camera_movement_estimator.draw_camera_movement(output_frames, camera_movement_per_frame)

  output_frames = speed_distance_estimator.draw_speed_distance(output_frames, tracks)

  save_video(output_frames, 'output_videos/output_video2.avi')

if __name__ == '__main__':
  main()
