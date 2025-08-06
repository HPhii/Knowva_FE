import React from "react";
import { useTranslation } from "react-i18next";

const UserDetails = () => {
  const { t } = useTranslation();

  // Mock user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://via.placeholder.com/100",
    memberDaysLeft: 45,
    plan: "Premium",
    location: "San Francisco, CA",
    bio: "Passionate learner exploring new technologies and concepts through interactive study materials.",
    stats: {
      studySets: 24,
      flashcards: 456,
      hoursStudied: 156,
      testsCompleted: 89,
      averageScore: 87,
      streak: 15
    },
    preferences: {
      language: "English",
      theme: "Light",
      notifications: true,
      autoPlay: false,
      studyReminders: true
    },
    recentActivity: [
      { action: "Completed quiz", subject: "React Fundamentals", time: "2 hours ago" },
      { action: "Created study set", subject: "JavaScript ES6", time: "1 day ago" },
      { action: "Studied flashcards", subject: "CSS Grid Layout", time: "2 days ago" }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">User Details</h1>
          
        </div>



        {/* User Profile Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{userData.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Member days left:</span>
                  <p className="font-medium text-gray-900">{userData.memberDaysLeft} days</p>
                </div>
                <div>
                  <span className="text-gray-500">Plan:</span>
                  <p className="font-medium text-blue-600">{userData.plan}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{userData.stats.flashcards}</div>
            <div className="text-sm text-gray-600">Flashcards</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{userData.stats.testsCompleted}</div>
            <div className="text-sm text-gray-600">Quizzes</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{userData.stats.averageScore}%</div>
            <div className="text-sm text-gray-600">Avg Score</div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <p className="font-medium text-gray-900">{userData.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-medium text-gray-900">{userData.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Member days left</label>
                <p className="font-medium text-gray-900">{userData.memberDaysLeft} days</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Current Plan</label>
                <p className="font-medium text-blue-600">{userData.plan}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Account Status</label>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDetails;