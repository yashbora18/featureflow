import "./LoadingSkeleton.css";

export default function LoadingSkeleton() {
  return (
    <div className="loading-page">

      <div className="loading-header shimmer"></div>

      <div className="loading-stats">

        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="loading-card shimmer"
          />
        ))}

      </div>

      <div className="loading-grid">

        <div className="loading-chart shimmer"></div>

        <div className="loading-chart shimmer"></div>

      </div>

      <div className="loading-grid">

        <div className="loading-chart shimmer"></div>

        <div className="loading-chart shimmer"></div>

      </div>

    </div>
  );
}
