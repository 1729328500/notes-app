import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tag, Select } from 'antd';

/**
 * NoteForm组件 - 用于创建和编辑笔记的表单组件
 *
 * @param {Object} props
 * @param {Object} props.initialValues - 初始表单值，用于编辑模式
 * @param {Array} props.categories - 笔记分类列表
 * @param {Function} props.onSubmit - 表单提交处理函数
 * @param {string} props.submitButtonText - 提交按钮文本，默认为'提交'
 */
const NoteForm = ({
  initialValues,
  categories = [],
  onSubmit,
  submitButtonText = '提交',
}) => {
  // 创建表单实例
  const [form] = Form.useForm();
  // 管理标签列表状态
  const [tags, setTags] = useState([]);
  // 管理标签输入框的值
  const [inputTag, setInputTag] = useState('');

  // 当初始值变化时，更新表单数据
  useEffect(() => {
    if (initialValues) {
      // 设置表单字段值
      form.setFieldsValue({
        title: initialValues.title,
        content: initialValues.content,
        categoryId: initialValues.categoryId,
      });
      // 设置标签列表
      setTags(initialValues.tags || []);
    }
  }, [initialValues, form]);

  /**
   * 处理表单提交
   * @param {Object} values - 表单值
   */
  const handleSubmit = async (values) => {
    await onSubmit({ ...values, tags });
  };

  /**
   * 处理标签输入框值变化
   * @param {Event} e - 输入事件对象
   */
  const handleInputTagChange = (e) => {
    setInputTag(e.target.value);
  };

  /**
   * 添加新标签
   * 只有当输入的标签不为空且不存在于当前标签列表中时才添加
   */
  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
      setInputTag('');
    }
  };

  /**
   * 移除标签
   * @param {string} removedTag - 要移除的标签
   */
  const handleRemoveTag = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      className="max-w-2xl mx-auto"
    >
      {/* 笔记标题输入框 */}
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入笔记标题' }]}
      >
        <Input placeholder="请输入笔记标题" />
      </Form.Item>

      {/* 笔记内容输入框 */}
      <Form.Item
        label="内容"
        name="content"
        rules={[{ required: true, message: '请输入笔记内容' }]}
      >
        <Input.TextArea rows={6} placeholder="请输入笔记内容" />
      </Form.Item>

      {/* 笔记分类选择器 */}
      <Form.Item
        label="类型"
        name="categoryId"
        rules={[{ required: true, message: '请选择笔记类型' }]}
      >
        <Select placeholder="请选择笔记类型">
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* 标签管理区域 */}
      <div className="mb-4">
        <label className="block mb-2">标签</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={inputTag}
            onChange={handleInputTagChange}
            placeholder="输入标签"
            onPressEnter={handleAddTag}
          />
          <Button onClick={handleAddTag}>添加标签</Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <Tag key={tag} closable onClose={() => handleRemoveTag(tag)}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      {/* 提交按钮 */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {submitButtonText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NoteForm;
