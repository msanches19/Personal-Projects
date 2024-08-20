import os
import pygame

from theme import Theme
from sound import Sound

class Layout:

  def __init__(self) -> None:
    self.themes = self.add_themes()
    self.index = 0
    self.theme = self.themes[self.index]

    self.move_sound = Sound(self._move_sound())
    self.capture_sound = Sound(self._capture_sound())

    self.font = pygame.font.SysFont("monospace", 32, bold=True)

    self.index_font = pygame.font.SysFont("monospace", 18, bold=True)






  def add_themes(self) -> list[Theme]:
    green = Theme(light_bg=(234, 235, 200), dark_bg=(119, 154, 88),
                  light_trace=(244, 247, 116), dark_trace=(172, 195, 51),
                  light_moves='#C86464', dark_moves='#C84646',
                  highlight=(213, 230, 69))

    brown = Theme(light_bg=(235, 209, 200), dark_bg=(165, 117, 80),
                  light_trace=(245, 234, 100), dark_trace=(209, 185, 59),
                  light_moves='#C86464', dark_moves='#C84646',
                  highlight=(244, 247, 116))

    blue = Theme(light_bg=(229, 228, 200), dark_bg=(60, 95, 135),
                 light_trace=(123, 187, 227), dark_trace=(43, 119, 191),
                 light_moves='#C86464', dark_moves='#C84646',
                 highlight=(244, 247, 116))

    gray = Theme(light_bg=(120, 119, 118), dark_bg=(86, 85, 84),
                 light_trace=(99, 126, 143), dark_trace=(82, 102, 128),
                 light_moves='#C86464', dark_moves='#C84646',
                 highlight=(254, 255, 250))

    return [green, brown, blue, gray]
  
  def change_theme(self):
    self.index += 1
    self.index %= len(self.themes)
    self.theme = self.themes[self.index]

  def _move_sound(self):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(current_dir, '..', 'assets')
    sound_path = os.path.join(
        assets_dir,
        'sounds',
        'move.wav'
        )
    return sound_path

  def _capture_sound(self):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(current_dir, '..', 'assets')
    sound_path = os.path.join(
        assets_dir,
        'sounds',
        'capture.wav'
        )
    return sound_path
    


