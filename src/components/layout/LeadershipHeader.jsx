import React from 'react';

const leaders = [
  {
    name: "Sri Nara Chandrababu Naidu",
    post: "Hon'ble Chief Minister of Andhra Pradesh",
    image: `${import.meta.env.BASE_URL}images/cm-naidu.jpg`,
    border: "border-ap-gold"
  },
  {
    name: "Sri. Nara Lokesh",
    post: "Hon'ble Minister of ITE&C, RTGS & HRD GoAP",
    image: `${import.meta.env.BASE_URL}images/minister_lokesh.jpeg`,
    border: "border-ap-lavender"
  },
  {
    name: "Katamaneni. Bhaskar, IAS",
    post: "Secretary to Government, ITE&C Department",
    image: `${import.meta.env.BASE_URL}images/sec_IT.png`,
    border: "border-ap-purple"
  },
  {
    name: "M. Surya Teja I.A.S",
    post: "Managing Director, APTS",
    image: `${import.meta.env.BASE_URL}images/md_apts.jpg`,
    border: "border-ap-purple"
  }
];

const LeadershipHeader = () => {
  return (
    <div className="w-full bg-white text-ap-navy py-4 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          {leaders.map((leader, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className={`relative shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 ${leader.border} shadow-sm group-hover:scale-105 transition-transform`}>
                <img 
                  src={leader.image} 
                  alt={leader.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-black leading-tight uppercase tracking-tight">
                  {leader.name}
                </h3>
                <p className="text-[10px] text-gray-500 font-bold leading-tight mt-1">
                  {leader.post}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadershipHeader;