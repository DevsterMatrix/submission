import { Link, useLocation } from "react-router-dom";

const ignoredFields = [
  "openfda",
  "spl_id",
  "spl_set_id",
  "id",
  "version",
  "effective_time",
  "set_id",
];

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

  function getCardClass(key: string) {
    if (key === "warnings") {
      return "bg-red-50 border-red-300 text-red-900";
    }

    if (key === "adverse_reactions") {
      return "bg-yellow-50 border-yellow-300";
    }

    if (key === "dosage_and_administration") {
      return "bg-blue-50 border-blue-300";
    }

    if (key === "purpose") {
      return "bg-green-50 border-green-300";
    }

    return "bg-white border-gray-200";
  }

  function displayValue(value: any): any {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    if (Array.isArray(value)) {
      return (
        <div>
          {value.map((item, index) => (
            <div key={index} className="mb-2">
              {displayValue(item)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === "object") {
      return (
        <div className="space-y-3">
          {Object.entries(value).map(([key, item]) => {
            if (ignoredFields.includes(key)) {
              return null;
            }

            return (
              <div key={key}>
                <p className="font-medium">
                  {key.replaceAll("_", " ")}
                </p>

                {displayValue(item)}
              </div>
            );
          })}
        </div>
      );
    }

    return <p>{String(value)}</p>;
  }

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <Link to="/" className="text-blue-500">
        ← Back to search
      </Link>

      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-8">
          {medicine.openfda?.brand_name?.[0] || "Unknown medicine"}
        </h1>

        <div className="grid gap-5">
          {Object.entries(medicine).map(([key, value]) => {
            if (ignoredFields.includes(key)) {
              return null;
            }

            if (
              value === null ||
              value === undefined ||
              value === ""
            ) {
              return null;
            }

            return (
              <div
                key={key}
                className={`border rounded-lg p-5 ${getCardClass(key)}`}
              >
                <h2 className="text-xl font-semibold mb-3 capitalize">
                  {key.replaceAll("_", " ")}
                </h2>

                {displayValue(value)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Medicine;
