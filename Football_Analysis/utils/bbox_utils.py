def bbox_center(bbox):
  x1, y1, x2, y2 = bbox
  return int((x1 + x2) / 2), int((y1 + y2) / 2)

def bbox_width(bbox):
  return bbox[2] - bbox[0]

def bbox_height(bbox):
  return bbox[3] - bbox[1]


def measure_distance(p1, p2):
  return ((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2) ** 0.5


def measure_xy_distance(p1, p2):
  return p1[0] - p2[0], p1[1] - p2[1]


def get_foot_pos(bbox):
  x1, y1, x2, y2 = bbox
  return int((x1+x2)/2), int(y2)

