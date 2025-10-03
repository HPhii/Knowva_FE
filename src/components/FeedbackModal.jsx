import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Rate } from 'antd';
import { StarOutlined, SendOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import api from '../config/axios';

const { TextArea } = Input;

const FeedbackModal = ({ visible, onCancel }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);

  /**
   * 🚀 Handle form submission
   */
  const handleSubmit = async (values) => {
    if (rating === 0) {
      message.warning(t('feedback.selectRating'));
      return;
    }

    setLoading(true);
    try {
      // 🔗 API Call: POST /feedback
      await api.post('/feedback', {
        rating: rating,
        message: values.message
      });

      message.success(t('feedback.successMessage'));
      
      // 🔄 Reset form and close modal
      form.resetFields();
      setRating(0);
      onCancel();
    } catch (error) {
      console.error('❌ Failed to submit feedback:', error);
      message.error(t('feedback.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔄 Handle modal cancel
   */
  const handleCancel = () => {
    form.resetFields();
    setRating(0);
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StarOutlined style={{ color: '#faad14' }} />
          <span>{t('feedback.title')}</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: '20px' }}
      >
        {/* Rating Section */}
        <Form.Item
          label={t('feedback.ratingLabel')}
          required
        >
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Rate
              value={rating}
              onChange={setRating}
              style={{ fontSize: '32px' }}
              allowClear={false}
            />
            <div style={{ marginTop: '8px', color: '#8c8c8c', fontSize: '14px' }}>
              {rating === 0 && t('feedback.selectStars')}
              {rating === 1 && t('feedback.rating1')}
              {rating === 2 && t('feedback.rating2')}
              {rating === 3 && t('feedback.rating3')}
              {rating === 4 && t('feedback.rating4')}
              {rating === 5 && t('feedback.rating5')}
            </div>
          </div>
        </Form.Item>

        {/* Message Section */}
        <Form.Item
          label={t('feedback.messageLabel')}
          name="message"
          rules={[
            { required: true, message: t('feedback.messageRequired') },
            { min: 10, message: t('feedback.messageMinLength') },
            { max: 500, message: t('feedback.messageMaxLength') }
          ]}
        >
          <TextArea
            rows={4}
            placeholder={t('feedback.messagePlaceholder')}
            showCount
            maxLength={500}
            style={{ resize: 'none' }}
          />
        </Form.Item>

        {/* Action Buttons */}
        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button onClick={handleCancel} disabled={loading}>
              {t('feedback.cancel')}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SendOutlined />}
              style={{
                background: 'linear-gradient(45deg, #1890ff, #40a9ff)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
              }}
            >
              {t('feedback.submit')}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FeedbackModal;
