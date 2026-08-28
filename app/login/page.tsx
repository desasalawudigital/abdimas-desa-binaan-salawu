"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      return await login(formData);
    },
    null
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold font-poppins text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm font-sans text-gray-600">
          Silakan masuk untuk mengakses panel admin
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" action={formAction}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold text-gray-700 font-poppins"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-black bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 font-poppins"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-black bg-gray-50"
                />
              </div>
            </div>

            {state?.error && (
              <div className="text-red-500 text-sm text-center font-bold bg-red-50 p-3 rounded-xl border border-red-100">
                {state.error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors font-poppins"
              >
                {isPending ? "Sedang Memeriksa..." : "Masuk ke Panel Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
