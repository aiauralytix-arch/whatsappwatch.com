"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  getCountryByCode,
  getCountryCallingCode,
  searchCountries,
} from "@/app/dashboard/data/countries";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CountryCodeSelectProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export default function CountryCodeSelect({
  value,
  onChange,
  disabled = false,
  className = "",
}: CountryCodeSelectProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedCountry = getCountryByCode(value);
  const filteredCountries = useMemo(
    () => searchCountries(query, 60),
    [query],
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const buttonLabel = selectedCountry
    ? `${selectedCountry.flag} +${getCountryCallingCode(selectedCountry.countryCode)}`
    : "+1";

  return (
    <div
      ref={rootRef}
      className={cn("relative", isOpen ? "z-[80]" : "z-10", className)}
    >
      <button
        type="button"
        onClick={() => {
          if (disabled) return;
          setIsOpen((prev) => !prev);
          setQuery("");
        }}
        disabled={disabled}
        aria-label="Country code"
        className="flex h-11 w-full items-center justify-between rounded-full border border-[#d5cec3] bg-white px-4 text-sm text-[#161616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161616] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span className="truncate">{buttonLabel}</span>
        <span className="ml-2 text-xs text-[#6b6b6b]">▾</span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-[90] w-[320px] max-w-[90vw] rounded-2xl border border-[#d5cec3] bg-[#fefcf9] p-3 shadow-[var(--shadow-soft)]">
          <Input
            placeholder="Search country or code"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10"
          />
          <div className="mt-2 max-h-64 overflow-y-auto pr-1">
            {filteredCountries.length === 0 ? (
              <p className="px-3 py-2 text-sm text-[#6b6b6b]">No country found.</p>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.countryCode}
                  type="button"
                  onClick={() => {
                    onChange(country.countryCode);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-[#161616] transition hover:bg-white"
                >
                  <span className="truncate pr-2">
                    {country.flag} {country.countryNameEn}
                  </span>
                  <span className="text-[#6b6b6b]">
                    +{getCountryCallingCode(country.countryCode)}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
