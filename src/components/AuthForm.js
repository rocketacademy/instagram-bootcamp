import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <div class="auth-screen">
        <div class="auth-box">
          {isLogin ? <Login /> : <Signup />}
          <div class="m-2">
            <p>
              {isLogin
                ? "Not an existing user? "
                : "Already an existing user? "}
            </p>

            <button onClick={() => setIsLogin(!isLogin)}>
              <p class="auth-form-btn">{isLogin ? " Sign up" : "Sign in"}</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
