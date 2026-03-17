import { useQuery } from "@tanstack/react-query";
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("https://api.dreamprovider.in/graphql");

const GET_COLLEGES = gql`
  query GetColleges {
    collages(pagination: { limit: 100 }) {
      data {
        id
        attributes {
          name
          slug
          locationName
          ratings
          grade
          description
          year
          area
          imgLink
          banner {
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
`;

export function useFetchColleges() {
  return useQuery({
    queryKey: ["colleges"],
    queryFn: async () => {
      const res = await client.request(GET_COLLEGES);
      return res.collages.data;
    },
    staleTime: 1000 * 60 * 60
  });
}

const GET_COLLEGE_BY_SLUG = gql`
  query GetCollegeBySlug($slug: String!) {
    collages(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          name
          slug
          locationName
          description
          videoLink
          year
          ratings
          area
          grade
          hostelArea
          courses
          ranking
          imgLink
          tag
          published
          companies
          mapLink
          placements
          FeeMatrix
          gallery
          faqs
          reviews
          docReq
          eligibility
          banner {
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
`;

export function useFetchCollegeBySlug(slug) {
  return useQuery({
    queryKey: ["college", slug],
    queryFn: async () => {
      const res = await client.request(GET_COLLEGE_BY_SLUG, { slug });
      return res.collages.data[0];
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 60
  });
}
