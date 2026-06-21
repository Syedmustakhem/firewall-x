import axios from "axios";

export async function
reportSuccess(
  deploymentId: string
) {

  await axios.patch(
    `http://localhost:5000/api/deployments/${deploymentId}/status`,
    {
      status: "success"
    }
  );

}

export async function
reportFailure(
  deploymentId: string
) {

  await axios.patch(
    `http://localhost:5000/api/deployments/${deploymentId}/status`,
    {
      status: "failed"
    }
  );

}