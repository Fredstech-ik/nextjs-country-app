import { notFound } from "next/navigation";
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

export default async function CountryPage({
  params,
}: {
  params: { countryName: string };
}) {
  const countryName = decodeURIComponent(params.countryName);

  const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
  if (!res.ok) return notFound();

  const country: Country[] = await res.json();
  const countryData = country[0];

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold">{countryData.name.common}</h1>
      <p>
        <strong>Population:</strong> {countryData.population?.toLocaleString()}
      </p>
      <p>
        <strong>Area:</strong> {countryData.area?.toLocaleString()} km²
      </p>
      <Image
        src={countryData.flags.svg}
        alt={countryData.name.common}
        width={200}
        height={100}
      />
    </div>
  );
}
