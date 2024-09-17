from ultralytics import YOLO
model = YOLO('models/football_best.pt')
result = model.predict('input_videos/08fd33_4.mp4', save=True)