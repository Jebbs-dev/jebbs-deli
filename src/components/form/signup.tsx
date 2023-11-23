import { FaXmark } from "react-icons/fa6";
import React from "react";
import useInput from "@/hooks/use-input";

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
let emailContent = <p className="text-[#b40e0e]">Email must not be empty!</p>;
let nameContent = <p className="text-[#b40e0e]">username must not be empty!</p>;
let passwordContent = (
  <p className="text-[#b40e0e]">Please input a valid password</p>
);

const emailCheck = (value: string) => {
  if (value.trim() === "") {
    emailContent = <p className="text-[#b40e0e]">Email must not be empty!</p>;
  } else if (!regex.test(value)) {
    emailContent = (
      <p className="text-[#b40e0e]">Please enter a valid email!</p>
    );
  } else {
    return value;
  }
};

const nameCheck = (value: string) => {
  if (value.trim() === "") {
    nameContent = <p className="text-[#b40e0e]">Username must not be empty!</p>;
  } else if (value.length < 2) {
    nameContent = (
      <p className="text-[#b40e0e]">Username must not be less than 2 characters!</p>
    );
  } else {
    return value;
  }
};

const passwordCheck = (value: string) => {
  if (value.trim() === "") {
    passwordContent = <p className="text-[#b40e0e]">Password must not be empty!</p>;
  } else if (value.length < 5) {
    passwordContent = (
      <p className="text-[#b40e0e]">Password cannot not be less than 5 characters!</p>
    );
  } else {
    return value;
  }
};

interface signupProps {
  showSignup: boolean,
  closeModal: React.MouseEventHandler<HTMLButtonElement>,
  valid?: boolean
}

export const Signup = ({ showSignup, closeModal, valid }: signupProps) => {
  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    inputReset: resetEmailInput,
  } = useInput(emailCheck);

  const {
    value: enteredUName,
    isValid: enteredUNameIsValid,
    hasError: usernameInputHasError,
    valueChangeHandler: userNameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    inputReset: resetUNameInput,
  } = useInput(nameCheck);

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passwordInputHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    inputReset: resetPasswordInput,
  } = useInput(passwordCheck);

  let formIsValid = false;

  if (enteredEmailIsValid && enteredUNameIsValid && enteredPasswordIsValid) {
    formIsValid = true;
  }

  const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    resetEmailInput();
    resetUNameInput();
    resetPasswordInput();
  };

  const emailInput = emailInputHasError ? !valid : valid;
  const uNameInput = usernameInputHasError ? !valid : valid;
  const passwordInput = passwordInputHasError ? !valid : valid;

  

  return (
    <>
      {/* <!-- Main modal --> */}
      {showSignup ? (
        <>
          <div
            id="authModal"
            tabIndex={-1}
            aria-hidden="true"
            className="fixed  z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <div
              className="relative top-[8vh]  w-full md:top-[20vh] mx-auto  opacity-100 max-w-[79vw] md:max-w-lg md:max-h-full"
              id="targ"
            >
              {/* <!-- Modal content --> */}
              <div className="relative bg-white rounded-lg shadow ">
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                  data-modal-hide="authentication-modal"
                >
                  <FaXmark width="20px" height="20px" />
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="px-6 py-6 lg:px-8">
                  <h3 className="mb-4 text-xl font-medium text-gray-900 ">
                    Sign up to our platform
                  </h3>
                  <form
                    className="space-y-6"
                    action="#"
                    onSubmit={formSubmitHandler}
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-hair "
                      >
                        Your email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-hair text-sm rounded-lg focus:outline-orange-400 focus:border-orange-400 block w-full p-2.5"
                        placeholder="name@company.com"
                        required
                        onChange={emailChangeHandler}
                        onBlur={emailBlurHandler}
                        value={enteredEmail}
                        // valid={emailInput}
                      />
                      {emailInputHasError && emailContent}
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-hair"
                      >
                        Your username
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Frankie"
                        className="bg-gray-50 border border-gray-300 text-hair text-sm rounded-lg focus:border-orange-400 focus:outline-orange-400 block w-full p-2.5"
                        required
                        onChange={userNameChangeHandler}
                        onBlur={usernameBlurHandler}
                        value={enteredUName}
                        // valid={uNameInput}
                      />
                      {usernameInputHasError && nameContent}
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-hair"
                      >
                        Your password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-hair text-sm rounded-lg focus:border-orange-400 focus:outline-orange-400 block w-full p-2.5"
                        required
                        onChange={passwordChangeHandler}
                        onBlur={passwordBlurHandler}
                        value={enteredPassword}
                        // valid={passwordInput}
                      />
                      {passwordInputHasError && passwordContent}
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-orange-400 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-slate-200 disabled:text-hair disabled:cursor-not-allowed disabled: border-slate-200"
                      disabled={!formIsValid}
                    >
                      Create account
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        null
      )}
    </>
  );
};
