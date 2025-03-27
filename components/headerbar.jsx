import React from 'react';
import spark from '/assets/sparkventure.svg';

const Headerbar = () => {
  return (
    <header className="flex flex-col items-center justify-center py-2 text-black">
    <img 
        src={spark}
        alt="LOGO" 
        className="h-auto w-60 sm:w-70 md:w-80 lg:w-90 xl:w-100 max-w-full" 
      />
        <p className="text-lg sm:text-md text-center px-2 "style={{ fontFamily: 'Aristotelica Display, sans-serif' }}>
        Welcome to Sparkventure. Register now and join the innovation!</p>
    </header>
  );
};

export default Headerbar;
