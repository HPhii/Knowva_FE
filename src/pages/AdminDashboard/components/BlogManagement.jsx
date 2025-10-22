import React, { useState, useEffect, useRef } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag,
  Drawer,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Modal,
  Image,
  Card,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  FontSizeOutlined,
  HighlightOutlined,
  LinkOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  UndoOutlined,
  RedoOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Strike from '@tiptap/extension-strike';
import api from '../../../config/axios';

const { Option } = Select;
const { TextArea } = Input;

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [form] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [blogDetail, setBlogDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [categoryForm] = Form.useForm();
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editCategoryModalVisible, setEditCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryForm] = Form.useForm();
  
  // Blog creation form state
  const [createBlogForm] = Form.useForm();
  const [createBlogLoading, setCreateBlogLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef();
  
  // Refs for form fields to enable scrolling to error
  const titleInputRef = useRef();
  const excerptInputRef = useRef();
  const categorySelectRef = useRef();
  const contentEditorRef = useRef();
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categoryId: '',
    imageUrl: '',
    status: 'DRAFT'
  });

  useEffect(() => {
    fetchBlogs(pagination.current, pagination.pageSize);
    fetchCategories();
  }, [pagination.current, pagination.pageSize]);

  /**
   * 📝 Fetch blogs from API with pagination
   * @param {number} page - Page number (1-based)
   * @param {number} size - Page size
   */
  const fetchBlogs = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      // 📋 Prepare API parameters
      const params = {
        page: page - 1, // API expects 0-based page
        size: size,
      };

      // 🔗 API Call: GET /blog/admin/posts with pagination
      const response = await api.get(`/blog/admin/posts`, { params });
      
      console.log('📊 Blog API Response:', response.data);
      
      // 📊 Process API response with fallback handling
      let posts, totalElements, currentPage;
      
      if (response.data) {
        // Handle different API response formats
        if (response.data.posts) {
          // Format: { posts: [...], totalElements: 100, currentPage: 0 }
          ({ posts, totalElements, currentPage } = response.data);
        } else if (response.data.content) {
          // Format: { content: [...], totalElements: 100, number: 0 }
          posts = response.data.content;
          totalElements = response.data.totalElements;
          currentPage = response.data.number;
        } else if (Array.isArray(response.data)) {
          // Format: direct array
          posts = response.data;
          totalElements = response.data.length;
          currentPage = 0;
        } else {
          // Fallback
          posts = [];
          totalElements = 0;
          currentPage = 0;
        }
      } else {
        posts = [];
        totalElements = 0;
        currentPage = 0;
      }
      
      console.log('📊 Processed blog data:', { posts: posts?.length, totalElements, currentPage });
      
      // 💾 Update state with fetched data (fallback to empty array if no data)
      setBlogs(posts || []);
      setPagination(prev => ({
        ...prev,
        total: totalElements || 0,
        current: (currentPage || 0) + 1 // API trả 0-based, UI dùng 1-based
      }));
    } catch (error) {
      console.error('❌ Error fetching blogs:', error);
      message.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };
  

  /**
   * 🔍 Fetch detailed blog information by ID
   * @param {number} id - Blog ID
   */
  const fetchBlogDetail = async (id) => {
    setDetailLoading(true);
    try {
      // 🔗 API Call: GET /blog/posts/{id}
      const response = await api.get(`/blog/posts/${id}`);
      
      // 📊 Extract blog data from API response
      // ✅ Handle both response formats: { post: {...} } or direct data
      const blog = response.data.post || response.data;
      
      // 💾 Update state and show modal
      setBlogDetail(blog);
      setDetailModalVisible(true);
    } catch (error) {
      console.error('❌ Error fetching blog detail:', error);
      message.error('Failed to fetch blog details');
    } finally {
      setDetailLoading(false);
    }
  };

  // TipTap editor for blog content
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink,
      TiptapImage,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Nhập nội dung bài viết...' }),
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      Superscript,
      Subscript,
      Strike
    ],
    content: blogFormData.content,
    onUpdate: ({ editor }) => {
      setBlogFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Update editor content when blogFormData.content changes
  if (editor && blogFormData.content !== editor.getHTML()) {
    editor.commands.setContent(blogFormData.content);
  }

  // Clear content validation error when user types in editor
  useEffect(() => {
    if (editor) {
      const handleUpdate = () => {
        if (validationErrors.content && blogFormData.content?.trim()) {
          setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.content;
            return newErrors;
          });
        }
      };
      editor.on('update', handleUpdate);
      return () => {
        editor.off('update', handleUpdate);
      };
    }
  }, [editor, validationErrors.content, blogFormData.content]);

  const handleCreateBlog = () => {
    setEditingBlog(null);
    resetBlogForm();
    setDrawerVisible(true);
  };

  const handleEditBlog = async (blog) => {
    try {
      setLoading(true);
      // Fetch full blog details
      const response = await api.get(`/blog/posts/${blog.id}`);
      const blogData = response.data.post || response.data;
      
      setEditingBlog(blogData);
      
      // Set form data for editing
      setBlogFormData({
        title: blogData.title || '',
        excerpt: blogData.excerpt || '',
        content: blogData.content || '',
        categoryId: blogData.categoryId || blogData.category?.id || '',
        imageUrl: blogData.imageUrl || '',
        status: blogData.status || 'DRAFT'
      });
      
      setDrawerVisible(true);
    } catch (error) {
      console.error('Error fetching blog for edit:', error);
      message.error('Không thể tải thông tin blog');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🗑️ Delete blog by ID
   * @param {number} blogId - Blog ID to delete
   */
  const handleDeleteBlog = async (blogId) => {
    try {
      // 🔗 API Call: DELETE /blog/posts/{id}
      await api.delete(`/blog/posts/${blogId}`);
      message.success('Xóa bài viết thành công');
      
      // 🔄 Reload blog list after successful deletion
      fetchBlogs(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('❌ Error deleting blog:', error);
      message.error('Xóa bài viết thất bại');
    }
  };

  const handleViewBlog = (blog) => {
    fetchBlogDetail(blog.id);
  };

  const handleTableChange = (paginationInfo) => {
    setPagination(prev => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize
    }));
    // useEffect will automatically fetch blogs when pagination changes
  };

  /**
   * 📝 Update blog status (PUBLISHED/REJECTED)
   * @param {number} blogId - Blog ID
   * @param {string} status - New status (PUBLISHED/REJECTED)
   */
  const handleUpdateBlogStatus = async (blogId, status) => {
    try {
      // 🔗 API Call: PUT /blog/admin/posts/{id}/status
      await api.put(`/blog/admin/posts/${blogId}/status`, { status });
      message.success("Blog status updated successfully");
      setDetailModalVisible(false);
      
      // 🔄 Reload blog list after successful update
      fetchBlogs(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('❌ Error updating blog status:', error);
      message.error("Failed to update blog status");
    }
  };

  /**
   * 📂 Fetch all blog categories
   */
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      // 🔗 API Call: GET /blog/categories
      const response = await api.get('/blog/categories');
      
      // 💾 Update categories state (fallback to empty array if no data)
      setCategories(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      message.error('Không thể tải danh sách categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  /**
   * ➕ Create new blog category
   * @param {Object} values - Form values containing category name
   */
  const handleCreateCategory = async (values) => {
    setCategoryLoading(true);
    try {
      // 🔗 API Call: POST /blog/admin/categories
      await api.post('/blog/admin/categories', { name: values.name });
      message.success('Tạo thành công');
      
      // 🧹 Reset form and close modal
      categoryForm.resetFields();
      setCategoryModalVisible(false);
      
      // 🔄 Reload categories list
      fetchCategories();
    } catch (error) {
      console.error('❌ Error creating category:', error);
      message.error('Tạo thất bại');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleOpenCategoryModal = () => {
    categoryForm.resetFields();
    setCategoryModalVisible(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    editCategoryForm.setFieldsValue({
      name: category.name
    });
    setEditCategoryModalVisible(true);
  };

  /**
   * ✏️ Update existing blog category
   * @param {Object} values - Form values containing updated category name
   */
  const handleUpdateCategory = async (values) => {
    setCategoryLoading(true);
    try {
      // 🔗 API Call: PUT /blog/admin/categories/{id}
      await api.put(`/blog/admin/categories/${editingCategory.id}`, { name: values.name });
      message.success('Cập nhật thành công');
      
      // 🧹 Reset form and close modal
      editCategoryForm.resetFields();
      setEditCategoryModalVisible(false);
      setEditingCategory(null);
      
      // 🔄 Reload categories list
      fetchCategories();
    } catch (error) {
      console.error('❌ Error updating category:', error);
      message.error('Cập nhật thất bại');
    } finally {
      setCategoryLoading(false);
    }
  };

  /**
   * 💾 Handle blog form submission (Create/Update)
   * @param {Object} values - Form values
   */
  const handleSubmit = async (values) => {
    try {
      if (editingBlog) {
        // ✏️ Update existing blog (Mock implementation)
        setBlogs(blogs.map(blog => 
          blog.id === editingBlog.id ? { ...blog, ...values } : blog
        ));
        message.success('Blog updated successfully');
      } else {
        // ➕ Add new blog (Mock implementation - TODO: Replace with actual API call)
        const newBlog = {
          id: Date.now(), // 🎭 Mock ID generation
          ...values,
          date: new Date().toISOString().split('T')[0] // 🎭 Mock date
        };
        setBlogs([newBlog, ...blogs]);
        message.success('Blog created successfully');
      }
      setDrawerVisible(false);
    } catch (error) {
      message.error('Failed to save blog');
    }
  };

  /**
   * 📝 Create new blog with API call
   * @param {string} status - Blog status (DRAFT or PENDING_APPROVAL)
   */
  const handleCreateBlogSubmit = async (status) => {
    // Validate required fields
    const errors = {};
    if (!blogFormData.title?.trim()) {
      errors.title = 'Vui lòng nhập tiêu đề bài viết';
    }
    if (!blogFormData.excerpt?.trim()) {
      errors.excerpt = 'Vui lòng nhập tóm tắt bài viết';
    }
    if (!blogFormData.content?.trim()) {
      errors.content = 'Vui lòng nhập nội dung bài viết';
    }
    if (!blogFormData.categoryId) {
      errors.categoryId = 'Vui lòng chọn danh mục';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      message.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    setCreateBlogLoading(true);
    try {
      const submitData = {
        ...blogFormData,
        categoryId: parseInt(blogFormData.categoryId, 10),
        status
      };

      // 🔗 API Call: POST /blog/posts
      await api.post('/blog/posts', submitData);
      
      message.success('Tạo bài viết thành công');
      
      // 🧹 Reset form and close drawer
      resetBlogForm();
      setDrawerVisible(false);
      
      // 🔄 Reload blog list
      fetchBlogs(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('❌ Error creating blog:', error);
      message.error('Tạo bài viết thất bại');
    } finally {
      setCreateBlogLoading(false);
    }
  };

  /**
   * 🧹 Reset blog creation form
   */
  const resetBlogForm = () => {
    setBlogFormData({
      title: '',
      excerpt: '',
      content: '',
      categoryId: '',
      imageUrl: '',
      status: 'DRAFT'
    });
    setValidationErrors({});
    createBlogForm.resetFields();
    if (editor) {
      editor.commands.setContent('');
    }
  };

  /**
   * 📝 Update existing blog
   * @param {string} status - Blog status
   */
  const handleUpdateBlog = async (status) => {
    // Validate required fields
    const errors = {};
    if (!blogFormData.title?.trim()) {
      errors.title = 'Vui lòng nhập tiêu đề bài viết';
    }
    if (!blogFormData.excerpt?.trim()) {
      errors.excerpt = 'Vui lòng nhập tóm tắt bài viết';
    }
    if (!blogFormData.content?.trim()) {
      errors.content = 'Vui lòng nhập nội dung bài viết';
    }
    if (!blogFormData.categoryId) {
      errors.categoryId = 'Vui lòng chọn danh mục';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      message.error('Vui lòng điền đầy đủ các trường bắt buộc');
      
      // Scroll to first error field
      setTimeout(() => {
        if (errors.title && titleInputRef.current) {
          titleInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          titleInputRef.current.focus();
        } else if (errors.excerpt && excerptInputRef.current) {
          excerptInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          excerptInputRef.current.focus();
        } else if (errors.categoryId && categorySelectRef.current) {
          categorySelectRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (errors.content && contentEditorRef.current) {
          contentEditorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      return;
    }

    setCreateBlogLoading(true);
    try {
      const submitData = {
        title: blogFormData.title?.trim() || '',
        excerpt: blogFormData.excerpt?.trim() || '',
        content: blogFormData.content || '',
        categoryId: parseInt(blogFormData.categoryId, 10),
        imageUrl: blogFormData.imageUrl || '',
        status: status || 'DRAFT'
      };

      // 🔗 API Call: PUT /blog/posts/{id}
      await api.put(`/blog/posts/${editingBlog.id}`, submitData);
      
      message.success('Cập nhật blog thành công');
      
      // 🧹 Reset form and close drawer
      resetBlogForm();
      setDrawerVisible(false);
      setEditingBlog(null);
      
      // 🔄 Reload blog list
      fetchBlogs(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('❌ Error updating blog:', error);
      message.error('Cập nhật blog thất bại');
    } finally {
      setCreateBlogLoading(false);
    }
  };

  /**
   * 📝 Handle input change for blog form
   * @param {Event} e - Input change event
   */
  const handleBlogInputChange = (e) => {
    const { name, value } = e.target;
    setBlogFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * 📤 Handle image upload to Cloudinary
   * @param {File} file - Image file to upload
   */
  const handleImageUpload = async (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
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
      setBlogFormData(prev => ({ ...prev, imageUrl: result.secure_url }));
      message.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      message.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
    return false;
  };

  /**
   * 🛠️ Editor Toolbar Component
   */
  const EditorToolbar = () => {
    if (!editor) return null;

    return (
      <div style={{
        border: '1px solid #d9d9d9',
        borderBottom: 'none',
        borderTopLeftRadius: '6px',
        borderTopRightRadius: '6px',
        padding: '8px 12px',
        backgroundColor: '#fafafa',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        alignItems: 'center'
      }}>
        {/* Text Formatting */}
        <div style={{ display: 'flex', gap: '2px', marginRight: '8px' }}>
          <Button
            type={editor.isActive('bold') ? 'primary' : 'text'}
            size="small"
            icon={<BoldOutlined />}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="In đậm (Ctrl+B)"
          />
          <Button
            type={editor.isActive('italic') ? 'primary' : 'text'}
            size="small"
            icon={<ItalicOutlined />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="In nghiêng (Ctrl+I)"
          />
          <Button
            type={editor.isActive('underline') ? 'primary' : 'text'}
            size="small"
            icon={<UnderlineOutlined />}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Gạch chân (Ctrl+U)"
          />
          <Button
            type={editor.isActive('strike') ? 'primary' : 'text'}
            size="small"
            icon={<StrikethroughOutlined />}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          />
        </div>

        {/* Text Alignment */}
        <div style={{ display: 'flex', gap: '2px', marginRight: '8px' }}>
          <Button
            type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'text'}
            size="small"
            icon={<AlignLeftOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Align Left"
          />
          <Button
            type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'text'}
            size="small"
            icon={<AlignCenterOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Align Center"
          />
          <Button
            type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'text'}
            size="small"
            icon={<AlignRightOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Align Right"
          />
          <Button
            type={editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'text'}
            size="small"
            icon={<MenuOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            title="Justify"
          />
        </div>

        {/* Headings */}
        <div style={{ display: 'flex', gap: '2px', marginRight: '8px' }}>
          <Select
            size="small"
            style={{ width: 120 }}
            placeholder="Font Size"
            value={editor.getAttributes('heading').level ? `h${editor.getAttributes('heading').level}` : 'p'}
            onChange={(value) => {
              if (value === 'p') {
                editor.chain().focus().setParagraph().run();
              } else {
                const level = parseInt(value.replace('h', ''));
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }}
          >
            <Option value="p">Đoạn văn</Option>
            <Option value="h1">Tiêu đề 1</Option>
            <Option value="h2">Tiêu đề 2</Option>
            <Option value="h3">Tiêu đề 3</Option>
            <Option value="h4">Tiêu đề 4</Option>
          </Select>
        </div>

        {/* Lists */}
        <div style={{ display: 'flex', gap: '2px', marginRight: '8px' }}>
          <Button
            type={editor.isActive('bulletList') ? 'primary' : 'text'}
            size="small"
            icon={<UnorderedListOutlined />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bulleted List"
          />
          <Button
            type={editor.isActive('orderedList') ? 'primary' : 'text'}
            size="small"
            icon={<OrderedListOutlined />}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          />
        </div>

        {/* Colors */}
        <div style={{ display: 'flex', gap: '2px', marginRight: '8px' }}>
          <Select
            size="small"
            style={{ width: 100 }}
            placeholder="Text Color"
            value={editor.getAttributes('textStyle').color || '#000000'}
            onChange={(color) => editor.chain().focus().setColor(color).run()}
          >
            <Option value="#000000">Đen</Option>
            <Option value="#ff0000">Đỏ</Option>
            <Option value="#00ff00">Xanh lá</Option>
            <Option value="#0000ff">Xanh dương</Option>
            <Option value="#ffa500">Cam</Option>
            <Option value="#800080">Tím</Option>
            <Option value="#ffc0cb">Hồng</Option>
          </Select>
        </div>

        {/* Highlight */}
        <div style={{ display: 'flex', gap: '2px', marginRight: '8px' }}>
          <Button
            type={editor.isActive('highlight') ? 'primary' : 'text'}
            size="small"
            icon={<HighlightOutlined />}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            title="Highlight Text"
          />
        </div>

        {/* Undo/Redo */}
        <div style={{ display: 'flex', gap: '2px', marginLeft: 'auto' }}>
          <Button
            type="text"
            size="small"
            icon={<UndoOutlined />}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Hoàn tác (Ctrl+Z)"
          />
          <Button
            type="text"
            size="small"
            icon={<RedoOutlined />}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Làm lại (Ctrl+Y)"
          />
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'PENDING_APPROVAL': return 'processing';
      case 'PUBLISHED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const getStatusDisplayText = (status) => {
    switch (status) {
      case 'DRAFT': return 'Draft';
      case 'PENDING_APPROVAL': return 'Pending Approval';
      case 'PUBLISHED': return 'Published';
      case 'REJECTED': return 'Rejected';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const categoryColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name) => (
        <div style={{ fontWeight: 500, color: '#262626' }}>
          {name}
        </div>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => (
        <code style={{ 
          padding: '2px 6px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '3px',
          fontSize: '12px'
        }}>
          {slug}
        </code>
      ),
    },
    {
      title: 'Post Count',
      dataIndex: 'postCount',
      key: 'postCount',
      width: 120,
      sorter: (a, b) => (a.postCount || 0) - (b.postCount || 0),
      render: (count) => (
        <Tag color="blue">
          {count || 0} posts
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />}
            size="small"
            title="Edit"
            onClick={() => handleEditCategory(record)}
          />
        </Space>
      ),
    },
  ];

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title) => (
        <div>
          <div style={{ fontWeight: 500, color: '#262626', marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#8c8c8c',
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {blogs.find(b => b.title === title)?.excerpt}
          </div>
        </div>
      ),
    },
    {
      title: 'Author',
      dataIndex: 'authorName',
      key: 'authorName',
      sorter: (a, b) => a.authorName.localeCompare(b.authorName),
      render: (authorName) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <span>{authorName}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Draft', value: 'DRAFT' },
        { text: 'Pending Approval', value: 'PENDING_APPROVAL' },
        { text: 'Published', value: 'PUBLISHED' },
        { text: 'Rejected', value: 'REJECTED' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusDisplayText(status)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            size="small"
            title="View"
            onClick={() => handleViewBlog(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            size="small"
            title="Edit"
            onClick={() => handleEditBlog(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác."
            onConfirm={() => handleDeleteBlog(record.id)}
            okText="Confirm"
            cancelText="Cancel"
            okType="danger"
          >
            <Button 
              type="text" 
              icon={<DeleteOutlined />}
              size="small"
              danger
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header with Create Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#262626' }}>Blog Management</h2>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>
            Manage blog posts and content
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreateBlog}
          size="large"
        >
          Create Blog
        </Button>
      </div>

      {/* Blogs Table */}
      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} blogs`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
        style={{
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      />

      {/* Category Management Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '24px',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#262626' }}>Category Management</h2>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>
            Manage blog categories
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleOpenCategoryModal}
          size="large"
        >
          Tạo Category
        </Button>
      </div>

      {/* Categories Table */}
      <Table
        columns={categoryColumns}
        dataSource={categories}
        rowKey="id"
        loading={categoriesLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} categories`,
        }}
        scroll={{ x: 600 }}
        style={{
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      />

      {/* Create/Edit Blog Drawer */}
      <Drawer
        title={editingBlog ? 'Chỉnh sửa Blog' : 'Create New Blog'}
        width={800}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setEditingBlog(null);
          resetBlogForm();
        }}
        footer={null}
        style={{ zIndex: 1000 }}
      >
        {/* Both Create and Edit use same form now */}
        {(editingBlog || !editingBlog) && (
          // Create Blog Form (Full version like PostBlog)
          <div style={{ padding: '0 8px' }}>
            <Form
              form={createBlogForm}
              layout="vertical"
              onFinish={(e) => e.preventDefault()}
            >
              {/* Title */}
              <Form.Item
                label={<span>Tiêu đề bài viết <span style={{ color: '#ff4d4f' }}>*</span></span>}
                validateStatus={validationErrors.title ? 'error' : ''}
                help={validationErrors.title}
              >
                <Input
                  ref={titleInputRef}
                  name="title"
                  value={blogFormData.title}
                  onChange={handleBlogInputChange}
                  placeholder="Nhập tiêu đề bài viết..."
                  size="large"
                  status={validationErrors.title ? 'error' : ''}
                />
              </Form.Item>

              {/* Excerpt */}
              <Form.Item
                label={<span>Tóm tắt bài viết <span style={{ color: '#ff4d4f' }}>*</span></span>}
                validateStatus={validationErrors.excerpt ? 'error' : ''}
                help={validationErrors.excerpt}
              >
                <TextArea
                  ref={excerptInputRef}
                  name="excerpt"
                  value={blogFormData.excerpt}
                  onChange={handleBlogInputChange}
                  rows={3}
                  placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
                  style={{ resize: 'none' }}
                  status={validationErrors.excerpt ? 'error' : ''}
                />
              </Form.Item>

              {/* Category */}
              <Form.Item
                label={<span>Danh mục <span style={{ color: '#ff4d4f' }}>*</span></span>}
                validateStatus={validationErrors.categoryId ? 'error' : ''}
                help={validationErrors.categoryId}
              >
                <div ref={categorySelectRef}>
                  <Select
                    name="categoryId"
                    value={blogFormData.categoryId}
                    onChange={(value) => {
                      setBlogFormData(prev => ({ ...prev, categoryId: value }));
                      if (validationErrors.categoryId) {
                        setValidationErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.categoryId;
                          return newErrors;
                        });
                      }
                    }}
                    placeholder="Select blog category"
                    size="large"
                    status={validationErrors.categoryId ? 'error' : ''}
                  >
                    {categories.map(category => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Form.Item>

              {/* Image Upload */}
              <Form.Item
                label="Ảnh bìa"
              >
                <div style={{
                  border: '2px dashed #d9d9d9',
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  transition: 'border-color 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#40a9ff'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d9d9d9'}
                >
                  {blogFormData.imageUrl ? (
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img 
                          src={blogFormData.imageUrl} 
                          alt="Preview" 
                          style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                          }}
                          onError={(e) => e.target.style.display='none'}
                          onDoubleClick={() => setShowImageModal(true)}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBlogFormData(prev => ({ ...prev, imageUrl: '' }));
                          }}
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#ff4d4f',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <p style={{ marginTop: '12px', fontSize: '12px', color: '#8c8c8c' }}>
                        Ảnh đã được tải lên • Nhấp đúp để xem lớn
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 16px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg style={{ width: '32px', height: '32px', color: '#8c8c8c' }} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                        </svg>
                      </div>
                      <p style={{ fontSize: '14px', color: '#595959', marginBottom: '8px' }}>
                        Kéo thả ảnh vào đây hoặc click để chọn
                      </p>
                      <p style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        JPG, PNG tối đa 2MB
                      </p>
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
                        e.target.value = "";
                      }
                    }}
                  />
                  
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                    loading={uploading}
                    style={{ marginTop: '16px' }}
                  >
                    {uploading ? 'Đang tải lên...' : (blogFormData.imageUrl ? 'Đổi ảnh' : 'Chọn ảnh')}
                  </Button>
                </div>
                
                {/* Paste URL option */}
                <details style={{ marginTop: '12px' }}>
                  <summary style={{
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#8c8c8c',
                    userSelect: 'none'
                  }}>
                    Hoặc dán URL ảnh
                  </summary>
                  <Input
                    name="imageUrl"
                    value={blogFormData.imageUrl}
                    onChange={handleBlogInputChange}
                    placeholder="https://example.com/image.jpg"
                    style={{ marginTop: '8px' }}
                  />
                </details>
              </Form.Item>

              {/* Content Editor */}
              <Form.Item
                label={<span>Nội dung bài viết <span style={{ color: '#ff4d4f' }}>*</span></span>}
                validateStatus={validationErrors.content ? 'error' : ''}
                help={validationErrors.content}
              >
                <div 
                  ref={contentEditorRef}
                  style={{ 
                    border: validationErrors.content ? '1px solid #ff4d4f' : '1px solid #d9d9d9', 
                    borderRadius: '6px',
                    minHeight: '300px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Editor Toolbar */}
                  <EditorToolbar />
                  
                  {/* Editor Content */}
                  <div style={{ 
                    padding: '12px',
                    minHeight: '280px',
                    borderTop: '1px solid #d9d9d9'
                  }}>
                    <EditorContent 
                      editor={editor} 
                      style={{ 
                        minHeight: '280px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </Form.Item>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                paddingTop: '24px', 
                borderTop: '1px solid #f0f0f0',
                marginTop: '24px'
              }}>
                <Button 
                  onClick={() => {
                    setDrawerVisible(false);
                    setEditingBlog(null);
                    resetBlogForm();
                  }}
                  size="large"
                  style={{ flex: 1 }}
                >
                  Hủy
                </Button>
                {editingBlog ? (
                  // Edit mode buttons
                  <>
                    <Button 
                      onClick={() => handleUpdateBlog('DRAFT')}
                      loading={createBlogLoading}
                      size="large"
                      style={{ flex: 1, backgroundColor: '#6c757d', borderColor: '#6c757d', color: 'white' }}
                    >
                      {createBlogLoading ? 'Đang lưu...' : 'Lưu bản nháp'}
                    </Button>
                    <Button 
                      type="primary"
                      onClick={() => handleUpdateBlog('PUBLISHED')}
                      loading={createBlogLoading}
                      size="large"
                      style={{ flex: 1 }}
                    >
                      {createBlogLoading ? 'Đang cập nhật...' : 'Cập nhật & Xuất bản'}
                    </Button>
                  </>
                ) : (
                  // Create mode buttons
                  <>
                    <Button 
                      onClick={() => handleCreateBlogSubmit('DRAFT')}
                      loading={createBlogLoading}
                      size="large"
                      style={{ flex: 1, backgroundColor: '#6c757d', borderColor: '#6c757d', color: 'white' }}
                    >
                      {createBlogLoading ? 'Đang lưu...' : 'Lưu bản nháp'}
                    </Button>
                    <Button 
                      type="primary"
                      onClick={() => handleCreateBlogSubmit('PENDING_APPROVAL')}
                      loading={createBlogLoading}
                      size="large"
                      style={{ flex: 1 }}
                    >
                      {createBlogLoading ? 'Đang gửi...' : 'Gửi để duyệt'}
                    </Button>
                  </>
                )}
              </div>
            </Form>
          </div>
        )}
      </Drawer>

      {/* Blog Detail Modal */}
      <Modal
        title="Blog Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button 
            key="published" 
            type="primary"
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            onClick={() => handleUpdateBlogStatus(blogDetail.id, 'PUBLISHED')}
          >
            PUBLISHED
          </Button>,
          <Button 
            key="rejected" 
            danger
            onClick={() => handleUpdateBlogStatus(blogDetail.id, 'REJECTED')}
          >
            REJECTED
          </Button>,
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
        loading={detailLoading}
      >
        {blogDetail && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Image */}
            {blogDetail.imageUrl && (
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <Image
                  src={blogDetail.imageUrl}
                  alt={blogDetail.title}
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Title */}
            <h2 style={{ 
              marginBottom: '16px', 
              color: '#262626',
              fontSize: '24px',
              fontWeight: '600'
            }}>
              {blogDetail.title}
            </h2>

            {/* Meta Information */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '16px', 
              marginBottom: '20px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '6px'
            }}>
              <div>
                <strong>Author:</strong> {blogDetail.authorName}
              </div>
              <div>
                <strong>Published:</strong> {formatDate(blogDetail.publishedAt)}
              </div>
              <div>
                <strong>Status:</strong> 
                <Tag 
                  color={getStatusColor(blogDetail.status)} 
                  style={{ marginLeft: '8px' }}
                >
                  {getStatusDisplayText(blogDetail.status)}
                </Tag>
              </div>
              {blogDetail.categoryName && (
                <div>
                  <strong>Category:</strong> {blogDetail.categoryName}
                </div>
              )}
              {blogDetail.readTime && (
                <div>
                  <strong>Read Time:</strong> {blogDetail.readTime} min
                </div>
              )}
            </div>

            {/* Slug */}
            {blogDetail.slug && (
              <div style={{ marginBottom: '16px' }}>
                <strong>Slug:</strong> 
                <code style={{ 
                  marginLeft: '8px', 
                  padding: '2px 6px', 
                  backgroundColor: '#f0f0f0', 
                  borderRadius: '3px',
                  fontSize: '12px'
                }}>
                  {blogDetail.slug}
                </code>
              </div>
            )}

            {/* Excerpt */}
            {blogDetail.excerpt && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '8px', color: '#262626' }}>Excerpt</h4>
                <p style={{ 
                  color: '#595959', 
                  lineHeight: '1.6',
                  fontStyle: 'italic',
                  backgroundColor: '#fafafa',
                  padding: '12px',
                  borderRadius: '6px',
                  borderLeft: '4px solid #1890ff'
                }}>
                  {blogDetail.excerpt}
                </p>
              </div>
            )}

            {/* Content */}
            {blogDetail.content && (
              <div>
                <h4 style={{ marginBottom: '12px', color: '#262626' }}>Content</h4>
                <div 
                  style={{ 
                    color: '#262626', 
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap'
                  }}
                  dangerouslySetInnerHTML={{ __html: blogDetail.content }}
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Category Modal */}
      <Modal
        title="Create New Category"
        open={categoryModalVisible}
        onCancel={() => setCategoryModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={categoryForm}
          layout="vertical"
          onFinish={handleCreateCategory}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Vui lòng nhập tên category' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setCategoryModalVisible(false)}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={categoryLoading}
              >
                Tạo Category
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        open={editCategoryModalVisible}
        onCancel={() => setEditCategoryModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={editCategoryForm}
          layout="vertical"
          onFinish={handleUpdateCategory}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Vui lòng nhập tên category' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setEditCategoryModalVisible(false)}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={categoryLoading}
              >
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EyeOutlined style={{ color: '#1890ff' }} />
            <span>Xem ảnh</span>
          </div>
        }
        open={showImageModal}
        onCancel={() => setShowImageModal(false)}
        footer={null}
        width="auto"
        centered
        style={{ maxWidth: '90vw', maxHeight: '90vh' }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <img 
            src={blogFormData.imageUrl} 
            alt="Preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '70vh', 
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default BlogManagement;