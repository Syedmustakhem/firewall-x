import axios from "axios";

export async function downloadConfig(
  policyId: string
) {

  const response =
    await axios.get(
      `http://localhost:5000/api/policies/${policyId}/config`
    );

  return response.data;

}