import api  from "@/services/api"; // Adjust the import path as necessary

interface CreateWalletInput {
    userId: string; // User ID for whom the wallet is created
    walletName: string; // Name of the wallet
}
 
 

export const createWallet = async (input: CreateWalletInput) => {
    try {
        const response = await api.post("/wallet/create", input );
        return response.data; // Return the response data (e.g., wallet address)
    } catch (error: any) {
        // console.error("Error creating wallet:", error.response?.data);
        throw error.response?.data || "Failed to create wallet"; // Handle errors
    }
};