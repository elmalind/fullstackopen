import { useState } from "react";

const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const hideForm = () => {
    setVisible(false);
  };

  return (
    <div>
      <button onClick={toggleVisibility}>{buttonLabel}</button>
      {visible && (
        <div>
          {typeof children === "function" ? children({ hideForm }) : children}
        </div>
      )}
    </div>
  );
};

export default Togglable;
