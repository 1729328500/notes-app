import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Button, message, Space } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { getNote } from '@/api/nodeApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { favoriteNote, unfavoriteNote } from '@/api/favoriteApi';

const Note = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  const handleFavorite = async () => {
    if (!user) {
      message.error('请先登录');
      return;
    }
    try {
      if (note.collection === 1) {
        await unfavoriteNote(note.id, user.id);
        message.success('取消收藏成功');
      } else {
        await favoriteNote(note.id, user.id);
        message.success('收藏成功');
      }
      setNote({ ...note, collection: note.collection === 1 ? 0 : 1 });
    } catch (error) {
      console.error('收藏操作失败:', error);
      message.error('收藏操作失败');
    }
  };

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const fetchedNote = await getNote(id);
        console.log(fetchedNote);
        setNote(fetchedNote.data);
      } catch (error) {
        console.error('Failed to fetch note details:', error);
        alert('获取笔记详情失败');
        navigate('/notes');
      }
    };
    fetchNoteDetails();
  }, [id, navigate]);

  if (!note) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <Card className="note-card" hoverable>
        <Card.Meta
          title={
            <h1
              style={{
                textAlign: 'center',
                fontFamily: 'Cursive, sans-serif',
                color: '#4682B4',
                fontSize: '3em',
                margin: '20px 0',
              }}
            >
              {note.title}
            </h1>
          }
          description={
            <p style={{ fontSize: '1.5em', margin: '20px 0', color: '#000' }}>
              {note.content}
            </p>
          }
        />
        <div className="my-4">
          {note.tags.map((tag) => (
            <Tag color="cyan" key={tag}>
              {tag}
            </Tag>
          ))}
        </div>
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/notes/edit/${note.id}`)}
          >
            编辑
          </Button>
          <Button
            type={note.collection === 1 ? 'default' : 'primary'}
            icon={
              note.collection === 1 ? (
                <StarFilled style={{ color: '#faad14' }} />
              ) : (
                <StarOutlined />
              )
            }
            onClick={handleFavorite}
            loading={loading}
          >
            {note.collection === 1 ? '已收藏' : '收藏'}
          </Button>
        </Space>
      </Card>
    </>
  );
};

export default Note;
