import "./Loading.css";

export const Loading = () => {
  return (
    <div className="loadingContainer">
      <div className="loadingSpinner"></div>
      <p className="loadingText">Loading...</p>
    </div>
  );
};

