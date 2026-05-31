import { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => ({
    hide: () => setVisible(false),
  }));

  return (
    <div>
      <button onClick={toggleVisibility}>{buttonLabel}</button>
      {visible && <div>{children}</div>}
    </div>
  );
});

Togglable.displayName = "Togglable";

export default Togglable;
