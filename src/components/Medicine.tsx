import { Link, useLocation } from "react-router-dom";

function Medicine() {
  const location = useLocation();
  const medicine = location.state?.medicine;

  if (!medicine) {
    return (
      <div className="p-10">
        <p>Medicine information not found.</p>

        <Link to="/" className="text-blue-500">
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10">
      <Link to="/" className="text-blue-500">
        ← Back to search
      </Link>

      <div className="max-w-3xl mt-8">
        <h1 className="text-3xl font-bold mb-6">
          {medicine.openfda?.brand_name?.[0] || "Unknown medicine"}
        </h1>

        {Object.entries(medicine).map(([key, value]) => {
          if (!value) {
            return null;
          }

          return (
            <div key={key} className="mb-6">
              <h2 className="text-lg font-semibold mb-2">
                {key.replaceAll("_", " ")}
              </h2>

              {Array.isArray(value) ? (
                value.map((item, index) => (
                  <p key={index} className="mb-2">
                    {item}
                  </p>
                ))
              ) : (
                <p>{String(value)}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Medicine;
