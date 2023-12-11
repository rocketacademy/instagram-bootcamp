import { useState } from "react";

const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const reset = () => {
    setValue(initialValue);
  };

  const setNew = {
    value,
    onChange: (e) => {
      setValue(e.target.value);
    },
  };
  return [value, setNew, reset];
};

export default useInput;
