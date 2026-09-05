import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Search() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.trim() === "") {
      setResults([]);
      setLoading(false);
      return;
    }

    async function getResults() {
      setLoading(true);

      try {
        const url =
          'https://api.fda.gov/drug/label.json?search=openfda.brand_name:"' +
          encodeURIComponent(search) +
          '"&limit=20';

        const res = await fetch(url);

        if (!res.ok) {
          setResults([]);
          return;
        }

        const data = await res.json();

        setResults(data.results || []);
      } catch (err) {
        console.log("Something went wrong:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    getResults();
  }, [search]);

  return (
    <div className="min-h-screen pt-32 flex flex-col items-center">
      <input
        type="text"
        placeholder="Search for a medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-xl border border-gray-300 px-4 py-3 text-lg outline-none"
      />

      <div className="w-full max-w-xl mt-4">
        {loading && <p>Searching...</p>}

        {!loading && results.length > 0 && (
          <div className="border border-gray-200 bg-white">
            {results.map((result, index) => {
              const name =
                result.openfda?.brand_name?.[0] || "Unknown medicine";

              const manufacturer =
                result.openfda?.manufacturer_name?.[0] ||
                "Unknown manufacturer";

              return (
                <Link
                  to="/medicine"
                  state={{ medicine: result }}
                  key={index}
                  className="block border-b p-4 hover:bg-gray-100"
                >
                  <h3>{name}</h3>
                  <p className="text-sm text-gray-500">
                    {manufacturer}
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && search.trim() !== "" && results.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}

export default Search;
