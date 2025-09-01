import { useSignIn } from "@clerk/clerk-react";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialSigninData = {
  email: "",
  password: "",
};

const getErrorMessage = (err) => {
  return (
    err.errors?.[0]?.message || err.message || "An unexpected error occurred"
  );
};

const SignInPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const [signinData, setSigninData] = useState(initialSigninData);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const inputChange = (e) => {
    setSigninData({ ...signinData, [e.target.name]: e.target.value });

    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const signinDataValidation = (formData) => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors([{ message: "Please enter a valid email address" }]);
      return false;
    }

    if (!formData.password || formData.password.length < 8) {
      setErrors([{ message: "Password must be at least 8 characters" }]);
      return false;
    }

    return true;
  };

  // Sign In Logic
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!isLoaded) return;

      const isValid = signinDataValidation(signinData);
      if (!isValid) return;

      setLoading(true);
      setErrors([]);

      try {
        const result = await signIn.create({
          identifier: signinData.email,
          password: signinData.password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          navigate("/home", { replace: true });
        } else {
          setErrors([
            {
              message:
                "Sign in incomplete. Please check your email for additional verification.",
              type: "incomplete",
            },
          ]);
        }
      } catch (error) {
        console.log("Error in handling signin - ", error);
        setErrors([{ message: getErrorMessage(error) }]);
      } finally {
        setLoading(false);
      }
    },
    [isLoaded, signinData, signIn, setActive, navigate, signinDataValidation]
  );

  // OAuth Sign In
  const signInWithGoogle = useCallback(async () => {
    if (!isLoaded) return;

    setGoogleLoading(true);
    setErrors([]);

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrlComplete: "/home",
      });
    } catch (err) {
      console.error("Google sign in error:", err);
      if (
        err.message?.includes("You're already signed in") ||
        err.code === "session_exists"
      ) {
        // User is already signed in
        navigate("/home");
      } else {
        setErrors([
          {
            message: "Google sign in failed. Please try again.",
            type: "oauth_error",
          },
        ]);
      }
      setGoogleLoading(false);
    }
  }, [isLoaded, signIn]);

  // Loading State
  if (!isLoaded) {
    return (
      <div className="max-w-[400px] mx-auto my-8 p-8 text-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto w-full bg-white sm:bg-[#F0F4F8] flex items-center justify-center">
      <div className="md:w-[450px] max-w-[450px] w-full px-6 py-8 rounded-lg bg-white sm:shadow-xl flex flex-col items-center">
        <div className="h-auto w-auto inline-block text-3xl font-bold text-teal-600 mb-2">
          Trelloop
        </div>
        <div className="w-full text-center text-gray-500 mb-8">
          Your personal task space, just a sign in away.
        </div>

        <button
          type="button"
          disabled={googleLoading || loading}
          onClick={signInWithGoogle}
          className={`w-full px-3 py-3 text-white border-none rounded cursor-pointer mb-4 text-base font-medium transition-colors duration-200 ${
            googleLoading
              ? "bg-[#ccc] cursor-not-allowed"
              : "bg-[#db4437] cursor-pointer"
          }`}
        >
          {googleLoading ? "Signing in..." : "Continue with Google"}
        </button>

        <div className="text-center my-6 relative">
          <span className="text-gray-400 bg-white px-4 relative z-10">OR</span>
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300 m-0" />
        </div>

        {errors.length > 0 && (
          <div className="w-full text-red-500 px-2 py-1 my-4 border-[1px] border-red-500 rounded-md bg-red-100">
            {errors.map((error, index) => (
              <div key={index}>{error.message}</div>
            ))}
          </div>
        )}

        <form
          className="flex flex-col w-full text-gray-700"
          onSubmit={handleSubmit}
        >
          <label className="mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            onChange={(e) => {
              inputChange(e);
            }}
            className="mb-4 h-10 p-1 px-2 rounded-md border-[1px] border-gray-300 outline-teal-500"
          />

          <label className="mb-1 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            onChange={(e) => {
              inputChange(e);
            }}
            className="mb-4 h-10 p-1 px-2 rounded-md border-[1px] border-gray-300 outline-teal-500"
          />

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="primary-button py-3 my-5 text-xl"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="w-full text-center text-gray-700 text-base">
            <p>
              No account?
              <span
                onClick={() => {
                  navigate("/user/signup");
                }}
                className="hover:underline font-bold text-blue-800 cursor-pointer"
              >
                Create account
              </span>
            </p>
          </div>
        </form>

        <div id="clerk-captcha" style={{ marginBottom: "1rem" }}></div>
      </div>
    </div>
  );
};

export default SignInPage;
