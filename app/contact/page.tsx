export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-screen-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Contact Information
        </h1>

        <div className="flex flex-col items-center">
          <div className="mb-4 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-700 text-center">
              Phone Number
            </h2>
            <p className="text-gray-600 text-center">12456789</p>
          </div>

          <div className="mb-4 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-700 text-center">
              Email
            </h2>
            <p className="text-gray-600 text-center">wahid@wahid.com</p>
          </div>

          <div className="mb-4 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-700 text-center">
              Address
            </h2>
            <p className="text-gray-600 text-center">
              Valles Marineris Blvd 42, Sector 17 <br />
              Quadrant B <br />
              Tharsis, Mars <br />
              44589-MA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
