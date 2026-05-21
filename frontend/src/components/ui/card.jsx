import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className = "" }) => {
  return (
    <div className={twMerge(
      "bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      {children}
    </div>
  );
};

export default Card;