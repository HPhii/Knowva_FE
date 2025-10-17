import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, message, Card, Space, Divider, Select } from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import api from "../../config/axios";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      
      // Validate that we have at least one question
      if (!values.questions || values.questions.length === 0) {
        message.error(t('createQuiz.noQuestionsError', 'Vui lòng thêm ít nhất một câu hỏi'));
        return;
      }

      // Validate that each question has at least one correct answer
      const invalidQuestions = values.questions.filter(question => {
        if (!question.answers || question.answers.length === 0) return true;
        return !question.answers.some(answer => answer.isCorrect);
      });

      if (invalidQuestions.length > 0) {
        message.error(t('createQuiz.noCorrectAnswerError', 'Mỗi câu hỏi phải có ít nhất một đáp án đúng'));
        return;
      }
      
      // Prepare request body according to API specification
      const requestBody = {
        title: values.title?.trim(),
        description: values.description?.trim(),
        sourceType: "TEXT", // Use TEXT for manual creation (accepted enum values: FLASHCARD, PDF, IMAGE, TEXT)
        language: values.language,
        questionType: values.questionType,
        maxQuestions: parseInt(values.maxQuestions) || 0,
        visibility: values.visibility,
        category: values.category,
        timeLimit: parseInt(values.timeLimit) || 0,
        questions: values.questions.map((question, index) => ({
          questionText: question.questionText?.trim() || "",
          questionHtml: question.questionText?.trim() || "", // Same as questionText for manual creation
          imageUrl: question.imageUrl?.trim() || "",
          timeLimit: parseInt(question.timeLimit) || 30,
          order: index,
          answers: (question.answers || []).map(answer => ({
            answerText: answer.answerText?.trim() || "",
            isCorrect: Boolean(answer.isCorrect)
          }))
        }))
      };
      
      console.log('Sending request body:', requestBody); // Debug log
      
      const response = await api.post('/quiz-sets/save', requestBody);
      
      message.success(t('createQuiz.success', 'Tạo quiz thành công!'));
      navigate('/my-library', { 
        state: { 
          showSuccessMessage: true,
          message: t('createQuiz.success', 'Tạo quiz thành công!')
        } 
      });
    } catch (err) {
      console.error("Error creating quiz:", err);
      message.error(err.response?.data?.message || t('createQuiz.error', 'Tạo quiz thất bại'));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/my-library')}
                className="mr-4"
              >
                {t('createQuiz.back', 'Quay lại')}
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('createQuiz.title', 'Tạo Quiz mới')}
              </h1>
            </div>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={handleSave}
              size="large"
            >
              {t('createQuiz.save', 'Tạo Quiz')}
            </Button>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          className="space-y-6"
          initialValues={{
            timeLimit: 30,
            questionType: 'MULTIPLE_CHOICE',
            visibility: 'PUBLIC',
            category: 'MATHEMATICS',
            maxQuestions: 5,
            language: 'vi'
          }}
        >
          {/* Basic Info */}
          <Card title={t('createQuiz.basicInfo', 'Thông tin cơ bản')} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={t('createQuiz.titleLabel', 'Tiêu đề')}
                name="title"
                rules={[{ required: true, message: t('createQuiz.titleRequired', 'Vui lòng nhập tiêu đề') }]}
              >
                <Input placeholder={t('createQuiz.titlePlaceholder', 'Nhập tiêu đề quiz')} />
              </Form.Item>

              <Form.Item
                label={t('createQuiz.timeLimit', 'Thời gian (phút)')}
                name="timeLimit"
                rules={[{ required: true, message: t('createQuiz.timeRequired', 'Vui lòng nhập thời gian') }]}
              >
                <Input type="number" placeholder="30" />
              </Form.Item>
            </div>

            <Form.Item
              label={t('createQuiz.description', 'Mô tả')}
              name="description"
              rules={[{ required: true, message: t('createQuiz.descriptionRequired', 'Vui lòng nhập mô tả') }]}
            >
              <Input.TextArea
                rows={3}
                placeholder={t('createQuiz.descriptionPlaceholder', 'Nhập mô tả quiz')}
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                label={t('createQuiz.questionType', 'Loại câu hỏi')}
                name="questionType"
                rules={[{ required: true, message: t('createQuiz.questionTypeRequired', 'Vui lòng chọn loại câu hỏi') }]}
              >
                <Select placeholder={t('createQuiz.questionTypePlaceholder', 'Chọn loại câu hỏi')}>
                  <Select.Option value="MULTIPLE_CHOICE">{t('createQuiz.multipleChoice', 'Trắc nghiệm')}</Select.Option>
                  <Select.Option value="TRUE_FALSE">{t('createQuiz.trueFalse', 'Đúng/Sai')}</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={t('createQuiz.visibility', 'Quyền hiển thị')}
                name="visibility"
                rules={[{ required: true, message: t('createQuiz.visibilityRequired', 'Vui lòng chọn quyền hiển thị') }]}
              >
                <Select placeholder={t('createQuiz.visibilityPlaceholder', 'Chọn quyền hiển thị')}>
                  <Select.Option value="PUBLIC">{t('createQuiz.public', 'Công khai')}</Select.Option>
                  <Select.Option value="PRIVATE">{t('createQuiz.private', 'Riêng tư')}</Select.Option>
                  <Select.Option value="HIDDEN">{t('createQuiz.hidden', 'Ẩn')}</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={t('createQuiz.category', 'Danh mục')}
                name="category"
                rules={[{ required: true, message: t('createQuiz.categoryRequired', 'Vui lòng chọn danh mục') }]}
              >
                <Select placeholder={t('createQuiz.categoryPlaceholder', 'Chọn danh mục')}>
                  <Select.Option value="MATHEMATICS">{t('createQuiz.math', 'Toán học')}</Select.Option>
                  <Select.Option value="SCIENCE">{t('createQuiz.science', 'Khoa học')}</Select.Option>
                  <Select.Option value="HISTORY">{t('createQuiz.history', 'Lịch sử')}</Select.Option>
                  <Select.Option value="GEOGRAPHY">{t('createQuiz.geography', 'Địa lý')}</Select.Option>
                  <Select.Option value="LITERATURE">{t('createQuiz.literature', 'Văn học')}</Select.Option>
                  <Select.Option value="LANGUAGE">{t('createQuiz.language', 'Ngôn ngữ')}</Select.Option>
                  <Select.Option value="TECHNOLOGY">{t('createQuiz.technology', 'Công nghệ')}</Select.Option>
                  <Select.Option value="SPORTS">{t('createQuiz.sports', 'Thể thao')}</Select.Option>
                  <Select.Option value="ART">{t('createQuiz.art', 'Nghệ thuật')}</Select.Option>
                  <Select.Option value="OTHER">{t('createQuiz.other', 'Khác')}</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label={t('createQuiz.maxQuestions', 'Số câu hỏi tối đa')}
                name="maxQuestions"
                rules={[{ required: true, message: t('createQuiz.maxQuestionsRequired', 'Vui lòng nhập số câu hỏi tối đa') }]}
              >
                <Input type="number" placeholder="5" min="1" max="100" />
              </Form.Item>

              <Form.Item
                label={t('createQuiz.language', 'Ngôn ngữ')}
                name="language"
                rules={[{ required: true, message: t('createQuiz.languageRequired', 'Vui lòng chọn ngôn ngữ') }]}
              >
                <Select placeholder={t('createQuiz.languagePlaceholder', 'Chọn ngôn ngữ')}>
                  <Select.Option value="vi">{t('createQuiz.vietnamese', 'Tiếng Việt')}</Select.Option>
                  <Select.Option value="en">{t('createQuiz.english', 'English')}</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </Card>

          {/* Questions */}
          <Card 
            title={t('createQuiz.questions', 'Câu hỏi')} 
            extra={
              <Button 
                type="dashed" 
                icon={<PlusOutlined />} 
                onClick={addQuestion}
              >
                {t('createQuiz.addQuestion', 'Thêm câu hỏi')}
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
                      title={t('createQuiz.questionNumber', `Câu hỏi ${questionIndex + 1}`)}
                      extra={
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeQuestion(questionIndex)}
                        >
                          {t('createQuiz.delete', 'Xóa')}
                        </Button>
                      }
                      className="bg-gray-50"
                    >
                      <Form.Item
                        key={`${field.key}-questionText`}
                        name={[field.name, 'questionText']}
                        label={t('createQuiz.questionContent', 'Nội dung câu hỏi')}
                        rules={[{ required: true, message: t('createQuiz.questionContentRequired', 'Vui lòng nhập nội dung câu hỏi') }]}
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder={t('createQuiz.questionContentPlaceholder', 'Nhập nội dung câu hỏi')}
                        />
                      </Form.Item>

                      <Form.Item
                        key={`${field.key}-timeLimit`}
                        name={[field.name, 'timeLimit']}
                        label={t('createQuiz.questionTimeLimit', 'Thời gian (giây)')}
                        rules={[{ required: true, message: t('createQuiz.questionTimeRequired', 'Vui lòng nhập thời gian') }]}
                      >
                        <Input type="number" placeholder="30" />
                      </Form.Item>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700">{t('createQuiz.answers', 'Đáp án')}</label>
                            <p className="text-xs text-gray-500 mt-1">
                              💡 {t('createQuiz.answerHint', 'Có thể chọn nhiều câu trả lời đúng cho mỗi câu hỏi')}
                            </p>
                          </div>
                          <Button
                            type="dashed"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => addAnswer(questionIndex)}
                          >
                            {t('createQuiz.addAnswer', 'Thêm đáp án')}
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
                                      rules={[{ required: true, message: t('createQuiz.answerRequired', 'Vui lòng nhập đáp án') }]}
                                    >
                                      <Input placeholder={`${t('createQuiz.answer', 'Đáp án')} ${String.fromCharCode(65 + answerIndex)}`} />
                                    </Form.Item>
                                  </div>
                                  
                                  <Button
                                    type={form.getFieldValue(['questions', questionIndex, 'answers', answerIndex, 'isCorrect']) ? 'primary' : 'default'}
                                    onClick={() => toggleCorrectAnswer(questionIndex, answerIndex)}
                                    className="min-w-[100px]"
                                  >
                                    {form.getFieldValue(['questions', questionIndex, 'answers', answerIndex, 'isCorrect']) ? 
                                      t('createQuiz.correct', 'Đúng') : 
                                      t('createQuiz.incorrect', 'Sai')
                                    }
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

export default CreateQuiz;
