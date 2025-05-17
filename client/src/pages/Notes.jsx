import { useEffect, useState } from 'react';
import { List, Card, Tag, Button, Modal, message } from 'antd';
import { getNotes, deleteNote } from '../api/nodeApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar1 from '@/components/Navbar';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { favoriteNote, unfavoriteNote } from '@/api/favoriteApi';

const Notes = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNodeId, setSeletedNodeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favoriteNotes, setFavoriteNotes] = useState([]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      const fetchNotesData = await getNotes(user.id);
      setNotes(fetchNotesData.data);
      // 更新收藏状态
      setFavoriteNotes(
        fetchNotesData.data.filter((note) => note.collection === 1),
      );
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      message.error('获取笔记失败');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <Navbar1 />
      <h1
        style={{
          textAlign: 'center',
          fontFamily: 'Cursive, sans-serif',
          color: '#4682B4',
          fontSize: '2.5em',
          margin: '20px 0',
        }}
      >
        笔记列表
      </h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <Button
          type="primary"
          style={{
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            backgroundColor: '#4682B4',
            borderColor: '#4682B4',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            fontSize: '1.5em',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s, transform 0.3s',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#5a9bd4')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#4682B4')
          }
          onClick={() => navigate('/create-note')}
        >
          +
        </Button>
      </div>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={notes}
        className="p-4"
        renderItem={(item) => (
          <Card
            className="bg-blue-100 m-2 shadow-md hover:shadow-lg transition-shadow duration-300"
            hoverable
            style={{
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.3s',
              transform: 'scale(1)',
              ':hover': {
                transform: 'scale(1.05)',
              },
              background: '#ADD8E6',
              color: '#fff',
              padding: '20px',
              position: 'relative',
            }}
            extra={
              <Button
                type="text"
                icon={
                  item.collection === 1 ? (
                    <StarFilled style={{ color: '#faad14' }} />
                  ) : (
                    <StarOutlined />
                  )
                }
                onClick={async () => {
                  setLoading(true);
                  try {
                    if (item.collection === 1) {
                      await unfavoriteNote(item.id, user.id);
                      message.success('取消收藏成功');
                    } else {
                      await favoriteNote(item.id, user.id);
                      message.success('收藏成功');
                    }
                    fetchNotes();
                  } catch (error) {
                    message.error('操作失败');
                  } finally {
                    setLoading(false);
                  }
                }}
                loading={loading}
              />
            }
          >
            <Card.Meta
              title={item.title}
              description={item.content.substring(0, 100) + '...'}
            />
            <div className="my-4">
              {item.tags.map((tag) => (
                <Tag color="cyan" key={tag}>
                  {tag}
                </Tag>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="link" onClick={() => navigate(`/notes/${item.id}`)}>
                查看详情
              </Button>
              <Button
                type="primary"
                onClick={() => navigate(`/notes/edit/${item.id}`)}
              >
                编辑
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => {
                  setModalVisible(true);
                  setSeletedNodeId(item.id);
                }}
              >
                删除
              </Button>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '-20px',
                width: '40px',
                height: '40px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                transform: 'translateY(-50%)',
              }}
            ></div>
          </Card>
        )}
      />

      <Modal
        title="确认删除笔记？"
        open={modalVisible}
        onOk={async () => {
          try {
            await deleteNote(selectedNodeId);
            message.success('笔记删除成功');
            fetchNotes();
          } catch (error) {
            console.error('Failed to delete note:', error);
            message.error('笔记删除失败');
          } finally {
            setModalVisible(false);
            setSeletedNodeId(null);
          }
        }}
        onCancel={() => {
          setModalVisible(false);
          setSeletedNodeId(null);
        }}
      >
        <p>确定要删除该笔记吗？,此操作不可重置!!!</p>
      </Modal>
    </>
  );
};

export default Notes;
