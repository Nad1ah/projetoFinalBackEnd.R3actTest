import { getAllPolls, voteInPoll } from "./polls";
import { useEffect, useState } from "react";

function App() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      const fetchedPolls = await getAllPolls();
      setPolls(fetchedPolls);
    };

    fetchPolls();
  }, []);

  const handleVote = async (pollId, option) => {
    const votedPoll = await voteInPoll(pollId, option);
    if (votedPoll) {
      setPolls((prevPolls) =>
        prevPolls.map((poll) => (poll._id === pollId ? votedPoll : poll))
      );
    }
  };

  return (
    <div>
      <h1>Enquetes</h1>
      <ul>
        {polls.map((poll) => (
          <li key={poll._id}>
            {poll.question}
            <ul>
              {poll.options.map((option, index) => (
                <li key={index}>
                  <button onClick={() => handleVote(poll._id, option)}>
                    Votar em {option}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
