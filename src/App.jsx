import React, { useEffect } from "react"; // Thêm useEffect
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ReactGA from "react-ga4";

const analyticsID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

const App = () => {
  useEffect(() => {
    if (analyticsID) {
      ReactGA.initialize(analyticsID);

      ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname,
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default App;
