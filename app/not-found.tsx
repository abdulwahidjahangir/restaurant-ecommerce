"use client";

import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-8">
        The page you are looking for is not available.
      </p>
      <button
        onClick={goHome}
        className="px-6 py-3 text-white bg-black hover:bg-blue-950 rounded-lg"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default NotFoundPage;
