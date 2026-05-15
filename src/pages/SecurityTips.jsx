import React from 'react';
import Card from '../components/ui/Card';
import { ShieldCheck, Key, MousePointer2, Smartphone } from 'lucide-react';

const SecurityTips = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12 border-l-4 border-ap-gold pl-6">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Security Tips for Citizens</h1>
        <p className="text-gray-400 max-w-2xl">
          Official guidelines provided by AP-CERT to help you protect your digital assets and personal information[cite: 135].
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Password Policy Section */}
        <Card className="border-ap-lavender/30">
          <div className="flex items-start gap-4">
            <div className="bg-ap-lavender/20 p-3 rounded-lg text-ap-lavender">
              <Key size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Stronger & Secure Passwords</h2>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex gap-2">
                  <span className="text-ap-gold">•</span> 
                  <span>Minimum length of 16 characters.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-ap-gold">•</span> 
                  <span>Combine numbers, symbols, uppercase, and lowercase letters[cite: 153].</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-ap-gold">•</span> 
                  <span>Avoid personal info like names, DOB, or pet names[cite: 155].</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 2FA Section */}
        <Card className="border-ap-purple/30">
          <div className="flex items-start gap-4">
            <div className="bg-ap-purple/20 p-3 rounded-lg text-ap-purple">
              <Smartphone size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Two-Factor Authentication (2FA)</h2>
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                2FA adds another layer of security to your password by requiring a second piece of information to be validated[cite: 157, 158].
              </p>
              <div className="bg-ap-navy/50 p-3 rounded border border-ap-purple/20 text-xs text-ap-lavender font-mono">
                Recommendation: Use Authenticator Apps over SMS codes where possible[cite: 160].
              </div>
            </div>
          </div>
        </Card>

        {/* Phishing Awareness */}
        <Card className="border-ap-gold/30">
          <div className="flex items-start gap-4">
            <div className="bg-ap-gold/10 p-3 rounded-lg text-ap-gold">
              <MousePointer2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Beware of Phishing</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Be cautious of unsolicited emails or messages asking for sensitive information[cite: 140, 142]. 
                Hackers often use social engineering to mimic legitimate entities[cite: 156].
              </p>
            </div>
          </div>
        </Card>

        {/* Incident Reporting CTA */}
        <Card className="bg-gradient-to-br from-ap-purple to-ap-navy border-none">
          <h2 className="text-xl font-bold mb-2">Notice anything suspicious?</h2>
          <p className="text-sm text-white/70 mb-6">
            Any citizen or government official in Andhra Pradesh can report a cybersecurity incident via our official channels[cite: 132, 136].
          </p>
          <button className="bg-ap-gold text-ap-navy font-bold px-6 py-2 rounded uppercase text-xs tracking-widest">
            Report Now
          </button>
        </Card>
      </div>
    </div>
  );
};

export default SecurityTips;