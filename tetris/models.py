from django.db import models

class Score(models.Model):
    player = models.CharField(max_length=100)
    points = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player}: {self.points}"

