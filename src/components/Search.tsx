import { useEffect, useRef, useState, memo } from "react";
import { Link } from "react-router-dom";

const ResultItem = memo(function ResultItem({
  result,
}: {
  result: any;
}) {
  const name =
    result.openfda?.brand_name?.[0] || "Unknown medicine";

  const manufacturer =
    result.openfda?.manufacturer_name?.[0] ||
    "Unknown manufacturer";

  return (
    <Link
      to="/medicine"
      state={{ medicine: result }}
      className="block border-b p-4 hover:bg-gray-100"
    >
      <h3>{name}</h3>

      <p className="text-sm text-gray-500">
        {manufacturer}
      </p>
    </Link>
  );
});

function Search() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const cache = useRef(new Map<string, any[]>());
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    const query = search.trim();

    if (query === "") {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      const cacheKey = query.toLowerCase();
      const cachedResults = cache.current.get(cacheKey);

      if (cachedResults) {
        setResults(cachedResults);
        setLoading(false);
        return;
      }

      if (controller.current) {
        controller.current.abort();
      }

      const newController = new AbortController();
      controller.current = newController;

      setLoading(true);

      try {
        const url =
          'https://api.fda.gov/drug/label.json?search=openfda.brand_name:"' +
          encodeURIComponent(query) +
          '"&limit=20';

        const response = await fetch(url, {
          signal: newController.signal,
        });

        if (!response.ok) {
          setResults([]);
          return;
        }

        const data = await response.json();
        const newResults = data.results || [];

        cache.current.set(cacheKey, newResults);
        setResults(newResults);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.log("Something went wrong:", error);
          setResults([]);
        }
      } finally {
        if (!newController.signal.aborted) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <div className="min-h-screen pt-32 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">
        Medicine Search
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Search for medicines and view their details.
      </p>
      <input
        type="text"
        placeholder="Search for a medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-xl border rounded-md border-gray-300 px-4 py-3 text-lg outline-none"
      />

      <div className="w-full max-w-xl mt-4">
        {loading && <p>Searching...</p>}

        {!loading && results.length > 0 && (
          <div className="border border-gray-200 bg-white">
            {results.map((result, index) => (
              <ResultItem
                key={
                  result.openfda?.application_number?.[0] ||
                  result.openfda?.brand_name?.[0] ||
                  index
                }
                result={result}
              />
            ))}
          </div>
        )}

        {!loading &&
          search.trim() !== "" &&
          results.length === 0 && (
            <p className="text-gray-500">
              No results found.
            </p>
          )}
      </div>
    </div>
  );
}

export default Search;
