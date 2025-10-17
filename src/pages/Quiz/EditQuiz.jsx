import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, message, Card, Space, Divider, Select } from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchQuizDetail();
  }, [id]);

  const fetchQuizDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/quiz-sets/${id}`);
      setQuiz(response.data);
      
      // Set form values
      form.setFieldsValue({
        title: response.data.title,
        description: response.data.description,
        timeLimit: response.data.timeLimit,
        questionType: response.data.questionType,
        visibility: response.data.visibility,
        category: response.data.category,
        maxQuestions: response.data.maxQuestions,
        language: response.data.language,
        questions: response.data.questions || []
      });
    } catch (err) {
      console.error("Error fetching quiz detail:", err);
      message.error(t('editQuiz.loadError', 'Không thể tải thông tin quiz'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      
      const response = await api.put(`/quiz-sets/${id}`, {
        title: values.title,
        description: values.description,
        timeLimit: values.timeLimit,
        questionType: values.questionType,
        visibility: values.visibility,
        category: values.category,
        maxQuestions: values.maxQuestions,
        language: values.language,
        questions: values.questions
      });
      
      message.success(t('editQuiz.updateSuccess', 'Cập nhật quiz thành công!'));
      navigate(`/quiz/${id}`);
    } catch (err) {
      console.error("Error updating quiz:", err);
      message.error(err.response?.data?.message || t('editQuiz.updateError', 'Cập nhật quiz thất bại'));
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    const questions = form.getFieldValue('questions') || [];
    const newQuestion = {
      questionText: '',
      timeLimit: 30,
      answers: [
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false }
      ]
    };
    
    form.setFieldsValue({
      questions: [...questions, newQuestion]
    });
  };

  const removeQuestion = (index) => {
    const questions = form.getFieldValue('questions') || [];
    questions.splice(index, 1);
    form.setFieldsValue({ questions });
  };

  const addAnswer = (questionIndex) => {
    const questions = form.getFieldValue('questions') || [];
    if (questions[questionIndex]) {
      questions[questionIndex].answers.push({ answerText: '', isCorrect: false });
      form.setFieldsValue({ questions });
    }
  };

  const removeAnswer = (questionIndex, answerIndex) => {
    const questions = form.getFieldValue('questions') || [];
    if (questions[questionIndex] && questions[questionIndex].answers) {
      questions[questionIndex].answers.splice(answerIndex, 1);
      form.setFieldsValue({ questions });
    }
  };

  const toggleCorrectAnswer = (questionIndex, answerIndex) => {
    const questions = form.getFieldValue('questions') || [];
    if (questions[questionIndex] && questions[questionIndex].answers) {
      // Toggle the selected answer
      questions[questionIndex].answers[answerIndex].isCorrect = !questions[questionIndex].answers[answerIndex].isCorrect;
      form.setFieldsValue({ questions });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('editQuiz.loading', 'Đang tải...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(`/quiz/${id}`)}
                className="mr-4"
              >
                {t('editQuiz.back', 'Quay lại')}
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('editQuiz.editQuiz', 'Sửa Quiz')}: {quiz?.title}
              </h1>
            </div>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={handleSave}
              size="large"
            >
              {t('editQuiz.saveChanges', 'Lưu thay đổi')}
            </Button>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          className="space-y-6"
        >
          {/* Basic Info */}
          <Card title={t('editQuiz.basicInfo', 'Thông tin cơ bản')} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={t('editQuiz.title', 'Tiêu đề')}
                name="title"
                rules={[{ required: true, message: t('editQuiz.titleRequired', 'Vui lòng nhập tiêu đề') }]}
              >
                <Input placeholder={t('editQuiz.titlePlaceholder', 'Nhập tiêu đề quiz')} />
              </Form.Item>

              <Form.Item
                label={t('editQuiz.timeLimit', 'Thời gian (phút)')}
                name="timeLimit"
                rules={[{ required: true, message: t('editQuiz.timeLimitRequired', 'Vui lòng nhập thời gian') }]}
              >
                <Input type="number" placeholder={t('editQuiz.timeLimitPlaceholder', '30')} />
              </Form.Item>
            </div>

            <Form.Item
              label={t('editQuiz.description', 'Mô tả')}
              name="description"
              rules={[{ required: true, message: t('editQuiz.descriptionRequired', 'Vui lòng nhập mô tả') }]}
            >
              <Input.TextArea
                rows={3}
                placeholder={t('editQuiz.descriptionPlaceholder', 'Nhập mô tả quiz')}
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                label={t('editQuiz.questionType', 'Loại câu hỏi')}
                name="questionType"
                rules={[{ required: true, message: t('editQuiz.questionTypeRequired', 'Vui lòng chọn loại câu hỏi') }]}
              >
                <Select placeholder={t('editQuiz.questionTypePlaceholder', 'Chọn loại câu hỏi')}>
                  <Select.Option value="MULTIPLE_CHOICE">{t('editQuiz.multipleChoice', 'Trắc nghiệm')}</Select.Option>
                  <Select.Option value="TRUE_FALSE">{t('editQuiz.trueFalse', 'Đúng/Sai')}</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={t('editQuiz.visibility', 'Quyền hiển thị')}
                name="visibility"
                rules={[{ required: true, message: t('editQuiz.visibilityRequired', 'Vui lòng chọn quyền hiển thị') }]}
              >
                <Select placeholder={t('editQuiz.visibilityPlaceholder', 'Chọn quyền hiển thị')}>
                  <Select.Option value="PUBLIC">{t('editQuiz.public', 'Công khai')}</Select.Option>
                  <Select.Option value="PRIVATE">{t('editQuiz.private', 'Riêng tư')}</Select.Option>
                  <Select.Option value="HIDDEN">{t('editQuiz.hidden', 'Ẩn')}</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={t('editQuiz.category', 'Danh mục')}
                name="category"
                rules={[{ required: true, message: t('editQuiz.categoryRequired', 'Vui lòng chọn danh mục') }]}
              >
                <Select placeholder={t('editQuiz.categoryPlaceholder', 'Chọn danh mục')}>
                  <Select.Option value="SCIENCE">{t('editQuiz.science', 'Khoa học')}</Select.Option>
                  <Select.Option value="HISTORY">{t('editQuiz.history', 'Lịch sử')}</Select.Option>
                  <Select.Option value="GEOGRAPHY">{t('editQuiz.geography', 'Địa lý')}</Select.Option>
                  <Select.Option value="LITERATURE">{t('editQuiz.literature', 'Văn học')}</Select.Option>
                  <Select.Option value="MATH">{t('editQuiz.math', 'Toán học')}</Select.Option>
                  <Select.Option value="LANGUAGE">{t('editQuiz.language', 'Ngôn ngữ')}</Select.Option>
                  <Select.Option value="TECHNOLOGY">{t('editQuiz.technology', 'Công nghệ')}</Select.Option>
                  <Select.Option value="SPORTS">{t('editQuiz.sports', 'Thể thao')}</Select.Option>
                  <Select.Option value="ART">{t('editQuiz.art', 'Nghệ thuật')}</Select.Option>
                  <Select.Option value="OTHER">{t('editQuiz.other', 'Khác')}</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={t('editQuiz.maxQuestions', 'Số câu hỏi tối đa')}
                name="maxQuestions"
                rules={[{ required: true, message: t('editQuiz.maxQuestionsRequired', 'Vui lòng nhập số câu hỏi tối đa') }]}
              >
                <Input type="number" placeholder={t('editQuiz.maxQuestionsPlaceholder', '5')} min="1" max="100" />
              </Form.Item>

              <Form.Item
                label={t('editQuiz.languageLabel', 'Ngôn ngữ')}
                name="language"
                rules={[{ required: true, message: t('editQuiz.languageRequired', 'Vui lòng chọn ngôn ngữ') }]}
              >
                <Select placeholder={t('editQuiz.languagePlaceholder', 'Chọn ngôn ngữ')}>
                  <Select.Option value="vi">{t('editQuiz.vietnamese', 'Tiếng Việt')}</Select.Option>
                  <Select.Option value="en">{t('editQuiz.english', 'English')}</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </Card>

          {/* Questions */}
          <Card 
            title={t('editQuiz.questions', 'Câu hỏi')} 
            extra={
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={addQuestion}
              >
                {t('editQuiz.addQuestion', 'Thêm câu hỏi')}
              </Button>
            }
          >
            <Form.List name="questions">
              {(fields, { add, remove }) => (
                <div className="space-y-6">
                  {fields.map((field, questionIndex) => (
                    <Card
                      key={field.key}
                      size="small"
                      title={`${t('editQuiz.questionNumber', 'Câu hỏi')} ${questionIndex + 1}`}
                      extra={
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeQuestion(questionIndex)}
                        >
                          {t('editQuiz.delete', 'Xóa')}
                        </Button>
                      }
                      className="bg-gray-50"
                    >
                      <Form.Item
                        key={`${field.key}-questionText`}
                        name={[field.name, 'questionText']}
                        label={t('editQuiz.questionContent', 'Nội dung câu hỏi')}
                        rules={[{ required: true, message: t('editQuiz.questionContentRequired', 'Vui lòng nhập nội dung câu hỏi') }]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder={t('editQuiz.questionContentPlaceholder', 'Nhập nội dung câu hỏi')}
                        />
                      </Form.Item>

                      <Form.Item
                        key={`${field.key}-timeLimit`}
                        name={[field.name, 'timeLimit']}
                        label={t('editQuiz.questionTimeLimit', 'Thời gian (giây)')}
                        rules={[{ required: true, message: t('editQuiz.questionTimeLimitRequired', 'Vui lòng nhập thời gian') }]}
                      >
                        <Input type="number" placeholder={t('editQuiz.questionTimeLimitPlaceholder', '30')} />
                      </Form.Item>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700">{t('editQuiz.answers', 'Đáp án')}</label>
                            <p className="text-xs text-gray-500 mt-1">
                              {t('editQuiz.multipleCorrectAnswers', '💡 Có thể chọn nhiều câu trả lời đúng cho mỗi câu hỏi')}
                            </p>
                          </div>
                          <Button
                            type="dashed"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => addAnswer(questionIndex)}
                          >
                            {t('editQuiz.addAnswer', 'Thêm đáp án')}
                          </Button>
                        </div>

                        <Form.List name={[field.name, 'answers']}>
                          {(answerFields, { add: addAnswer, remove: removeAnswer }) => (
                            <div className="space-y-3">
                              {answerFields.map((answerField, answerIndex) => (
                                <div key={answerField.key} className="flex items-center space-x-3">
                                  <div className="flex-1">
                                    <Form.Item
                                      key={`${answerField.key}-answerText`}
                                      name={[answerField.name, 'answerText']}
                                      rules={[{ required: true, message: t('editQuiz.answerRequired', 'Vui lòng nhập đáp án') }]}
                                    >
                                      <Input placeholder={`${t('editQuiz.answerPlaceholder', 'Đáp án')} ${String.fromCharCode(65 + answerIndex)}`} />
                                    </Form.Item>
                                  </div>
                                  
                                  <Button
                                    type={form.getFieldValue(['questions', questionIndex, 'answers', answerIndex, 'isCorrect']) ? 'primary' : 'default'}
                                    onClick={() => toggleCorrectAnswer(questionIndex, answerIndex)}
                                    className="min-w-[100px]"
                                  >
                                    {form.getFieldValue(['questions', questionIndex, 'answers', answerIndex, 'isCorrect']) ? t('editQuiz.correct', 'Đúng') : t('editQuiz.incorrect', 'Sai')}
                                  </Button>
                                  
                                  <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeAnswer(questionIndex, answerIndex)}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </Form.List>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Form.List>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default EditQuiz;
