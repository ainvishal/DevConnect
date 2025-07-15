from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    author = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def like_count(self):
        return self.interactions.filter(interaction_type='like').count()

    def dislike_count(self):
        return self.interactions.filter(interaction_type='dislike').count()

    def __str__(self):
        return f"{self.title} by {self.author}"
    
class PostInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post_interactions")  # Each user can interact with a post
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="interactions")  # Each post can have multiple interactions
    interaction_type = models.CharField(max_length=10, choices=[('like', 'Like'), ('dislike', 'Dislike')])  # Either like or dislike
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when the interaction was created

    class Meta:
        unique_together = ('user', 'post')  # Ensure one interaction per user per post

    def __str__(self):
        return f"{self.user.username} {self.interaction_type}d {self.post.title}"
    
class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'followed')  # Ensure a user can't follow another user multiple times

    def __str__(self):
        return f"{self.follower.username} follows {self.followed.username}"

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username}: {self.content[:20]}"

