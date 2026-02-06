// import { getActiveFeedingStatus } from "@/services/apiHorse";
// import { FeedingStatusPayload } from "@/types";
// import { useQuery } from "@tanstack/react-query";

// export function useGetActiveFeedingStatus(horseId: string) {
//   const { data, error, isFetching } = useQuery<FeedingStatusPayload | null>({
//     queryKey: ["active-feeding", horseId],
//     queryFn: () => getActiveFeedingStatus(horseId),

//     //  refetch when navigating inside the app
//     refetchOnMount: false,

//     //  Refetch when user returns to browser tab
//     refetchOnWindowFocus: true,

//     //  Refetch if internet disconnects & reconnects
//     refetchOnReconnect: true,

//     //  Treat data as not fresh for entire app session
//     staleTime: 0,

//     //  Keep cached even if component unmounts
//     gcTime: 10 * 60 * 1000,

//     retry: (failureCount, error: any) => {
//       if (
//         error?.message?.includes("404") ||
//         error?.message?.includes("No active feeding")
//       ) {
//         return false;
//       }
//       return failureCount < 2;
//     },
//   });

//   return {
//     activeFeedingStatus: data ?? null,
//     isFetching,
//     error,
//   };
// }
