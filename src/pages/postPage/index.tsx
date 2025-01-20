

import  { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from '../../components/modal';
import Button from '../../ui/button';
import Input from '../../ui/input';
import { useSwipeable } from 'react-swipeable';

interface Comment {
  _id: string;
  user: {
    username: string;
  };
  content: string;
  likesCount: number;
  likes: string[]; 
}

interface Post {
  content: string;
  imageUrls: string[];
  videoUrl?: string;
  commentsCount: number;
  comments: Comment[];
}

const PostPage = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);

  const isModalOpen = location.pathname === `/post/${postId}`;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3333/api/post/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setPost(response.data.data);
      } catch (err) {
        setError('Error fetching post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://localhost:3333/api/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSecondModalOpen(false);
      navigate(`/profile/${username}`);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Error deleting post');
    }
  };
 
  const handleAddComment = async () => {
    try {
      await axios.post(
        `http://localhost:3333/api/post/${postId}/comment`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setComment('');
     
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Error adding comment');
    }
  };

  const handleLikeComment = async (
    commentId: string,
    currentLikes: string[],
    currentLikesCount: number
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:3333/api/comment/${commentId}/togglelike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const updatedComments = post?.comments.map((comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            likesCount: response.data.data.likesCount,
            likes: response.data.data.likes,
          };
        }
        return comment;
      });

      setPost((prev) => prev && { ...prev, comments: updatedComments || [] });
    } catch (err) {
      console.error('Error liking comment:', err);
      setError('Error liking comment');
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => console.log('Swiped Left'),
    onSwipedRight: () => console.log('Swiped Right'),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      {/* Первая модалка */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => navigate(`/profile/${username}`)}
        title="View Post"
        modal={
          <Button
            variant="secondary"
            onClick={() => setSecondModalOpen(true)} // Открываем вторую модалку
          >
            Close
          </Button>
        }
      >
        <div className="flex w-full mt-4 h-96">
          <div className="flex flex-col items-center justify-center w-1/2 gap-4 border-r">
            <div className="flex flex-wrap gap-2 overflow-hidden" {...handlers}>
              {post?.imageUrls?.length ? (
                post.imageUrls.map((url, index) => (
                  <div key={index} className="flex-shrink-0">
                    <img
                      src={url}
                      alt="Post content"
                      className="object-cover w-96 h-96"
                    />
                  </div>
                ))
              ) : (
                <p>No images available</p>
              )}
              {post?.videoUrl && (
                <div className="flex-shrink-0">
                  <video controls className="object-cover w-96 h-96">
                    <source src={post.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h2>{post?.content}</h2>
            </div>
          </div>
          <div className="flex flex-col w-1/2 gap-2 pl-4 border-l">
            <div>
              <h3>{post?.commentsCount} Comments</h3>
              <div className="overflow-y-auto h-1/2">
                {post?.comments?.length ? (
                  post.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="flex items-center justify-between py-2 border-b"
                    >
                      <p>
                        <strong>{comment.user.username}:</strong>{' '}
                        {comment.content}
                      </p>
                      <div
                        onClick={() =>
                          handleLikeComment(
                            comment._id,
                            comment.likes,
                            comment.likesCount
                          )
                        }
                        className="flex items-center cursor-pointer"
                      >
                        {comment.likes.includes(
                          localStorage.getItem('userId')!
                        ) ? (
                          <img src="/liked-icon.svg" alt="Liked" />
                        ) : (
                          <img src="/like-icon.svg" alt="Like" />
                        )}
                        Like ({comment.likesCount})
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No comments yet</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <Input
                type="textarea"
                className="border-none min-h-1/2 focus:outline-none"
                placeholder="Write your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button variant="primary" onClick={handleAddComment}>
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Вторая модалка */}
      {isSecondModalOpen && (
        <Modal
          isOpen={isSecondModalOpen}
          onClose={() => setSecondModalOpen(false)}
          // title="Post Options"
        >
          <div className="flex flex-col gap-4">
            Olha Lazyniuk, [19.01.2025 20:02]
            <Button onClick={handleDeletePost}>Delete Post</Button>
            <Button
              variant="secondary"
              onClick={() => setSecondModalOpen(false)}
            >
              Back to Post
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/profile/${username}`)}
            >
              Back to Profile
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PostPage;
