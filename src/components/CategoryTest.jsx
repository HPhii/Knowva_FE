import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  getCategoryName, 
  getCategoryNameByCategoryName, 
  getCategoryNameSmart,
  BLOG_CATEGORIES 
} from '../utils/blogCategories';

const CategoryTest = () => {
  const { t } = useTranslation();

  // Test data
  const testCases = [
    { type: 'categoryId', value: 1, expected: 'Study Skills' },
    { type: 'categoryId', value: 2, expected: 'Flashcard & Quiz Tips' },
    { type: 'categoryId', value: 3, expected: 'Learning Tools' },
    { type: 'categoryId', value: 4, expected: 'Free Resources' },
    { type: 'categoryId', value: 5, expected: 'Memory Science' },
    { type: 'categoryId', value: 6, expected: 'Inspiring Stories' },
    { type: 'categoryName', value: 'SS', expected: 'Study Skills' },
    { type: 'categoryName', value: 'FQ', expected: 'Flashcard & Quiz Tips' },
    { type: 'categoryName', value: 'LT', expected: 'Learning Tools' },
    { type: 'categoryName', value: 'FR', expected: 'Free Resources' },
    { type: 'categoryName', value: 'MS', expected: 'Memory Science' },
    { type: 'categoryName', value: 'IS', expected: 'Inspiring Stories' },
    { type: 'invalid', value: 999, expected: 'Unknown Category' },
    { type: 'invalid', value: 'XX', expected: 'Unknown Category' },
    { type: 'null', value: null, expected: 'Chưa phân loại' },
    { type: 'undefined', value: undefined, expected: 'Chưa phân loại' }
  ];

  const testFunction = (testCase) => {
    let result;
    let functionName;
    
    switch (testCase.type) {
      case 'categoryId':
        result = getCategoryName(testCase.value, t);
        functionName = 'getCategoryName';
        break;
      case 'categoryName':
        result = getCategoryNameByCategoryName(testCase.value, t);
        functionName = 'getCategoryNameByCategoryName';
        break;
      case 'invalid':
      case 'null':
      case 'undefined':
        result = getCategoryNameSmart(testCase.value, t);
        functionName = 'getCategoryNameSmart';
        break;
      default:
        result = getCategoryNameSmart(testCase.value, t);
        functionName = 'getCategoryNameSmart';
    }
    
    return { result, functionName };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Category Mapping Test
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Testing category mapping with both categoryId and categoryName
          </p>
        </div>

        {/* Categories Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Available Categories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BLOG_CATEGORIES.map((category) => (
              <div key={category.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">ID: {category.id}</span>
                  <span className="text-sm text-gray-500">Code: {category.categoryName}</span>
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  {t(category.nameKey)}
                </div>
                <div className="text-sm text-gray-600">
                  {category.nameKey}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Test Results
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Input Value</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Expected</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Actual Result</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Function Used</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {testCases.map((testCase, index) => {
                  const { result, functionName } = testFunction(testCase);
                  const isPassed = result === testCase.expected;
                  
                  return (
                    <tr key={index} className={isPassed ? 'bg-green-50' : 'bg-red-50'}>
                      <td className="border border-gray-200 px-4 py-2 font-medium">
                        {testCase.type}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">
                          {String(testCase.value)}
                        </code>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {testCase.expected}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <span className={isPassed ? 'text-green-600' : 'text-red-600'}>
                          {result}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {functionName}
                        </code>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isPassed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isPassed ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Usage Examples
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">In Components</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm text-gray-700">
{`// Using categoryId
{getCategoryNameSmart(blog.categoryId, t)}

// Using categoryName  
{getCategoryNameSmart(blog.categoryName, t)}

// Smart fallback
{getCategoryNameSmart(blog.categoryId || blog.categoryName, t)}`}
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Database Mapping</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm text-gray-700">
{`// Database field: categoryName
"SS" → "Study Skills"
"FQ" → "Flashcard & Quiz Tips"  
"LT" → "Learning Tools"
"FR" → "Free Resources"
"MS" → "Memory Science"
"IS" → "Inspiring Stories"`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTest;
