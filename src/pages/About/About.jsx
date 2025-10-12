import React from "react";
import { useTranslation } from "react-i18next";
import CaoKhaImage from "../../assets/images/CaoKha.png";
import HieuPhiImage from "../../assets/images/HieuPhi.png";
import HuuAnImage from "../../assets/images/HuuAn.png";

const About = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: t("about.team.sarah.name"),
      role: t("about.team.sarah.role"),
      image: CaoKhaImage,
      bio: t("about.team.sarah.bio"),
    },
    {
      name: t("about.team.michael.name"),
      role: t("about.team.michael.role"),
      image: HieuPhiImage,
      bio: t("about.team.michael.bio"),
    },
    {
      name: t("about.team.emily.name"),
      role: t("about.team.emily.role"),
      image: HuuAnImage,
      bio: t("about.team.emily.bio"),
    },
  ];

  const stats = [
    { number: "50K+", label: t("about.stats.activeUsers") },
    { number: "1M+", label: t("about.stats.flashcardsCreated") },
    { number: "500K+", label: t("about.stats.quizzesGenerated") },
    { number: "95%", label: t("about.stats.userSatisfaction") },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t("about.heroTitle", "Revolutionizing Learning Through AI")}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t(
              "about.heroSubtitle",
              "KnowVa is on a mission to make learning more effective, engaging, and accessible through intelligent study tools powered by artificial intelligence."
            )}
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t("about.missionTitle", "Our Mission")}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t(
                  "about.missionText",
                  "We believe that every student deserves access to personalized, effective learning tools. By combining the power of artificial intelligence with proven educational methodologies, we create study materials that adapt to individual learning styles and needs."
                )}
              </p>
              <p className="text-lg text-gray-600">
                {t(
                  "about.missionText2",
                  "From flashcards that remember what you struggle with to quizzes that adapt to your knowledge level, KnowVa transforms passive studying into an active, engaging learning experience."
                )}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("about.valuesTitle", "Our Values")}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {t("about.values.innovation")}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {t("about.values.accessibility")}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {t("about.values.dataDriven")}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {t("about.values.privacy")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("about.statsTitle", "KnowVa by the Numbers")}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("about.teamTitle", "Meet Our Team")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t(
                "about.teamSubtitle",
                "The passionate individuals behind KnowVa who are dedicated to transforming education through technology."
              )}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 text-center"
              >
                <img
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                  src={member.image}
                  alt={member.name}
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t("about.storyTitle", "Our Story")}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {t(
              "about.storyText",
              "KnowVa was born from a simple observation: traditional study methods weren't keeping up with the pace of modern learning. Our founder, a former educator, saw students struggling with outdated, one-size-fits-all study materials."
            )}
          </p>
          <p className="text-lg text-gray-600 mb-6">
            {t(
              "about.storyText2",
              "In 2022, we set out to change that. By combining cutting-edge AI technology with proven educational research, we created a platform that adapts to each learner's unique needs and learning style."
            )}
          </p>
          <p className="text-lg text-gray-600">
            {t(
              "about.storyText3",
              "Today, KnowVa serves thousands of students worldwide, helping them study smarter, not harder. Our commitment to innovation and accessibility drives everything we do."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
