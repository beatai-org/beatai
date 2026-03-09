import React from 'react';
import './FeaturedIn.css';
import { HiNewspaper } from 'react-icons/hi';
import { HiLightBulb } from 'react-icons/hi';
import { HiSparkles } from 'react-icons/hi';

const FeaturedIn = () => {
  const testimonials = [
    {
      logo: <HiNewspaper />,
      company: 'TechStories',
      quote: '"LoongBot Showed Me What the Future of Personal AI Assistants Looks Like"',
      author: 'Sarah Chen',
      bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(236, 72, 153, 0.02) 100%)'
    },
    {
      logo: <HiLightBulb />,
      company: 'DevHope',
      quote: '"The Dragon Bot Revolution: Why Developers Are Building Their Own AI Agents"',
      author: 'Alex Kumar',
      bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)'
    }
  ];

  return (
    <section className="featured-in">
      <div className="container">
        <div className="section-header">
          <span className="section-icon"><HiSparkles /></span>
          <h2 className="section-title">Featured In</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="testimonial-card"
              style={{ background: item.bgGradient }}
            >
              <div className="company-info">
                <span className="company-logo">{item.logo}</span>
                <span className="company-name">{item.company}</span>
              </div>
              <p className="testimonial-quote">{item.quote}</p>
              <p className="testimonial-author">{item.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedIn;
