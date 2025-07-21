import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm, setCategoryFilter, setSortBy } from '../../store/slices/projectsSlice';
import { Search } from 'lucide-react';

const ProjectFilters = () => {
  const dispatch = useDispatch();
  const { searchTerm, categoryFilter, sortBy } = useSelector((state) => state.projects);

  const categories = [
    'all',
    'technology',
    'art',
    'music',
    'film',
    'games',
    'publishing',
    'food',
    'fashion',
    'health',
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="funding">Most Funded</option>
          <option value="deadline">Ending Soon</option>
        </select>
      </div>
    </div>
  );
};

export default ProjectFilters;