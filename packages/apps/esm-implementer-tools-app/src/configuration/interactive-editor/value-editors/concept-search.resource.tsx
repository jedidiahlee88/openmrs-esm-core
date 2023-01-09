import useSWR from "swr";
import { openmrsFetch } from "@openmrs/esm-framework";

export type Concept = {
  answers: Array<ConceptAnswer>;
  display: string;
  mappings: Array<Mappings>;
  uuid: string;
};

type ConceptAnswer = {
  display: string;
  uuid: string;
};

type Mappings = {
  display: string;
};

export function useConceptLookup(query: string) {
  const conceptLookupUrl = `/ws/rest/v1/concept/?q=${query}`;

  const { data, error } = useSWR<{ data: { results: Array<Concept> } }, Error>(
    query ? conceptLookupUrl : null,
    openmrsFetch
  );

  return {
    concepts: data?.data?.results ?? [],
    error: error,
    isSearchingConcepts: !error && !data,
  };
}

export function useGetConceptByUuid(conceptUuid: string) {
  const fetchConceptUrl = `/ws/rest/v1/concept/${conceptUuid}`;

  const { data, error } = useSWR<{ data: Concept }, Error>(
    conceptUuid ? fetchConceptUrl : null,
    openmrsFetch
  );

  return {
    concept: data?.data ?? null,
    error: error,
    isLoadingConcept: !error && !data,
  };
}
