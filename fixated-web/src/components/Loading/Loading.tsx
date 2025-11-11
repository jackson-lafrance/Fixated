import "./Loading.css";

export const Loading = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="loadingContainer">
      <div className="loadingSpinner"></div>
      <p className="loadingText">{message}</p>
    </div>
  );
};

