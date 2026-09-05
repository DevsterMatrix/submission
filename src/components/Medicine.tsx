import { Link, useLocation } from "react-router-dom";

const ignoredFields = [
  "openfda",
  "spl_id",
  "spl_set_id",
  "id",
  "version",
  "effective_time",
  "set_id",
  "spl_product_data_elements",
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

  const genericName =
    medicine.openfda?.generic_name?.[0];

  const applicationNumber =
    medicine.openfda?.application_number?.[0];

  const manufacturerName =
    medicine.openfda?.manufacturer_name?.[0];

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
    <div className="min-h-screen bg-gray-100 p-10">
      <Link to="/" className="text-blue-500">
        ← Back to search
      </Link>

      <div className="mx-auto mt-8 max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <div className="mx-auto mt-8 max-w-4xl">
        <h1 className="text-3xl font-bold">
          {medicine.openfda?.brand_name?.[0] ||
            "Unknown medicine"}
        </h1>
        <h2 className="mt-2 text-lg text-gray-600">
          {manufacturerName || "Unknown manufacturer"}
        </h2>

        <div className="mt-5 flex flex-wrap gap-2">
          {genericName && (
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              Generic: {genericName}
            </span>
          )}

          {applicationNumber && (
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
              Application: {applicationNumber}
            </span>
          )}
        </div>
      </div> 

        <div className="mt-8 grid gap-5">
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
                className={`rounded-lg border p-5 ${getCardClass(key)}`}
              >
                <h2 className="mb-3 text-xl font-semibold capitalize">
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
