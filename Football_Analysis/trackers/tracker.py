from ultralytics import YOLO
import supervision as sv
import pickle
import os
import sys
import cv2
import numpy as np
import pandas as pd
sys.path.append('../')
from utils import bbox_center, bbox_width, get_foot_pos

class Tracker:
  
  def __init__(self, model_path) -> None:
    self.model = YOLO(model_path)
    self.tracker = sv.ByteTrack()
    self.track_memory = {}

  
  def add_position_to_tracks(self, tracks):
    for obj, obj_tracks in tracks.items():
      for frame_num, track in enumerate(obj_tracks):
        for track_id, track_info in track.items():
          bbox = track_info['bbox']
          if obj == 'ball':
            pos = bbox_center(bbox)
          else:
            pos = get_foot_pos(bbox)
          tracks[obj][frame_num][track_id]['position'] = pos

  def get_obj_tracks(self, frames, save=False, save_path=None):

    if save and save_path is not None and os.path.exists(save_path):
      with open(save_path,'rb') as f:
        tracks = pickle.load(f)
      return tracks

    detections = self.detect_frames(frames)

    tracks = {
      "players" : [],
      "referees" : [],
      "ball" :[]
    }

    for frame_num, detection in enumerate(detections):
      class_names = detection.names
      class_names_inverse = {v:k for k,v in class_names.items()}

      detection_sv = sv.Detections.from_ultralytics(detection)

      # goalkeeper_flags = {}
      
      # for idx, class_id in enumerate(detection_sv.class_id):
      #   if class_names[class_id] == 'goalkeeper':
      #     detection_sv.class_id[idx] = class_names_inverse['player']
      #     goalkeeper_flags[idx] = True
      #   else:
      #     goalkeeper_flags[idx] = False
      
      detection_tracked = self.tracker.update_with_detections(detection_sv)

      tracks["players"].append({})
      tracks["referees"].append({})
      tracks["ball"].append({})

      for frame_detection in detection_tracked:
        bbox = frame_detection[0].tolist()
        class_id = frame_detection[3]
        track_id = frame_detection[4]

        if class_id == class_names_inverse['player'] or class_id == class_names_inverse['goalkeeper']:
          # stable_track_id = self.get_stable_track_id(frame_num, bbox, track_id, "player")
          # is_gk = goalkeeper_flags.get(track_id, False)
          is_gk = True if class_id == class_names_inverse["goalkeeper"] else False
          tracks["players"][frame_num][track_id] = {'bbox':bbox, 'is_gk': is_gk}
        elif class_id == class_names_inverse['referee']:
          tracks["referees"][frame_num][track_id] = {'bbox':bbox}

      for frame_detection in detection_sv:
        bbox = frame_detection[0].tolist()
        class_id = frame_detection[3]

        if class_id == class_names_inverse["ball"]:
          tracks["ball"][frame_num][1] = {'bbox':bbox}

    if save_path is not None:
      with open(save_path, 'wb') as f:
        pickle.dump(tracks, f)

    return tracks 

  def detect_frames(self, frames):
    batch_size = 20
    detections = []
    for i in range(0, len(frames), batch_size):
      detections_batch = self.model.predict(frames[i:i + batch_size], conf=0.1)
      detections += detections_batch
    return detections
  
  def get_stable_track_id(self, frame_num, bbox, track_id, obj_type):
    max_distance = 30
    if obj_type not in self.track_memory:
      self.track_memory[obj_type] = {}
    
    if frame_num == 0:
      self.track_memory[obj_type][track_id] = bbox
      return track_id
    
    center = bbox_center(bbox)
    prev_positions = self.track_memory[obj_type]
    for prev_track_id, prev_bbox in prev_positions.items():
      prev_center = bbox_center(prev_bbox)
      
      if np.linalg.norm(np.array(prev_center) - np.array(center)) < max_distance:
        self.track_memory[obj_type][prev_track_id] = bbox
        return prev_track_id
      
    self.track_memory[obj_type][track_id] = bbox
    return track_id

  def draw_ellipse(self, frame, bbox, color, track_id=None):
    y2 = int(bbox[3])
    x_center,_ = bbox_center(bbox)
    width = bbox_width(bbox)

    cv2.ellipse(
      frame,
      center=(x_center, y2),
      axes=(int(width), int(0.35 * width)),
      angle=0.0,
      startAngle=-45,
      endAngle=235,
      color=color,
      thickness=2,
      lineType=cv2.LINE_4
    )

    rect_width = 40
    rect_height = 20
    x1_rect = x_center - rect_width//2
    x2_rect = x_center + rect_width//2
    y1_rect = (y2 - rect_height//2) + 15
    y2_rect = (y2 + rect_height//2) + 15

    if track_id is not None:
      cv2.rectangle(
        frame,
        (int(x1_rect), int(y1_rect)),
        (int(x2_rect), int(y2_rect)),
        color,
        cv2.FILLED 
      )
      x1_text = x1_rect + 12

      if track_id > 99:
        x1_text -= 10
      cv2.putText(
        frame,
        f'{track_id}',
        (int(x1_text), int(y1_rect + 15)),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (0,0,0),
        2
      )


    return frame
  
  def draw_triangle(self, frame, bbox, color):
    y = int(bbox[1])
    x,_ = bbox_center(bbox)
    points = np.array([
      [x,y],
      [x-10,y-20],
      [x+10,y-20]
    ])
    cv2.drawContours(
      frame,
      [points],
      0,
      color,
      cv2.FILLED
    )
    cv2.drawContours(
      frame,
      [points],
      0,
      (0,0,0),
      2
    )
    return frame





  def draw_annotations(self, frames, tracks, team_ball_control):
    output_frames = []

    for i, frame in enumerate(frames):
      frame = frame.copy()

      player_dict = tracks["players"][i]
      ref_dict = tracks["referees"][i]
      ball_dict = tracks["ball"][i]

      for track_id, player in player_dict.items():
        color = player.get("team_color", (0, 0, 255))
        frame = self.draw_ellipse(frame, player["bbox"], color, track_id)

        if player.get("has_ball", False):
          frame = self.draw_triangle(frame, player["bbox"], (0,0,255))

      for _, ref in ref_dict.items():
        frame = self.draw_ellipse(frame, ref["bbox"], (0, 255, 255))

      for _, ball in ball_dict.items():
        frame = self.draw_triangle(frame, ball["bbox"], (0, 255, 0))

      frame = self.draw_ball_control(frame, i, team_ball_control)

      output_frames.append(frame)
    
    return output_frames
  
  def draw_ball_control(self, frame, frame_num, team_ball_control):
    overlay = frame.copy()
    cv2.rectangle(overlay, (1350, 850), (1900, 1020), (255,255,255), -1)
    alpha = 0.4
    cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0, frame)

    curr_ball_control = team_ball_control[:frame_num + 1]

    team1_control = curr_ball_control[curr_ball_control == 1].shape[0]
    team2_control = curr_ball_control[curr_ball_control == 2].shape[0]

    total_control = len(curr_ball_control)

    team1 = team1_control / total_control
    team2 = team2_control / total_control

    in_dispute = (1 - team1 - team2)

    cv2.putText(frame, f"Team 1: {team1*100:.2f}%",(1400,900), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,0), 3)
    cv2.putText(frame, f"Team 2: {team2*100:.2f}%",(1400,950), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,0), 3)
    cv2.putText(frame, f"In Dispute: {in_dispute*100:.2f}%",(1400,1000), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,0), 3)


    return frame
  

  def interpolate_ball_positions(self, positions):
    positions = [x.get(1, {}).get("bbox", []) for x in positions]
    df = pd.DataFrame(positions, columns=['x1','y1','x2','y2'])

    df = self.detect_outliers(df)
    df = df.interpolate(limit_direction="both").bfill()

    positions = [{1: {"bbox": x}} for x in df.to_numpy().tolist()]

    return positions

  def smooth_positions(self, df, window_size=5):
    return df.rolling(window=window_size, min_periods=1, center=True).mean()
  
  def detect_outliers(self, df, threshold=50):
    df_diff = df.diff().abs()
    outliers = (df_diff > threshold).any(axis=1)

    df[outliers] = np.nan

    return df



