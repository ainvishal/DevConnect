from rest_framework import serializers
from .models import Post,Follow, Comment

class PostSerializer(serializers.ModelSerializer):
    like_count = serializers.IntegerField(read_only=True)  # No need for `source` as the method matches the field name
    dislike_count = serializers.IntegerField(read_only=True)  # Same here

    class Meta:
        model = Post
        fields = ['id', 'user', 'author', 'title', 'content', 'created_at', 'updated_at', 'like_count', 'dislike_count']


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['id', 'follower', 'followed', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author_username', 'content', 'created_at']  # Remove 'author' from fields
