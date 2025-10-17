import React from "react";
import tabBarIcon from "../assets/images/tabBarIcon.png";
import tabBarIcon2 from "../assets/images/tabBarIcon2.png";
// import tabBarIcon3 from "../assets/images/tabBarIcon4.png";

const DogWalkLoading = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[300px] h-[300px]">
        <img
          src={tabBarIcon2}
          alt="tabBarIcon"
          className="w-[200px] h-[200px] absolute"
          style={{
            animation: "rainbowMove 3s ease-in-out infinite",
          }}
        />
      </div>
      <style jsx>{`
        @keyframes rainbowMove {
          0% {
            transform: translateX(0px) translateY(0px);
          }
          25% {
            transform: translateX(100px) translateY(-50px);
          }
          //   50% {
          //     transform: translateX(0px) translateY(-100px);
          //   }
          //   75% {
          //     transform: translateX(-100px) translateY(-50px);
          //   }
          //   100% {
          //     transform: translateX(0px) translateY(0px);
          //   }
        }
      `}</style>
    </div>
  );
};

export default DogWalkLoading;
