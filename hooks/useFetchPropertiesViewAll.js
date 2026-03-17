import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";

const GRAPHQL_URL = "https://api.dreamprovider.in/graphql";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const useFetchPropertiesViewAll = ({ filters }) => {
  const graphQLClient = new GraphQLClient(GRAPHQL_URL, {
    headers: {
      Authorization: `Authorization: Bearer d0072a178bc47174896c19a2fa228a4e0f7d3a733485fbc6aff4e3e5c98200a4e27f37c8cac951991afeac01f9cc78848285d81acd1aabe474995a7a8feb96dfd8982963726c88b708777b12a93d8c9906863c76f39368c6958825e756d476589c30fec873c0fb8b970508b31a9fb4159a7b8732d90e3a53bc897cfdbfd8fa2f`,
    },
  });

  // Helper to get cached data for initial load
  const getCachedData = () => {
    try {
      if (typeof window === 'undefined') return undefined; // SSR protection
      const cacheKey = `properties_cache_${JSON.stringify(filters)}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        // We don't check timestamp here because we want to show OLD data immediately
        // while fetching new data in background (Stale-While-Revalidate)
        return data;
      }
    } catch (e) {
      console.warn("Error reading properties cache", e);
    }
    return undefined;
  };

  const fetchAndSortAllProperties = async () => {
    const cacheKey = `properties_cache_${JSON.stringify(filters)}`;

    // Note: We deliberately removed the "return cached data" block here.
    // This function now ALWAYS fetches fresh data from the server.
    // The "Instant Load" is handled by `initialData` in useQuery below.

    // Step 1: Fetch Page 1 to get meta data
    const firstPageQuery = gql`
      query properties(
        $page: Int!
        $location: String
        $property_type: String
        $gender: String
        $seater: String
        $city_id: ID
      ) {
        properties(
          pagination: { page: $page, pageSize: 20 }
          filters: {
            location: { name: { eq: $location } }
            city: { id: { eq: $city_id } }
            property_types: { containsi: $property_type }
            genders: { name: { containsi: $gender } }
            seaters: { value: { containsi: $seater } }
          }
        ) {
          meta {
            pagination {
              pageCount
            }
          }
          data {
            id
            attributes {
              ranking_id
              viewsCount { count }
              tag_value
              tag_color
              saved
              name
              property_types
              description
              verification_type
              price
              genders {
                data { attributes { name } }
              }
              approved
              full
              status
              owner_number
              property_chips_banner {
                data {
                  attributes {
                    type
                    text_value
                    image_banner { data { attributes { url } } }
                  }
                }
              }
              address
              latlng
              images { data { attributes { url previewUrl caption } } }
              main_image { data { attributes { url previewUrl caption } } }
              city { data { attributes { name } } }
              location { data { attributes { name } } }
              facilities {
                data {
                  attributes {
                    value
                    image { data { attributes { url caption } } }
                  }
                }
              }
              seaters { data { attributes { value } } }
            }
          }
        }
      }`;

    const variables = {
      page: 1,
      location: filters.location,
      property_type: filters.property_type,
      gender: filters.gender,
      seater: filters.seater,
      city_id: filters.city,
    };

    const firstPageData = await graphQLClient.request(firstPageQuery, variables);
    let allProperties = [...firstPageData.properties.data];
    const totalPages = firstPageData.properties.meta.pagination.pageCount;

    // Step 2: Fetch remaining pages if any
    if (totalPages > 1) {
      const promises = [];
      // Re-use the same query structure for subsequent pages
      const subsequentPageQuery = firstPageQuery;

      for (let page = 2; page <= totalPages; page++) {
        promises.push(
          graphQLClient.request(subsequentPageQuery, { ...variables, page })
        );
      }

      const results = await Promise.all(promises);
      results.forEach((res) => {
        allProperties = [...allProperties, ...res.properties.data];
      });
    }

    // Step 3: Sort logic
    const sortedProperties = allProperties.sort((a, b) => {
      const aRank = a.attributes.ranking_id || "0";
      const bRank = b.attributes.ranking_id || "0";
      // Descending order using numeric comparison for strings
      return bRank.localeCompare(aRank, undefined, { numeric: true });
    });

    // Step 4: Cache the result
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: sortedProperties
      }));
    } catch (e) {
      console.warn("Failed to save to localStorage (quota exceeded?)", e);
    }

    return sortedProperties;
  };

  return useQuery({
    queryKey: ["fetch-properties-all-cached", filters],
    queryFn: fetchAndSortAllProperties,
    initialData: getCachedData, // Serve cached data immediately
    staleTime: 5 * 60 * 1000, // 5 minutes freshness to prevent immediate re-fetch on "Back"
    refetchOnWindowFocus: false, // Optional: set to true if you want auto-refresh when switching tabs
    refetchOnMount: true, // Ensure we check on mount
    refetchOnReconnect: true,
  });
};

export default useFetchPropertiesViewAll;
