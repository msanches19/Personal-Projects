import cv2
import sys
sys.path.append('../')
from utils import measure_distance, get_foot_pos

class SpeedDistanceEstimator:

  def __init__(self) -> None:
    self.frame_window = 5
    self.frame_rate = 24


  def add_to_tracks(self, tracks):
    total_distances = {}

    for obj, obj_tracks in tracks.items():
      if obj == "ball" or obj == "referee":
        continue
      num_frames = len(obj_tracks)
      for frame_num in range(0, num_frames, self.frame_window):
        last_frame = min(frame_num + self.frame_window, num_frames - 1)
        last_frame_tracks = obj_tracks[last_frame]
        frame_tracks = obj_tracks[frame_num]
        for track_id, _ in frame_tracks.items():
          if track_id not in last_frame_tracks:
            continue
          
          start = obj_tracks[frame_num][track_id]['transformed_position']
          end = obj_tracks[last_frame][track_id]['transformed_position']
          if start is None or end is None:
            continue

          distance_covered = measure_distance(start, end)
          time_elapsed = (last_frame - frame_num) / self.frame_rate
          speed_mps = distance_covered / time_elapsed
          speed_kph = speed_mps * 3.6

          if obj not in total_distances:
            total_distances[obj] = {}

          if track_id not in total_distances[obj]:
            total_distances[obj][track_id] = 0
          
          total_distances[obj][track_id] += distance_covered

          for frame_num_batch in range(frame_num, last_frame):
            if track_id not in tracks[obj][frame_num_batch]:
              continue
            obj_tracks[frame_num_batch][track_id]['speed'] = speed_kph
            obj_tracks[frame_num_batch][track_id]['distance'] = total_distances[obj][track_id]


  def draw_speed_distance(self, frames, tracks):
    output_frames = []
    for frame_num, frame in enumerate(frames):
      for obj, obj_tracks in tracks.items():
        if obj == 'ball' or obj == 'referee':
          continue
        frame_tracks = obj_tracks[frame_num]
        for _, track_info in frame_tracks.items():
          if 'speed' in track_info:
            speed = track_info.get('speed', None)
            distance = track_info.get('distance', None)
            if speed is None or distance is None:
              continue

            bbox = track_info['bbox']
            pos = get_foot_pos(bbox)
            pos = list(pos)
            pos[1] += 40
            pos = tuple(map(int, pos))
            cv2.putText(frame, f"{speed:.2f} km/h",pos,cv2.FONT_HERSHEY_SIMPLEX,0.5,(0,0,0),2)
            cv2.putText(frame, f"{distance:.2f} m",(pos[0],pos[1]+20),cv2.FONT_HERSHEY_SIMPLEX,0.5,(0,0,0),2)

      output_frames.append(frame)

    return output_frames

            


