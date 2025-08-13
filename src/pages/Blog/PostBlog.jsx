import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import api from '../../config/axios';
import { getCategoriesForSelect } from '../../utils/blogCategories';

const PostBlog = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        categoryId: '',
        imageUrl: '',
        status: 'DRAFT'
    });
    const [loading, setLoading] = useState(false);
    // Get categories from utility file
    const categories = getCategoriesForSelect(t);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            title: '', excerpt: '', content: '', categoryId: '', imageUrl: '', status: 'DRAFT'
        });
        if (editor) {
            editor.commands.setContent('');
        }
    };

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => { document.body.removeChild(toast); }, 3000);
    };

    const handleSubmit = async (status) => {
        if (!formData.title || !formData.excerpt || !formData.content || !formData.categoryId) {
            showToast(t('postBlog.errors.fillRequiredFields'), 'error');
            return;
        }
        setLoading(true);
        try {
            const submitData = {
                ...formData,
                categoryId: parseInt(formData.categoryId, 10), // This will now use our hardcoded IDs 1-6
                status
            };
            await api.post('/blog/posts', submitData);
            showToast(t('postBlog.success.postCreated'));
            resetForm();
            if (status === 'PENDING_APPROVAL') {
                navigate('/blog');
            }
        } catch (error) {
            console.error('Lỗi khi tạo bài viết:', error);
            showToast(t('postBlog.errors.createFailed'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const editor = useEditor({
        extensions: [ StarterKit, Link, Image, TextAlign.configure({ types: ['heading', 'paragraph'] }), Placeholder.configure({ placeholder: t('postBlog.form.contentPlaceholder') })],
        content: formData.content,
        onUpdate: ({ editor }) => {
            setFormData(prev => ({ ...prev, content: editor.getHTML() }));
        },
    });

    // Update editor content when formData.content changes
    if (editor && formData.content !== editor.getHTML()) {
        editor.commands.setContent(formData.content);
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('postBlog.title')}</h1>
                    <p className="text-gray-600">{t('postBlog.subtitle')}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                    <form onSubmit={(e) => e.preventDefault()}>
                        
                        {/* === CÁC TRƯỜNG INPUT CHO BÀI VIẾT === */}
                        <div className="mb-6">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('postBlog.form.title')} *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder={t('postBlog.form.titlePlaceholder')}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('postBlog.form.excerpt')} *
                            </label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                placeholder={t('postBlog.form.excerptPlaceholder')}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('postBlog.form.category')} *
                            </label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            >
                                <option value="">
                                    {t('postBlog.form.selectCategory')}
                                </option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {t(category.nameKey)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="mb-6">
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('postBlog.form.imageUrl')}
                            </label>
                             <input
                                type="text"
                                id="imageUrl"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="https://example.com/image.jpg"
                            />
                            {formData.imageUrl && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 mb-2">Xem trước ảnh:</p>
                                    <img 
                                        src={formData.imageUrl} 
                                        alt="Preview" 
                                        className="max-w-xs rounded-lg shadow-sm"
                                        onError={(e) => e.target.style.display='none'}
                                        onLoad={(e) => e.target.style.display='block'}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mb-8">
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('postBlog.form.content')} *
                           </label>
                           <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                               <EditorContent editor={editor} className="min-h-[300px] p-4 prose max-w-none focus:outline-none" />
                           </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                             <button
                                type="button"
                                onClick={() => handleSubmit('DRAFT')}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                            >
                                {loading ? t('postBlog.form.saving') : t('postBlog.form.saveDraft')}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSubmit('PENDING_APPROVAL')}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? t('postBlog.form.submitting') : t('postBlog.form.submitForApproval')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostBlog;