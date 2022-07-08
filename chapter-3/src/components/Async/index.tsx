import { useEffect, useState } from "react";

export function Async() {
  const [isButtonInVisible, setIsButtonInVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsButtonInVisible(true);
    }, 1000);
  }, []);

  return (
    <div>
      <h1>hello world</h1>
      {!isButtonInVisible && <button>click me</button>}
    </div>
  );
}
