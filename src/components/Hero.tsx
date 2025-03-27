import React from 'react';
import { useRouter } from 'next/router';
import SearchBar from './SearchBar';

const Hero: React.FC = () => {
  const router = useRouter();

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transform scale-105 transition-transform duration-[20s] hover:scale-100"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
        }}
      ></div>
      
      {/* Enhanced gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/75 z-10 backdrop-blur-[2px]"></div>
      
      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-center w-full">
          <h1 className="text-5xl md:text-6xl tracking-tight font-extrabold text-white animate-fade-in">
            <span className="block transform transition-transform duration-700 hover:scale-105">Find What You Need</span>
            <span className="block text-blue-300 mt-2 transform transition-transform duration-700 hover:scale-105">All in One Place</span>
          </h1>
          <p className="mt-6 text-xl text-gray-200 max-w-2xl mx-auto animate-fade-in-up">
            Search across videos, articles, and business listings. Get comprehensive results from multiple sources.
          </p>
          <div className="mt-10 max-w-2xl mx-auto relative z-30 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <SearchBar 
              placeholder="Search videos, articles, and businesses..."
              className="shadow-xl"
              onSearch={handleSearch}
            />
          </div>
          <div className="mt-8 flex justify-center space-x-4 text-sm text-gray-300 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <span className="hover:text-blue-300 transition-colors duration-300">Videos</span>
            <span>•</span>
            <span className="hover:text-blue-300 transition-colors duration-300">Articles</span>
            <span>•</span>
            <span className="hover:text-blue-300 transition-colors duration-300">Businesses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 