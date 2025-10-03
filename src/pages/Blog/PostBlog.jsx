import React, { useState, useRef } from 'react';
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
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { message } from 'antd';

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
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef();
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

    const handleImageUpload = async (file) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error(
                t("imageTypeError") || "You can only upload JPG/PNG files!"
            );
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error(t("imageSizeError") || "Image must be smaller than 2MB!");
            return false;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "SDN_Blog");
            formData.append("cloud_name", "dejilsup7");

            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dejilsup7/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const result = await response.json();
            setFormData(prev => ({ ...prev, imageUrl: result.secure_url }));
            message.success(
                t("imageUploadSuccess") || "Image uploaded successfully!"
            );
        } catch (err) {
            console.error("Upload error:", err);
            message.error(t("imageUploadError") || "Failed to upload image");
        } finally {
            setUploading(false);
        }
        return false; // Prevent default upload behavior
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('postBlog.form.imageUrl')}
                            </label>
                            
                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                {formData.imageUrl ? (
                                    <div className="space-y-4">
                                        <div className="relative inline-block">
                                            <img 
                                                src={formData.imageUrl} 
                                                alt="Preview" 
                                                className="max-w-xs max-h-48 rounded-lg shadow-sm mx-auto"
                                                onError={(e) => e.target.style.display='none'}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {t('postBlog.form.imageUploaded') || 'Ảnh đã được tải lên'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                            <UploadOutlined className="text-2xl text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {t('postBlog.form.dragDropImage') || 'Kéo thả ảnh vào đây hoặc click để chọn'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {t('postBlog.form.imageFormat') || 'JPG, PNG tối đa 2MB'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            await handleImageUpload(file);
                                            e.target.value = ""; // reset input so same file can be selected again
                                        }
                                    }}
                                />
                                
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.click();
                                        }
                                    }}
                                    disabled={uploading}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? (
                                        <span className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {t('postBlog.form.uploading') || 'Đang tải lên...'}
                                        </span>
                                    ) : (
                                        t('postBlog.form.selectImage') || 'Chọn ảnh'
                                    )}
                                </button>
                            </div>
                            
                            {/* Paste URL option */}
                            <div className="mt-4">
                                <details className="group">
                                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                                        {t('postBlog.form.orPasteUrl') || 'Hoặc dán URL ảnh'}
                                    </summary>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            value={formData.imageUrl}
                                            onChange={handleInputChange}
                                            name="imageUrl"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </details>
                            </div>
                        </div>

                        <div className="mb-8">
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('postBlog.form.content')} *
                           </label>
                           <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                               {/* Toolbar */}
                               {editor && (
                                   <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
                                       {/* Bold, Italic, Strike */}
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().toggleBold().run()}
                                           className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                                           title="Bold"
                                       >
                                           <strong>B</strong>
                                       </button>
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().toggleItalic().run()}
                                           className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
                                           title="Italic"
                                       >
                                           <em>I</em>
                                       </button>
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().toggleStrike().run()}
                                           className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
                                           title="Strike"
                                       >
                                           <s>S</s>
                                       </button>
                                       
                                       <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                       
                                       {/* Headings */}
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                           className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
                                           title="Heading 1"
                                       >
                                           H1
                                       </button>
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                           className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
                                           title="Heading 2"
                                       >
                                           H2
                                       </button>
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                           className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
                                           title="Heading 3"
                                       >
                                           H3
                                       </button>
                                       
                                       <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                       
                                       {/* Text Alignment */}
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                           className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
                                           title="Align Left"
                                       >
                                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                               <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                           </svg>
                                       </button>
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                           className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
                                           title="Align Center"
                                       >
                                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                               <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-2 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                           </svg>
                                       </button>
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                           className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
                                           title="Align Right"
                                       >
                                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                               <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                           </svg>
                                       </button>
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                                           className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}`}
                                           title="Justify"
                                       >
                                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                               <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                           </svg>
                                       </button>
                                       
                                       <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                       
                                       {/* Lists */}
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().toggleBulletList().run()}
                                           className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                                           title="Bullet List"
                                       >
                                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                               <path fillRule="evenodd" d="M3 4a1 1 0 000 2h.01a1 1 0 100-2H3zm0 4a1 1 0 000 2h.01a1 1 0 100-2H3zm0 4a1 1 0 000 2h.01a1 1 0 100-2H3zm0 4a1 1 0 000 2h.01a1 1 0 100-2H3zM7 4a1 1 0 000 2h10a1 1 0 100-2H7zm0 4a1 1 0 000 2h10a1 1 0 100-2H7zm0 4a1 1 0 000 2h10a1 1 0 100-2H7zm0 4a1 1 0 000 2h10a1 1 0 100-2H7z" clipRule="evenodd" />
                                           </svg>
                                       </button>
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                           className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                                           title="Numbered List"
                                       >
                                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                               <path fillRule="evenodd" d="M3 4a1 1 0 000 2h.01a1 1 0 100-2H3zm0 4a1 1 0 000 2h.01a1 1 0 100-2H3zm0 4a1 1 0 000 2h.01a1 1 0 100-2H3zm0 4a1 1 0 000 2h.01a1 1 0 100-2H3zM7 4a1 1 0 000 2h10a1 1 0 100-2H7zm0 4a1 1 0 000 2h10a1 1 0 100-2H7zm0 4a1 1 0 000 2h10a1 1 0 100-2H7zm0 4a1 1 0 000 2h10a1 1 0 100-2H7z" clipRule="evenodd" />
                                           </svg>
                                       </button>
                                       
                                       <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                       
                                       {/* Blockquote */}
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                           className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
                                           title="Quote"
                                       >
                                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                               <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V8a1 1 0 112 0v2.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                           </svg>
                                       </button>
                                       
                                       <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                       
                                       {/* Undo/Redo */}
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().undo().run()}
                                           disabled={!editor.can().undo()}
                                           className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                           title="Undo"
                                       >
                                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                               <path fillRule="evenodd" d="M3 10a1 1 0 011-1h8.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                           </svg>
                                       </button>
                                       <button
                                           type="button"
                                           onClick={() => editor.chain().focus().redo().run()}
                                           disabled={!editor.can().redo()}
                                           className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                                           title="Redo"
                                       >
                                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                               <path fillRule="evenodd" d="M17 10a1 1 0 01-1 1H7.414l2.293 2.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H16a1 1 0 011 1z" clipRule="evenodd" />
                                           </svg>
                                       </button>
                                   </div>
                               )}
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