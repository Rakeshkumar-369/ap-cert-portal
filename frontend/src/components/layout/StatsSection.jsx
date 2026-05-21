
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, AlertTriangle, Users, Activity, Target } from 'lucide-react';
import Card from '../ui/Card';

const StatsSection = () => {
  // Maintaining the full data structure and logic
  const statsData = [
    {
      id: 1,
      label: "Threats Blocked",
      value: "24,582",
      subtext: "Last 24 Hours",
      icon: <ShieldCheck size={28} />,
      color: "text-green-600",
      bg: "bg-green-50",
      glow: "border-green-500/50"
    },
    {
      id: 2,
      label: "Active Monitors",
      value: "458",
      subtext: "State-wide Nodes",
      icon: <Zap size={28} />,
      color: "text-[#00D4FF]",
      bg: "bg-blue-50",
      glow: "border-[#00D4FF]/50"
    },
    {
      id: 3,
      label: "Critical Alerts",
      value: "02",
      subtext: "Immediate Action",
      icon: <AlertTriangle size={28} />,
      color: "text-red-600",
      bg: "bg-red-50",
      glow: "border-red-500/50"
    },
    {
      id: 4,
      label: "Trained Personnel",
      value: "1,240",
      subtext: "Capacity Built",
      icon: <Users size={28} />,
      color: "text-[#002B5B]",
      bg: "bg-slate-100",
      glow: "border-[#002B5B]/50"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {statsData.map((stat) => (
        <motion.div key={stat.id} variants={itemVariants}>
          <Card className={`relative group overflow-hidden bg-white border-none shadow-lg hover:shadow-2xl transition-all duration-300 border-b-4 ${stat.glow}`}>
            {/* Background Decorative Element */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500`} />
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm`}>
                  {stat.icon}
                </div>
                <Activity size={16} className="text-gray-300 animate-pulse" />
              </div>

              <div>
                <h4 className="text-3xl font-black text-[#002B5B] tracking-tighter">
                  {stat.value}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {stat.label}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter flex items-center gap-1">
                  <Target size={10} className={stat.color} /> {stat.subtext}
                </span>
                <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "0%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full w-full ${stat.color.replace('text', 'bg')}`}
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsSection;