import React from "react";

export interface DisplayValueProps {
  value: any;
}

export function DisplayValue({ value }: DisplayValueProps) {
  // TODO: Make this show the concept name for ConceptUUID type values
  return (
    <div>
      {Array.isArray(value)
        ? typeof value[0] === "object"
          ? value.map((v, i) => (
              <div key={`${v}-${i}`} style={{ marginBottom: "1em" }}>
                <DisplayValue value={v} />
              </div>
            ))
          : value.join(", ")
        : typeof value === "object" && value !== null
        ? Object.entries(value).map(([k, v], i) => (
            <div key={`${k}-${i}`}>
              {k}: <DisplayValue value={v} />
            </div>
          ))
        : typeof value === "string" || typeof value === "number"
        ? value
        : value == null
        ? "none"
        : JSON.stringify(value)}
    </div>
  );
}
