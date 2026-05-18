import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className = "" }) => {
  return (
    <div className={twMerge(
      "bg-ap-navy/40 border border-ap-purple/20 backdrop-blur-sm rounded-xl p-6 shadow-soft-cyber hover:border-ap-lavender/50 transition-all duration-300", 
      className
    )}>
      {children}
    </div>
  );
};

export default Card;