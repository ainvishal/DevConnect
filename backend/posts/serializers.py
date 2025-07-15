from rest_framework import serializers
from .models import Post,UserFollower, Comment

class PostSerializer(serializers.ModelSerializer):
    like_count = serializers.IntegerField(read_only=True)  # No need for `source` as the method matches the field name
    dislike_count = serializers.IntegerField(read_only=True)  # Same here

    class Meta:
        model = Post
        fields = ['id', 'user', 'author', 'title', 'content', 'created_at', 'updated_at', 'like_count', 'dislike_count']


# class FollowSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Follow
#         fields = ['id', 'follower', 'followed', 'created_at']
class UserFollowerSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = UserFollower
        fields = ['user', 'followers', 'following', 'followers_count', 'following_count', 'is_following']

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    def get_is_following(self, obj):
        user = self.context['request'].user
        return obj.followers.filter(id=user.id).exists()



class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author_username', 'content', 'created_at']  # Remove 'author' from fields
