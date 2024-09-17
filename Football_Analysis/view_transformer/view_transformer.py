import cv2
import numpy as np

class ViewTransformer:


  def __init__(self) -> None:
    width = 68
    length = 23.32

    self.pixels_vertices = np.array([
      [110, 1035],
      [265, 275],
      [910, 260],
      [1640, 915]
    ])

    self.target_vertices = np.array([
      [0, width],
      [0, 0],
      [length, 0],
      [length, width]
    ])

    self.pixels_vertices = self.pixels_vertices.astype(np.float32)
    self.target_vertices = self.target_vertices.astype(np.float32)

    self.perspective_transformer = cv2.getPerspectiveTransform(self.pixels_vertices, self.target_vertices)


  def add_perspectives_to_tracks(self, tracks):
    for obj, obj_tracks in tracks.items():
      for frame_num, track in enumerate(obj_tracks):
        for track_id, track_info in track.items():
          pos = np.array(track_info['position'])
          transformed_pos = self.transform_position(pos)
          if transformed_pos is not None:
            transformed_pos = transformed_pos.squeeze().tolist()
          tracks[obj][frame_num][track_id]['transformed_position'] = transformed_pos

  def transform_position(self, pos):
    point = (int(pos[0]), int(pos[1]))
    is_inside = cv2.pointPolygonTest(self.pixels_vertices, point, False) >= 0
    if is_inside:
      reshaped_pos = pos.reshape(-1,1,2).astype(np.float32)
      transformed_pos = cv2.perspectiveTransform(reshaped_pos, self.perspective_transformer)
      return transformed_pos.reshape(-1,2)
    else:
      return None


    
