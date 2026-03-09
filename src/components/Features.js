import React from 'react';
import './Features.css';
import { HiLightningBolt } from 'react-icons/hi';
import { BiExtension } from 'react-icons/bi';
import { RiRobot2Fill } from 'react-icons/ri';
import { HiShieldCheck } from 'react-icons/hi';
import { IoAnalytics } from 'react-icons/io5';
import { HiGlobeAlt } from 'react-icons/hi';
import { RiFlashlightFill } from 'react-icons/ri';

const Features = () => {
  const features = [
    {
      icon: <HiLightningBolt />,
      title: 'Lightning Fast',
      description: 'Execute tasks instantly'
    },
    {
      icon: <BiExtension />,
      title: 'Plugin System',
      description: 'Extend with plugins'
    },
    {
      icon: <RiRobot2Fill />,
      title: 'AI-Powered',
      description: 'Integrate AI models'
    },
    {
      icon: <HiShieldCheck />,
      title: 'Secure',
      description: 'Built-in security'
    },
    {
      icon: <IoAnalytics />,
      title: 'Analytics',
      description: 'Monitor performance'
    },
    {
      icon: <HiGlobeAlt />,
      title: 'Multi-Platform',
      description: 'Deploy anywhere'
    }
  ];

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-header">
          <span className="section-icon"><RiFlashlightFill /></span>
          <h2 className="section-title">What Does</h2>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
