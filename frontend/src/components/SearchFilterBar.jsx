import React from 'react';
import { Search, Filter, DollarSign } from 'lucide-react';

const SearchFilterBar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="search-filter-bar glass-panel">
      <div className="search-input-group">
        <Search className="input-icon" size={18} />
        <input
          type="text"
          name="search"
          placeholder="Search make or model..."
          value={filters.search}
          onChange={handleChange}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <div className="input-with-icon filter-dropdown">
          <Filter className="input-icon" size={16} />
          <select name="category" value={filters.category} onChange={handleChange}>
            <option value="">All Categories</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Coupe">Coupe</option>
            <option value="Van">Van</option>
          </select>
        </div>

        <div className="price-range">
          <div className="input-with-icon">
            <DollarSign className="input-icon" size={16} />
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleChange}
              min="0"
            />
          </div>
          <span className="price-separator">-</span>
          <div className="input-with-icon">
            <DollarSign className="input-icon" size={16} />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
