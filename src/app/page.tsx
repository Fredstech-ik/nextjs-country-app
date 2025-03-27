"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Country {
  name: {
    common: string;
  };
  population: number;
  area: number;
  flags: {
    svg: string;
  };
}

export default function HomePage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch countries");
        return res.json();
      })
      .then((data: Country[]) => {
        setCountries(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCountrySelection = (country: Country) => {
    setSelectedCountries((prev) =>
      prev.find((c) => c.name.common === country.name.common)
        ? prev.filter((c) => c.name.common !== country.name.common)
        : prev.length < 2
        ? [...prev, country]
        : prev
    );
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold text-center mb-6">Countries List</h1>
      <input
        type="text"
        placeholder="Search countries..."
        className="w-full p-2 mb-4 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredCountries.map((country) => (
          <div
            key={country.name.common}
            className={`border rounded-lg p-4 shadow-lg cursor-pointer hover:bg-[#04142b] hover:text-[#ffffff] transition-all duration-200 text-center ${
              selectedCountries.find(
                (c) => c.name.common === country.name.common
              )
                ? "bg-blue-200"
                : ""
            }`}
            onClick={() => toggleCountrySelection(country)}
          >
            <Link href={`/country/${country.name.common}`}>
              <Image
                src={country.flags.svg}
                alt={country.name.common}
                width={64}
                height={40}
                className="mx-auto mb-2"
              />
              <h2 className="text-lg font-semibold">{country.name.common}</h2>
            </Link>
          </div>
        ))}
      </div>
      {selectedCountries.length === 2 && (
        <div className="mt-6 p-4 border rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-center">Country Comparison</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            {selectedCountries.map((country) => (
              <div key={country.name.common} className="p-4 border rounded-lg">
                <h3 className="font-bold">{country.name.common}</h3>
                <p>
                  <strong>Population:</strong>{" "}
                  {country.population?.toLocaleString() || "N/A"}
                </p>
                <p>
                  <strong>Area:</strong>{" "}
                  {country.area?.toLocaleString() || "N/A"} km²
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
