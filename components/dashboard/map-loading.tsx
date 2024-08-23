import * as React from "react";
import * as Progress from "@radix-ui/react-progress";

const LoadingIndicator = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) return 99; // Cap progress at 99%
        // Increase the progress quickly at first, then slow down
        const increment = (100 - prev) * 0.02;
        return prev + increment;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ProgressContainer">
      <Progress.Root className="ProgressRoot" value={progress}>
        <Progress.Indicator
          className="ProgressIndicator"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
      <div className="ProgressText">{progress.toFixed(2)}%</div>
    </div>
  );
};

export default LoadingIndicator;
