import { signInSchema, signUpSchema } from "@/schemas/zodAuthFormSchemas";
import axios, { AxiosError } from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { z } from "zod";
import { ApiResponse } from "../../../types/ApiResponse";
import { signIn } from "next-auth/react";

export const handleSignInSumit = async (
  values: z.infer<typeof signInSchema>,
) => {
  // Auto-login with NextAuth
  const result = await signIn("credentials", {
    redirect: true, // Redirect after successful login
    email: values.email,
    password: values.password,
    callbackUrl: "/dashboard", // Redirect URL after login
  });

  if (result?.error) {
    if (result.error === "CredentialsSignin") {
      toast.error("Login Failed", {
        description: "Invalid email or password",
      });
    } else {
      toast.error("Login Failed", {
        description: result.error,
      });
    }
  } else {
    toast.success("Login Success", {
      description: "You have successfully logged in.",
    });
  }
};

export const handleSignUpSubmit = async (
  values: z.infer<typeof signUpSchema>,
) => {
  try {
    const response = await axios.post("/api/auth/signup", values);

    toast.success("Sign Up Success", {
      description: response.data.message,
    });

    // Auto-login with NextAuth
    const result = await signIn("credentials", {
      redirect: true, // Redirect after successful login
      email: values.email,
      password: values.password,
      callbackUrl: "/dashboard", // Redirect URL after login
    });

    if (result?.error) {
      console.error("Login error:", result.error);
    }
  } catch (error) {
    console.error("Error during sign up:", error);
    const axiosError = error as AxiosError<ApiResponse>;

    const errorMessage = axiosError.response?.data.message;
    // ('There was a problem with your sign up. Please try again.');

    toast.error("Sign Up Failed", {
      description: errorMessage,
      className: "bg-red-200 text-red-900",
    });
  }
};

export const handleForgotPasswordSubmit = async (
  values: string,
  router: AppRouterInstance,
) => {
  try {
    await axios.post("/api/auth/forgot-password", values);
    router.replace("/auth/signin");
    toast.success("Forgot Password Success", {
      description:
        "An email is sent to your email address to reset your password.",
    });
  } catch (error) {
    console.error("Error during sign up:", error);
    const axiosError = error as AxiosError<ApiResponse>;

    const errorMessage = axiosError.response?.data.message;

    toast.error("Forgot Password Failed", {
      description: errorMessage,
      className: "bg-red-200 text-red-900",
    });
  }
};

export const handleResetPasswordSubmit = async (
  password: string,
  token: string | undefined,
  router: AppRouterInstance,
) => {
  try {
    await axios.post("/api/auth/reset-password", { password, token });
    router.replace("/auth/signin");
    toast.success("Reset Password Success", {
      description: "Password was successfully reset.",
    });
  } catch (error) {
    console.error("Error during sign up:", error);
    const axiosError = error as AxiosError<ApiResponse>;

    const errorMessage = axiosError.response?.data.message;

    toast.error("Reset Password Failed", {
      description: errorMessage,
      className: "bg-red-200 text-red-900",
    });
  }
};
