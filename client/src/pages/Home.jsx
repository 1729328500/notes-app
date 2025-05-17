import {
  Layout,
  Typography,
  Card,
  List,
  Input,
  Space,
  Carousel,
  Row,
  Col,
  Statistic,
  Button,
} from 'antd';
import {
  FileTextOutlined,
  TagsOutlined,
  FolderOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/userStore';
import { getNotes, searchNotesByTags } from '@/api/nodeApi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [recentNotes, setRecentNotes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchRecentNotes = async () => {
      if (user) {
        try {
          const response = await getNotes(user.id);
          const notes = response.data;
          setRecentNotes(notes.slice(0, 6));
        } catch (error) {
          console.error('获取最近笔记失败:', error);
        }
      }
    };
    fetchRecentNotes();
  }, [user]);

  // 处理搜索
  const handleSearch = async (value) => {
    setSearchText(value);
    if (user && value.trim()) {
      try {
        const response = await searchNotesByTags(user.id, value.trim());
        setSearchResults(response.data);
      } catch (error) {
        console.error('搜索笔记失败:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const features = [
    {
      title: '笔记管理',
      icon: <FileTextOutlined className="text-4xl text-blue-500" />,
      description: '轻松创建、编辑和组织您的笔记',
    },
    {
      title: '标签系统',
      icon: <TagsOutlined className="text-4xl text-green-500" />,
      description: '使用标签对笔记进行分类和快速检索',
    },
    {
      title: '分类整理',
      icon: <FolderOutlined className="text-4xl text-purple-500" />,
      description: '创建分类文件夹，让笔记井然有序',
    },
  ];

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Navbar />
      <Content className="p-8 max-w-7xl mx-auto w-full">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 欢迎区域 */}
          <div className="text-center mb-8">
            {user ? (
              <>
                <Title
                  level={3}
                  style={{ fontFamily: 'Cursive', color: '#4A90E2' }}
                >
                  欢迎回来, {user.nickname || user.username}
                </Title>
                <Row gutter={16} className="mt-4">
                  <Col span={8}>
                    <Card>
                      <Statistic
                        title="笔记总数"
                        value={recentNotes.length}
                        prefix={<FileTextOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        block
                        onClick={() => navigate('/create-note')}
                      >
                        创建新笔记
                      </Button>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Button
                        type="default"
                        block
                        onClick={() => navigate('/notes')}
                      >
                        查看所有笔记
                      </Button>
                    </Card>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Title level={2} className="text-blue-600">
                  欢迎来到笔记应用
                </Title>
                <p className="text-gray-600 text-lg mb-4">
                  这是一个强大的笔记管理工具，帮助您更好地组织思路和知识
                </p>
              </>
            )}
          </div>

          {/* 功能介绍 */}
          {!user && (
            <div className="mb-8">
              <Title level={3} className="text-center mb-6">
                主要功能
              </Title>
              <Row gutter={16}>
                {features.map((feature, index) => (
                  <Col span={8} key={index}>
                    <Card className="text-center h-full">
                      <div className="mb-4">{feature.icon}</div>
                      <Title level={4}>{feature.title}</Title>
                      <p className="text-gray-600">{feature.description}</p>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* 搜索区域 */}
          {user && (
            <div className="w-2/3 mx-auto">
              <Input.Search
                placeholder="输入标签、分类或标题搜索笔记"
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                size="large"
                className="shadow-sm"
              />
            </div>
          )}
        </Space>

        {user && !searchText && recentNotes.length > 0 && (
          <div className="mt-8">
            <Title
              level={3}
              style={{ fontFamily: 'Cursive', color: '#4A90E2' }}
            >
              最近的笔记
            </Title>
            <Carousel autoplay className="mb-8">
              {Array.from({ length: Math.ceil(recentNotes.length / 3) }).map(
                (_, index) => (
                  <div key={index}>
                    <List
                      grid={{ gutter: 16, column: 3 }}
                      dataSource={recentNotes.slice(index * 3, (index + 1) * 3)}
                      renderItem={(note) => (
                        <Card
                          className="mx-4 my-2 shadow-md hover:shadow-lg transition-shadow duration-300"
                          hoverable
                          onClick={() => navigate(`/notes/${note.id}`)}
                        >
                          <Card.Meta
                            title={
                              <div className="text-lg font-semibold text-blue-600">
                                {note.title}
                              </div>
                            }
                            description={
                              <div className="text-gray-600">
                                {note.content.substring(0, 100) + '...'}
                              </div>
                            }
                          />
                        </Card>
                      )}
                    />
                  </div>
                ),
              )}
            </Carousel>
          </div>
        )}

        {user && searchText && (
          <div className="mt-8">
            <Title level={3} className="text-center mb-6">
              搜索结果
            </Title>
            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={searchResults}
              renderItem={(note) => (
                <Card
                  className="mx-4 my-2 shadow-md hover:shadow-lg transition-shadow duration-300"
                  hoverable
                  onClick={() => navigate(`/notes/${note.id}`)}
                >
                  <Card.Meta
                    title={
                      <div className="text-lg font-semibold text-blue-600">
                        {note.title}
                      </div>
                    }
                    description={
                      <div className="text-gray-600">
                        {note.content.substring(0, 100) + '...'}
                      </div>
                    }
                  />
                </Card>
              )}
            />
          </div>
        )}
        <div className="mt-8">
          <Carousel
            autoplay
            className="mb-8 rounded-lg overflow-hidden shadow-lg"
          >
            <div>
              <img
                src="https://whyhd.oss-cn-nanjing.aliyuncs.com/%E7%89%B9%E8%95%BE%E8%A5%BF%E4%BA%9A.png"
                alt="特蕾西亚"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </div>
            <div>
              <img
                src="https://whyhd.oss-cn-nanjing.aliyuncs.com/4.jpg"
                alt="风景图1"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </div>
            <div>
              <img
                src="https://whyhd.oss-cn-nanjing.aliyuncs.com/2c778e30-19d1-49c8-bcf9-40188eb3cd0a_%E4%BC%81%E9%B9%85.jpg"
                alt="风景图2"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </div>
          </Carousel>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
