import React from 'react';
import Card from '../components/ui/Card';

const faqs = [
  {
    q: "What is AP-Cyber Security Response Team (AP-CRT)?",
    a: "The AP-CRT gives the state a unique ability to identify aberrant cyber behavior, suspicious traffic, and malware to effectively intervene quickly. The team comprises cyber security analysts, network security professionals, and ethical hackers[cite: 124, 125]."
  },
  {
    q: "What services does the AP-CRT offer?",
    a: "The team consolidates functions of incident monitoring, detection, response, coordination, and computer network defense. It also generates cyber threat intelligence and provides reporting and advisories for citizens[cite: 129, 130]."
  },
  {
    q: "Who does AP-CRT serve?",
    a: "AP-CRT provides coverage to all state departments and government-owned entities. It also provides tips on securing digital assets and threat reports to all citizens of the state[cite: 134, 135]."
  },
  {
    q: "How do I submit an incident?",
    a: "Any citizen or government official in Andhra Pradesh can report a cybersecurity incident via our official online form[cite: 132, 136]."
  }
];

const FAQ = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-black uppercase mb-4">Frequently Asked Questions</h1>
      <p className="text-gray-400 mb-12 italic">
        The FAQ document is a living document and will be updated as new information is available.
      </p>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <Card key={index} className="border-ap-purple/10">
            <h3 className="text-ap-gold font-bold mb-3">{faq.q}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{faq.a}</p>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 p-6 rounded-xl border border-dashed border-ap-lavender/30 text-center">
        <p className="text-sm text-gray-400">
          Should you have a question that is not listed, please send your suggestions to our helpdesk[cite: 122].
        </p>
      </div>
    </div>
  );
};

export default FAQ;