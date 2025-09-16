import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "../../components/UserNavbar";
import Header from "../../components/Header";

const UserApp = () => {
  return (
    <div className="min-h-screen bg-white">
      <UserNavbar />
      <Header />
      <div className="pl-64">
        <main className="max-w-6xl mx-auto px-8 py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserApp;
