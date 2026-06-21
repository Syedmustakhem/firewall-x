import axios from "axios";

const API_URL = process.env["API_URL"] ?? "http://localhost:5000";

export async function checkForDeployment(
  deviceId: string
) {

  try {

    const response = await axios.get(
      `${API_URL}/api/deployments/pending/${deviceId}`
    );

    return response.data;

  } catch (error: any) {

    if (error.response?.status === 404) {
      return null;
    }

    throw error;

  }

}