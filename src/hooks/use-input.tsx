import { useState } from "react";

const useInput = (validateValue: any) => {

  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && isTouched;


  const valueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

    setEnteredValue(event.target.value);
  };

  const inputBlurHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTouched(true);
  };

  const inputReset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    inputReset,
  };
};


export default useInput;