// Hardcoded categories with i18n support
// Used across PostBlog, Blog, BlogDetail, BlogCard, and other components

export const BLOG_CATEGORIES = [
  { id: 1, nameKey: 'blog.categories.studySkills', categoryName: 'SS' },
  { id: 2, nameKey: 'blog.categories.flashcardQuizTips', categoryName: 'FQ' },
  { id: 3, nameKey: 'blog.categories.learningTools', categoryName: 'LT' },
  { id: 4, nameKey: 'blog.categories.freeResources', categoryName: 'FR' },
  { id: 5, nameKey: 'blog.categories.memoryScience', categoryName: 'MS' },
  { id: 6, nameKey: 'blog.categories.inspiringStories', categoryName: 'IS' }
];

// Function to get category name by ID
export const getCategoryName = (categoryId, t) => {
  // Handle null/undefined categoryId
  if (!categoryId) {
    return t('blog.categories.uncategorized') || 'Chưa phân loại';
  }
  
  const category = BLOG_CATEGORIES.find(cat => cat.id === categoryId);
  
  if (category) {
    // Try to get translated name, fallback to English if translation fails
    const translatedName = t(category.nameKey);
    if (translatedName && translatedName !== category.nameKey) {
      return translatedName;
    }
    // Fallback to English names if translation is not available
    const englishNames = {
      'blog.categories.studySkills': 'Study Skills',
      'blog.categories.flashcardQuizTips': 'Flashcard & Quiz Tips',
      'blog.categories.learningTools': 'Learning Tools',
      'blog.categories.freeResources': 'Free Resources',
      'blog.categories.memoryScience': 'Memory Science',
      'blog.categories.inspiringStories': 'Inspiring Stories'
    };
    return englishNames[category.nameKey] || category.nameKey;
  }
  
  // Return translated unknown category message
  return t('blog.categories.unknown') || 'Danh mục không xác định';
};

// Smart function that can handle both categoryId and categoryName
export const getCategoryNameSmart = (categoryData, t) => {
  // Handle null/undefined
  if (!categoryData) {
    return t('blog.categories.uncategorized') || 'Chưa phân loại';
  }
  
  let category = null;
  
  // Try to find by categoryId first (number)
  if (typeof categoryData === 'number' || (typeof categoryData === 'string' && !isNaN(categoryData))) {
    category = BLOG_CATEGORIES.find(cat => cat.id === parseInt(categoryData));
  }
  
  // If not found by ID, try to find by categoryName (string like 'SS', 'FQ', etc.)
  if (!category && typeof categoryData === 'string') {
    category = BLOG_CATEGORIES.find(cat => cat.categoryName === categoryData);
  }
  
  if (category) {
    // Try to get translated name, fallback to English if translation fails
    const translatedName = t(category.nameKey);
    if (translatedName && translatedName !== category.nameKey) {
      return translatedName;
    }
    // Fallback to English names if translation is not available
    const englishNames = {
      'blog.categories.studySkills': 'Study Skills',
      'blog.categories.flashcardQuizTips': 'Flashcard & Quiz Tips',
      'blog.categories.learningTools': 'Learning Tools',
      'blog.categories.freeResources': 'Free Resources',
      'blog.categories.memoryScience': 'Memory Science',
      'blog.categories.inspiringStories': 'Inspiring Stories'
    };
    return englishNames[category.nameKey] || category.nameKey;
  }
  
  // Return translated unknown category message
  return t('blog.categories.unknown') || 'Danh mục không xác định';
};

// Function to get category name by categoryName (database field)
export const getCategoryNameByCategoryName = (categoryName, t) => {
  // Handle null/undefined categoryName
  if (!categoryName) {
    return t('blog.categories.uncategorized') || 'Chưa phân loại';
  }
  
  const category = BLOG_CATEGORIES.find(cat => cat.categoryName === categoryName);
  
  if (category) {
    // Try to get translated name, fallback to English if translation fails
    const translatedName = t(category.nameKey);
    if (translatedName && translatedName !== category.nameKey) {
      return translatedName;
    }
    // Fallback to English names if translation is not available
    const englishNames = {
      'blog.categories.studySkills': 'Study Skills',
      'blog.categories.flashcardQuizTips': 'Flashcard & Quiz Tips',
      'blog.categories.learningTools': 'Learning Tools',
      'blog.categories.freeResources': 'Free Resources',
      'blog.categories.memoryScience': 'Memory Science',
      'blog.categories.inspiringStories': 'Inspiring Stories'
    };
    return englishNames[category.nameKey] || category.nameKey;
  }
  
  // Return translated unknown category message
  return t('blog.categories.unknown') || 'Danh mục không xác định';
};

// Function to get category by ID
export const getCategoryById = (categoryId) => {
  return BLOG_CATEGORIES.find(cat => cat.id === categoryId);
};

// Function to get category by categoryName
export const getCategoryByCategoryName = (categoryName) => {
  return BLOG_CATEGORIES.find(cat => cat.categoryName === categoryName);
};

// Function to get all categories with translated names
export const getTranslatedCategories = (t) => {
  return BLOG_CATEGORIES.map(category => ({
    ...category,
    name: t(category.nameKey)
  }));
};

// Function to check if category ID is valid
export const isValidCategoryId = (categoryId) => {
  return BLOG_CATEGORIES.some(cat => cat.id === categoryId);
};

// Function to check if categoryName is valid
export const isValidCategoryName = (categoryName) => {
  return BLOG_CATEGORIES.some(cat => cat.categoryName === categoryName);
};

// Function to get categories for select dropdown (PostBlog)
export const getCategoriesForSelect = (t) => {
  return BLOG_CATEGORIES.map(category => ({
    id: category.id,
    nameKey: category.nameKey,
    categoryName: category.categoryName,
    name: t(category.nameKey)
  }));
};

// Function to get categories for filter buttons (Blog)
export const getCategoriesForFilter = (t) => {
  return [
    { id: null, nameKey: 'blog.categories.all', categoryName: null, name: t('blog.categories.all') },
    ...BLOG_CATEGORIES.map(category => ({
      id: category.id,
      nameKey: category.nameKey,
      categoryName: category.categoryName,
      name: t(category.nameKey)
    }))
  ];
};

