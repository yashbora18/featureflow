import React from "react";
import "./SkeletonLoader.css";

function SkeletonLoader() {

  return (

    <div className="skeleton-wrapper">

      <div className="skeleton-header">

        <div className="skeleton skeleton-title"></div>

        <div className="skeleton skeleton-subtitle"></div>

      </div>


      <div className="skeleton-grid">

        <div className="skeleton-card">

          <div className="skeleton skeleton-icon"></div>

          <div className="skeleton skeleton-line"></div>

          <div className="skeleton skeleton-number"></div>

        </div>


        <div className="skeleton-card">

          <div className="skeleton skeleton-icon"></div>

          <div className="skeleton skeleton-line"></div>

          <div className="skeleton skeleton-number"></div>

        </div>


        <div className="skeleton-card">

          <div className="skeleton skeleton-icon"></div>

          <div className="skeleton skeleton-line"></div>

          <div className="skeleton skeleton-number"></div>

        </div>


      </div>


      <div className="skeleton-chart">

        <div className="skeleton skeleton-chart-box"></div>

      </div>


    </div>

  );
}

export default SkeletonLoader;
