import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search companies...'
}) => {
  const [query, setQuery] = useState('');

  return (
    <form className="w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }
          }
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 shadow-sm transition-all duration-200 focus:border-[#3B546A] focus:outline-none focus:ring-2 focus:ring-[#3B546A]/20"
        />
      </div>
    </form>
  );
};

export default SearchBar;