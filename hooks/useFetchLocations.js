import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";
const GRAPHQL_URL = "https://api.dreamprovider.in/graphql";
const graphQLClient = new GraphQLClient(GRAPHQL_URL, {});

export function useFetchLocation() {
   return useQuery({
    queryKey: ["fetch-location"],
    queryFn: async () => {
      const data = await graphQLClient.request(
        gql`
          query {
            cities {
              data {
                id
                attributes {
                  name
                  locations {
                    data {
                      id
                      attributes {
                        name
                        image {
                          data {
                            attributes {
                              url
                              caption
                            }
                          }
                        }
                      }
                    }
                  }
                  image {
                    data {
                      attributes {
                        url
                      }
                    }
                  }
                }
              }
            }
      }
        `
    );
    return data;
}});
}
