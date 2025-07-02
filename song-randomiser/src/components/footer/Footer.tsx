import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="fixed bottom-0 h-11 border-t border-gray w-screen flex items-center justify-center">
      <p className="text-sm text-gray-400 italic">
        Developed and Tested by{' '}
        <a
          className="underline"
          href="https://github.com/Blerargh"
          target="_blank"
          rel="noopener noreferrer"
        >
          blerargh
        </a>
        , <a className="underline cursor-pointer">beazat</a>
      </p>
    </div>
  );
};

export default Footer;
