import React from 'react';
import './Logo.css';

const Logo = () => {
  return (
    <div className="logo-container">
      <div className="robot-dragon">
        {/* 身体 */}
        <div className="body">
          {/* 头部 */}
          <div className="head">
            {/* 龙角 */}
            <div className="horn horn-left"></div>
            <div className="horn horn-right"></div>

            {/* 眼睛 */}
            <div className="eyes">
              <div className="eye eye-left">
                <div className="pupil"></div>
              </div>
              <div className="eye eye-right">
                <div className="pupil"></div>
              </div>
            </div>

            {/* 嘴巴 */}
            <div className="mouth"></div>

            {/* 腮红 */}
            <div className="blush blush-left"></div>
            <div className="blush blush-right"></div>
          </div>

          {/* 躯干 */}
          <div className="torso">
            <div className="gear gear-1"></div>
            <div className="gear gear-2"></div>
          </div>

          {/* 手臂 */}
          <div className="arm arm-left">
            <div className="hand"></div>
          </div>
          <div className="arm arm-right">
            <div className="hand"></div>
          </div>

          {/* 尾巴 */}
          <div className="tail">
            <div className="tail-segment"></div>
            <div className="tail-segment"></div>
            <div className="tail-segment"></div>
          </div>
        </div>

        {/* 浮动粒子效果 */}
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
      </div>
    </div>
  );
};

export default Logo;
