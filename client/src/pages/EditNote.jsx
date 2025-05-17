import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { updateNote, getNote } from '../api/nodeApi';
import { getCategories } from '../api/categoryApi';
import { useStore } from '../store/userStore';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import NoteForm from '@/components/NoteFrom';

const EditNote = () => {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const { user } = useStore();
  const [categories, setCategories] = useState([]);
  const [noteData, setNoteData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noteResponse, categoriesResponse] = await Promise.all([
          getNote(noteId),
          getCategories(),
        ]);

        const fetchedNoteData = noteResponse.data;
        setNoteData(fetchedNoteData);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('获取数据失败');
      }
    };
    fetchData();
  }, [noteId]);

  const handleSubmit = async (values) => {
    try {
      const updatedNoteData = {
        ...values,
        userId: user.id,
      };
      await updateNote(noteId, updatedNoteData);
      message.success('笔记更新成功！');
      navigate('/notes');
    } catch (error) {
      console.error('Failed to update note:', error);
      message.error('更新笔记失败');
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
          编辑笔记
        </h1>
        {noteData && (
          <NoteForm
            initialValues={noteData}
            categories={categories}
            onSubmit={handleSubmit}
            submitButtonText="更新笔记"
          />
        )}
      </div>
    </>
  );
};

export default EditNote;
