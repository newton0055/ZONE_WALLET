// import api from "./api";

// import { useAuth } from "@clerk/nextjs";

// export default function Token() {
//   const { getToken } = useAuth();

//   const FetchWithAuth = async (url: string, options: RequestInit = {}) => {
//     const token = await getToken();

//     return fetch(url, {
//       ...options,
//       headers: {
//         ...(options.headers || {}),
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });
//   };
// }
