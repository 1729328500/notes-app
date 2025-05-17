import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Avatar,
  List,
  Card,
  Button,
  message,
  Space,
} from 'antd';
import {
  UserOutlined,
  StarOutlined,
  StarFilled,
  LogoutOutlined,
} from '@ant-design/icons';
import { useStore } from '@/store/userStore';
import { getFavoriteNotes } from '@/api/favoriteApi';
import { getNotes } from '@/api/nodeApi';
import Navbar from '../components/Navbar';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { unfavoriteNote } from '@/api/favoriteApi';
import axios from 'axios';
import { Input } from 'antd';
import { updateNickname } from '@/api/userApi';

const { Content } = Layout;
const { Title, Text } = Typography;

const Profile = () => {
  const { user, logout } = useStore();
  const [notes, setNotes] = useState([]);
  const [favoriteNotes, setFavoriteNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const navigate = useNavigate();

  const fetchFavoriteNotes = async () => {
    try {
      const response = await getFavoriteNotes(user.id);
      setFavoriteNotes(response.data);
    } catch (error) {
      message.error('获取收藏笔记失败');
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
      fetchFavoriteNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const response = await getNotes(user.id);
      // 只显示已收藏的笔记
      const favoritedNotes = response.data.filter(
        (note) => note.collection === 1,
      );
      setNotes(favoritedNotes);
    } catch (error) {
      message.error('获取笔记列表失败');
    }
  };

  const handleUnfavorite = async (userId, noteId) => {
    console.log('Unfavorite Note ID:', noteId, 'User ID:', userId); // 打印传递的参数信息
    setLoading(true);
    try {
      await unfavoriteNote(noteId, user.id);
      message.success('取消收藏成功');
      fetchNotes();
    } catch (error) {
      console.error('Unfavorite operation failed:', error); // 添加错误日志
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '');
    }
  }, [user]);

  const handleSaveNickname = async () => {
    try {
      await updateNickname(user.id, nickname);
      message.success('昵称更新成功');
      setIsEditing(false);
      // 更新用户信息
      useStore.setState((state) => ({
        user: { ...state.user, nickname: nickname },
      }));
      // 同步更新 localStorage
      localStorage.setItem('user', JSON.stringify({ ...user, nickname }));
    } catch (error) {
      message.error('昵称更新失败');
    }
  };

  return (
    <Layout className="layout">
      <Navbar />
      <Content className="profile-content">
        <div className="profile-header">
          <Space align="center">
            <Avatar size={64} icon={<UserOutlined />} src={user?.avatar_url} />
            {isEditing ? (
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={{ width: 200 }}
              />
            ) : (
              <Title level={3}>{nickname}</Title>
            )}
            {isEditing ? (
              <>
                <Button type="primary" onClick={handleSaveNickname}>
                  √
                </Button>
                <Button onClick={() => setIsEditing(false)}>×</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>修改昵称</Button>
            )}
          </Space>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={() => {
              logout();
              message.success('退出登录成功');
            }}
            style={{ position: 'fixed', bottom: 20, right: 20 }}
          >
            退出登录
          </Button>
        </div>

        <div className="notes-section">
          <Title level={4}>我的收藏</Title>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={notes}
            renderItem={(note) => (
              <List.Item>
                <Card
                  title={note.title}
                  extra={
                    <Button
                      type="text"
                      icon={<StarFilled style={{ color: '#faad14' }} />}
                      onClick={() => handleUnfavorite(user.id, note.id)}
                      loading={loading}
                    />
                  }
                >
                  <Text style={{ display: 'block' }} ellipsis>
                    {note.content}
                  </Text>
                  <Button
                    type="link"
                    onClick={() => navigate(`/notes/${note.id}`)}
                    className="mt-2"
                  >
                    查看详情
                  </Button>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default Profile;

// Removed the favorite button
