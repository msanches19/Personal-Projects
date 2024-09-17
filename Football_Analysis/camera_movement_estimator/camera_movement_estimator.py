import pickle
import cv2
import os
import sys
sys.path.append('../')
import numpy as np
from utils import measure_distance, measure_xy_distance



class CameraMovementEstimator:

  def __init__(self, frames) -> None:
    self.frames = frames
    self.min_distance = 5

    first_frame_grayscale = cv2.cvtColor(frames[0], cv2.COLOR_BGR2GRAY)
    mask_features = np.zeros_like(first_frame_grayscale)
    mask_features[:,0:20] = 1
    mask_features[:,900:1050] = 1

    self.features = dict(
      maxCorners = 100,
      qualityLevel = 0.3,
      minDistance = 3,
      blockSize = 7,
      mask = mask_features
    )
    
    self.lk_params = dict(
      winSize = (15, 15),
      maxLevel = 2,
      criteria = (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 10, 0.03)
    )



  def get_camera_movement(self, read=False, path=None):

    if read and path is not None and os.path.exists(path):
      with open(path, 'rb') as f:
        return pickle.load(f)
    frames = self.frames
    camera_movement = [[0, 0]] * len(frames)

    old_gray = cv2.cvtColor(frames[0], cv2.COLOR_BGR2GRAY)
    old_features = cv2.goodFeaturesToTrack(old_gray, **self.features)

    for frame_num in range(1, len(frames)):
      frame_gray = cv2.cvtColor(frames[frame_num], cv2.COLOR_BGR2GRAY)
      new_features = cv2.calcOpticalFlowPyrLK(old_gray, frame_gray, old_features, None, **self.lk_params)[0]

      max_distance = 0
      camera_x, camera_y = 0, 0

      for i, (new, old) in enumerate(zip(new_features, old_features)):
        new_features_point = new.ravel()
        old_features_point = old.ravel()

        distance = measure_distance(new_features_point, old_features_point)

        if distance > max_distance:
          max_distance = distance
          camera_x, camera_y = measure_xy_distance(new_features_point, old_features_point)

      if max_distance > self.min_distance:
        camera_movement[frame_num] = [camera_x, camera_y]
        old_features = cv2.goodFeaturesToTrack(frame_gray, **self.features)

      old_gray = frame_gray.copy()

      if path is not None:
        with open(path, 'wb') as f:
          pickle.dump(camera_movement, f)

    return camera_movement
  

  def draw_camera_movement(self, frames, movement_per_frame):
    output_frames = []

    for frame_num, frame in enumerate(frames):
      frame = frame.copy()
      overlay = frame.copy()
      cv2.rectangle(overlay, (0,0), (500, 100), (255,255,255), -1)
      alpha = 0.6
      cv2.addWeighted(overlay, alpha, frame, 1-alpha, 0, frame)

      x_movement, y_movement = movement_per_frame[frame_num]
      
      frame = cv2.putText(frame,f"Camera Movement X: {x_movement:.2f}",(10,30), cv2.FONT_HERSHEY_SIMPLEX,1,(0,0,0),3)
      frame = cv2.putText(frame,f"Camera Movement Y: {y_movement:.2f}",(10,60), cv2.FONT_HERSHEY_SIMPLEX,1,(0,0,0),3)

      output_frames.append(frame)

    return output_frames
  

  def adjust_track_positions(self, tracks, movement_per_frame):
    for obj, obj_tracks in tracks.items():
      for frame_num, track in enumerate(obj_tracks):
        for track_id, track_info in track.items():
          pos = track_info['position']
          movement = movement_per_frame[frame_num]
          adjusted_pos = (pos[0] - movement[0], pos[1], movement[1])
          tracks[obj][frame_num][track_id]['adjusted_position'] = adjusted_pos










