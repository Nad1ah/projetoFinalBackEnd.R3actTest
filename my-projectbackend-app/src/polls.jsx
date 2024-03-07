import axios from "axios";

const URL_API = "http://localhost:3000/polls";

export const getAllPolls = async () => {
  try {
    const response = await axios.get(`${URL_API}/polls`);
    return response.data;
  } catch (error) {
    console.error("Error fetching polls:", error);
    return [];
  }
};

export const voteInPoll = async (pollId, option) => {
  try {
    const response = await axios.post(`${URL_API}/polls/${pollId}/vote`, {
      option,
    });
    return response.data;
  } catch (error) {
    console.error("Error voting in poll:", error);
    return null;
  }
};
