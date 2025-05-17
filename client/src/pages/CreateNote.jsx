import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { createNote } from '../api/nodeApi';
import { getCategories } from '@/api/categoryApi';
import { useStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NoteForm from '@/components/NoteFrom';

const CreateNote = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (response && response.data) {
          setCategories(response.data);
        } else {
          console.error('Categories data is undefined or null:', response);
          message.error('获取分类失败');
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        message.error('获取分类失败');
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const noteData = {
        ...values,
        userId: user.id,
        tags: values.tags || [],
        collection: values.collection || 0,
      };
      if (!noteData.title || !noteData.content) {
        message.error('标题和内容不能为空');
        return;
      }
      await createNote(noteData);
      message.success('笔记创建成功');
      navigate('/notes');
    } catch (error) {
      console.error('Failed to create note:', error);
      message.error('笔记创建失败');
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1
          style={{
            textAlign: 'center',
            fontFamily: 'Cursive, sans-serif',
            color: '#4682B4',
            fontSize: '2.5em',
            margin: '20px 0',
          }}
        >
          创建笔记
        </h1>
        <NoteForm
          categories={categories}
          onSubmit={handleSubmit}
          submitButtonText="创建笔记"
        />
      </div>
    </>
  );
};
export default CreateNote;
