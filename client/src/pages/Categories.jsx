import React, { useState, useEffect } from 'react';
import { List, Card, Tooltip } from 'antd';
import { getCategories } from '@/api/categoryApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Categories = () => {
  const navigate = useNavigate();
  const user = useStore();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        alert('获取分类失败');
      }
    };
    fetchCategoriesData();
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h1
          style={{
            textAlign: 'center',
            fontFamily: 'Cursive, sans-serif',
            color: '#0000FF',
            fontSize: '2.5em',
            margin: '20px 0',
          }}
        >
          分类列表
        </h1>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={categories}
          pagination={{ pageSize: 8 }}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                className="m-2 shadow-md hover:shadow-lg transition-shadow duration-300"
                cover={
                  <img
                    alt="example"
                    src="https://whyhd.oss-cn-nanjing.aliyuncs.com/th.jpg"
                  />
                }
              >
                <Card.Meta
                  title={
                    <Tooltip title="更多信息">
                      <div
                        className="text-lg font-semibold text-blue-600"
                        style={{
                          fontFamily: 'Cursive, sans-serif',
                          color: '#FF6347',
                        }}
                      >
                        {item.name}
                      </div>
                    </Tooltip>
                  }
                />
                <a
                  href={`/notes/categories/${item.id}`}
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                >
                  查看分类笔记
                </a>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default Categories;
