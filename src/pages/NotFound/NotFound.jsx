import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
    const { t } = useTranslation();

    return (
        <div className="notfound-container">
            <div className="container">
                <div className="moon"></div>
                <div className="moon__crater moon__crater1"></div>
                <div className="moon__crater moon__crater2"></div>
                <div className="moon__crater moon__crater3"></div>

                <div className="star star1"></div>
                <div className="star star2"></div>
                <div className="star star3"></div>
                <div className="star star4"></div>
                <div className="star star5"></div>

                <div className="error">
                    <div className="error__title">404</div>
                    <div className="error__subtitle">{t('notFound.subtitle', 'Oops! Page Not Found.')}</div>
                    <div className="error__description">{t('notFound.description', 'The page you are looking for might have been removed.')}</div>
                    <Link to="/" className="error__button error__button--active">
                        {t('notFound.goHome', 'GO HOME')}
                    </Link>
                </div>

                <div className="shiba">
                    <div className="shiba__tail"></div>
                    <div className="shiba__backpack"></div>
                    <div className="shiba__body"></div>
                    <div className="shiba__body__chest"></div>
                    <div className="shiba__arm-left1"></div>
                    <div className="shiba__arm-left2"></div>
                    <div className="shiba__arm-right1"></div>
                    <div className="shiba__arm-right2"></div>
                    <div className="shiba__leg-left"></div>
                    <div className="shiba__leg-right"></div>
                    <div className="shiba__foot-left"></div>
                    <div className="shiba__foot-right"></div>
                    <div className="shiba__wrist-left"></div>
                    <div className="shiba__wrist-right"></div>

                    <div className="shiba__head">
                        <div className="shiba__ear-left"></div>
                        <div className="shiba__ear-right"></div>
                        {/* --- GƯƠNG MẶT MỚI --- */}
                        <div className="shiba__eye-left"></div>
                        <div className="shiba__eye-right"></div>
                        <div className="shiba__blush-left"></div>
                        <div className="shiba__blush-right"></div>
                        <div className="shiba__snout">
                            <div className="shiba__nose"></div>
                            <div className="shiba__mouth"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .notfound-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(90deg, #2f3640 23%, #181b20 100%);
                    overflow: hidden;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                }
                
                .container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .moon {
                    background: linear-gradient(90deg, #d0d0d0 48%, #919191 100%);
                    position: absolute;
                    top: -10vh;
                    left: -30vw;
                    width: 90vw;
                    height: 90vw;
                    max-width: 900px;
                    max-height: 900px;
                    content: '';
                    border-radius: 100%;
                    box-shadow: 0px 0px 30px -4px rgba(0, 0, 0, 0.5);
                    z-index: 1;
                }
                
                @media (max-width: 768px) {
                    .moon {
                        top: -15vh;
                        left: -40vw;
                        width: 100vw;
                        height: 100vw;
                    }
                }
                
                @media (max-width: 480px) {
                    .moon {
                        top: -20vh;
                        left: -50vw;
                        width: 120vw;
                        height: 120vw;
                    }
                }
                
                .moon__crater {
                    position: absolute;
                    content: '';
                    border-radius: 100%;
                    background: linear-gradient(90deg, #7a7a7a 38%, #c3c3c3 100%);
                    opacity: 0.6;
                }
                .moon__crater1 { top: 25%; left: 55%; width: 6%; height: 18%; }
                .moon__crater2 { top: 65%; left: 38%; width: 4%; height: 8%; transform: rotate(55deg); }
                .moon__crater3 { top: -2%; left: 4.5%; width: 6.5%; height: 12%; transform: rotate(250deg); }

                .star {
                    background: grey;
                    position: absolute;
                    width: 5px;
                    height: 5px;
                    content: '';
                    border-radius: 100%;
                    opacity: 0.4;
                    animation: shimmer 1.5s infinite alternate;
                }
                
                @media (max-width: 768px) {
                    .star {
                        width: 3px;
                        height: 3px;
                    }
                }
                
                @keyframes shimmer {
                    from { opacity: 0; }
                    to { opacity: 0.7; }
                }
                .star1 { top: 40%; left: 50%; animation-delay: 1s; }
                .star2 { top: 60%; left: 90%; animation-delay: 3s; }
                .star3 { top: 10%; left: 70%; animation-delay: 2s; }
                .star4 { top: 90%; left: 40%; }
                .star5 { top: 20%; left: 30%; animation-delay: 0.5s; }

                .error {
                    position: absolute;
                    left: 10%;
                    top: 50%;
                    transform: translateY(-50%);
                    font-family: "Sora", sans-serif;
                    color: #e3e3e3;
                    z-index: 100;
                    text-align: left;
                    max-width: 500px;
                }
                
                @media (max-width: 1024px) {
                    .error {
                        left: 5%;
                        max-width: 400px;
                    }
                }
                
                @media (max-width: 768px) {
                    .notfound-container {
                        flex-direction: column;
                        justify-content: flex-start;
                        padding-top: 2rem;
                    }
                    
                    .error {
                        position: static;
                        transform: none;
                        text-align: center;
                        padding: 20px;
                        max-width: 100%;
                        left: auto;
                        top: auto;
                        order: 1;
                    }
                }
                
                .error__title { 
                    font-size: 10em; 
                    line-height: 0.8;
                    margin-bottom: 0.2em;
                }
                
                @media (max-width: 1024px) {
                    .error__title { font-size: 8em; }
                }
                
                @media (max-width: 768px) {
                    .error__title { font-size: 6em; }
                }
                
                @media (max-width: 480px) {
                    .error__title { font-size: 4em; }
                }
                
                .error__subtitle { 
                    font-size: 2em; 
                    margin-bottom: 0.5em;
                }
                
                @media (max-width: 1024px) {
                    .error__subtitle { font-size: 1.8em; }
                }
                
                @media (max-width: 768px) {
                    .error__subtitle { font-size: 1.5em; }
                }
                
                @media (max-width: 480px) {
                    .error__subtitle { font-size: 1.2em; }
                }
                
                .error__description { 
                    opacity: 1; 
                    font-size: 1.1em;
                    margin-bottom: 2em;
                }
                
                @media (max-width: 768px) {
                    .error__description { font-size: 1em; }
                }
                
                .error__button {
                    min-width: 7em;
                    margin-top: 3em;
                    margin-right: 0.5em;
                    padding: 0.5em 2em;
                    outline: none;
                    border: 2px solid #a1a1a1;
                    background-color: transparent;
                    border-radius: 8em;
                    color: #a1a1a1;
                    cursor: pointer;
                    transition-duration: 0.2s;
                    font-size: 0.9em;
                    font-family: "Sora", sans-serif;
                    text-decoration: none;
                    display: inline-block;
                }
                
                @media (max-width: 768px) {
                    .error__button {
                        margin-top: 1.5em;
                        padding: 0.8em 2.5em;
                        font-size: 1em;
                        min-width: 8em;
                    }
                }
                
                @media (max-width: 480px) {
                    .error__button {
                        padding: 0.6em 2em;
                        font-size: 0.9em;
                        min-width: 7em;
                    }
                }
                
                .error__button:hover { color: #ffffff; border-color: #ffffff; }
                .error__button--active {
                    background-color: #e67e22;
                    border: 2px solid #e67e22;
                    color: white;
                }
                .error__button--active:hover {
                    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.5);
                    color: white;
                }

                @keyframes float {
                    0% { transform: translate(-50%, -50%) rotate(20deg) translateY(0px); }
                    50% { transform: translate(-50%, -50%) rotate(20deg) translateY(-15px); }
                    100% { transform: translate(-50%, -50%) rotate(20deg) translateY(0px); }
                }

                @keyframes wag-tail {
                    0% { transform: rotate(-5deg); }
                    50% { transform: rotate(10deg); }
                    100% { transform: rotate(-5deg); }
                }

                .shiba {
                    position: absolute;
                    width: 220px;
                    height: 300px;
                    left: 70%;
                    top: 50%;
                    transform: translate(-50%, -50%) rotate(20deg) scale(1.2);
                    animation: float 4s ease-in-out infinite;
                    z-index: 50;
                }
                
                @media (max-width: 1024px) {
                    .shiba {
                        width: 180px;
                        height: 250px;
                        left: 75%;
                        scale: 1;
                    }
                }
                
                @media (max-width: 768px) {
                    .shiba {
                        width: 150px;
                        height: 200px;
                        left: 50%;
                        top: 60%;
                        scale: 0.8;
                        order: 2;
                        position: relative;
                        transform: translateX(-50%) rotate(20deg) scale(0.8);
                        margin-top: 2rem;
                    }
                }
                
                @media (max-width: 480px) {
                    .shiba {
                        width: 120px;
                        height: 160px;
                        left: 50%;
                        top: 65%;
                        scale: 0.6;
                        order: 2;
                        position: relative;
                        transform: translateX(-50%) rotate(20deg) scale(0.6);
                        margin-top: 1rem;
                    }
                }
                
                .shiba__tail {
                    position: absolute;
                    top: 175px;
                    left: 125px;
                    width: 30px;
                    height: 30px;
                    background-color: #e09a57;
                    border-radius: 50% 50% 0 50%;
                    transform-origin: bottom left;
                    animation: wag-tail 2s ease-in-out infinite;
                    border: 5px solid #f3d4b5;
                    border-left-color: transparent;
                    border-top-color: transparent;
                }

                .shiba__backpack { z-index: 1; background-color: #bfbfbf; position: absolute; top: 90px; left: 67px; width: 86px; height: 90px; border-radius: 8px; }
                .shiba__body { z-index: 2; background-color: #e6e6e6; position: absolute; top: 115px; left: 75px; width: 70px; height: 80px; border-radius: 8px; }
                .shiba__body__chest { z-index: 3; background-color: #d9d9d9; position: absolute; top: 140px; left: 88px; width: 45px; height: 25px; border-radius: 6px; }
                .shiba__arm-left1 { z-index: 3; background-color: #e6e6e6; position: absolute; top: 127px; left: 29px; width: 65px; height: 20px; border-radius: 8px; transform: rotate(-30deg); }
                .shiba__arm-left2 { z-index: 3; background-color: #e6e6e6; position: absolute; top: 102px; left: 27px; width: 20px; height: 45px; border-radius: 8px; transform: rotate(-12deg); border-top-left-radius: 8em; border-top-right-radius: 8em; }
                .shiba__arm-right1 { z-index: 3; background-color: #e6e6e6; position: absolute; top: 113px; left: 120px; width: 65px; height: 20px; border-radius: 8px; transform: rotate(-10deg); }
                .shiba__arm-right2 { z-index: 3; background-color: #e6e6e6; position: absolute; top: 78px; left: 161px; width: 20px; height: 45px; border-radius: 8px; transform: rotate(-10deg); border-top-left-radius: 8em; border-top-right-radius: 8em; }
                .shiba__wrist-left { z-index: 4; background-color: #e67e22; position: absolute; top: 122px; left: 26.5px; width: 21px; height: 4px; border-radius: 8em; transform: rotate(-15deg); }
                .shiba__wrist-right { z-index: 4; background-color: #e67e22; position: absolute; top: 98px; left: 161px; width: 21px; height: 4px; border-radius: 8em; transform: rotate(-10deg); }
                .shiba__leg-left { z-index: 0; background-color: #e6e6e6; position: absolute; top: 188px; left: 70px; width: 23px; height: 75px; transform: rotate(10deg); }
                .shiba__leg-right { z-index: 0; background-color: #e6e6e6; position: absolute; top: 188px; left: 128px; width: 23px; height: 75px; transform: rotate(-10deg); }
                .shiba__foot-left { z-index: 0; background-color: white; position: absolute; top: 240px; left: 63px; width: 28px; height: 20px; transform: rotate(10deg); border-radius: 3px; border-top-left-radius: 8em; border-top-right-radius: 8em; border-bottom: 4px solid #e67e22; }
                .shiba__foot-right { z-index: 0; background-color: white; position: absolute; top: 240px; left: 131px; width: 28px; height: 20px; transform: rotate(-10deg); border-radius: 3px; border-top-left-radius: 8em; border-top-right-radius: 8em; border-bottom: 4px solid #e67e22; }

                .shiba__head {
                    background-color: #e09a57;
                    position: absolute;
                    top: 50px;
                    left: 70px;
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    z-index: 4;
                }
                .shiba__ear-left, .shiba__ear-right {
                    position: absolute;
                    top: -5px;
                    width: 0;
                    height: 0;
                    border-left: 15px solid transparent;
                    border-right: 15px solid transparent;
                    border-bottom: 25px solid #e09a57;
                    z-index: -1;
                }
                .shiba__ear-left { left: 5px; transform: rotate(-20deg); }
                .shiba__ear-right { right: 5px; transform: rotate(20deg); }
                
                /* --- CSS CHO GƯƠNG MẶT MỚI --- */
                .shiba__eye-left, .shiba__eye-right {
                    position: absolute;
                    top: 30px;
                    width: 12px;
                    height: 6px;
                    border: 2px solid #2c3e50;
                    border-top-color: transparent;
                    border-right-color: transparent;
                    border-left-color: transparent;
                    border-radius: 50%;
                    transform: rotate(-10deg);
                }
                .shiba__eye-left { left: 22px; }
                .shiba__eye-right { right: 22px; }
                
                .shiba__blush-left, .shiba__blush-right {
                    position: absolute;
                    top: 40px;
                    width: 12px;
                    height: 8px;
                    background-color: rgba(255, 105, 180, 0.4); /* Màu má hồng */
                    border-radius: 50%;
                }
                .shiba__blush-left { left: 15px; }
                .shiba__blush-right { right: 15px; }

                .shiba__snout {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 35px;
                    height: 25px;
                    background-color: #f3d4b5;
                    border-radius: 40% 40% 50% 50%;
                }
                .shiba__nose {
                    position: absolute;
                    top: 5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 8px;
                    height: 5px;
                    background-color: #2c3e50;
                    border-radius: 50%;
                }
                .shiba__mouth {
                    position: absolute;
                    bottom: 5px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 15px;
                    height: 8px;
                    border-bottom: 2px solid #2c3e50;
                    border-radius: 0 0 50% 50%;
                }
            `}</style>
        </div>
    );
};

export default NotFound;