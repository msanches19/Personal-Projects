import pygame.mixer

class Sound:

  def __init__(self, path) -> None:
    self.sound = pygame.mixer.Sound(path)


  def play(self):
    pygame.mixer.Sound.play(self.sound)