import React from 'react';

const VehicleSkeleton = () => {
  return (
    <div className="vehicle-card glass-panel skeleton-wrapper">
      <div className="vehicle-card-header">
        <div className="skeleton skeleton-text skeleton-make"></div>
        <div className="skeleton skeleton-text skeleton-model"></div>
      </div>
      <div className="vehicle-card-body">
        <div className="skeleton skeleton-text skeleton-detail"></div>
        <div className="skeleton skeleton-text skeleton-detail"></div>
        <div className="skeleton skeleton-text skeleton-detail"></div>
      </div>
    </div>
  );
};

export default VehicleSkeleton;
