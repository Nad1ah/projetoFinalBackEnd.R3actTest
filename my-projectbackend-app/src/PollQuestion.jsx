import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { MUTATION_VOTE, QUERY_GET_POLL } from "../GraphQL";
import { useState } from "react";
import { Card } from "react-bootstrap";

export function PollQuestion({ poll, userId }) {
  const [state, setState] = useState(defaultState);
  const [vote, { data, loading, error }] = useMutation(MUTATION_VOTE);

  const { pollId } = useParams();

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
  } = useQuery(QUERY_GET_POLL, {
    variables: { pollId },
  });

  const defaultState = {
    optionId: "",
    pollId: pollId,
    voteBtnText: "🗳 Vote",
    voteBtnStyle: "primary",
  };

  const handleOptionChange = (e) => {
    const optionId = e.currentTarget.value;
    setState((prev) => ({ ...prev, optionId }));
  };

  const handleVote = () => {
    if (state.optionId) {
      vote({
        variables: {
          optionId: state.optionId,
          userId,
        },
      }).then(({ data }) => {
        if (data && data.vote) {
          const newOptionCount = data.vote.option.count;
          setState((prev) => ({
            ...prev,
            optionId: "",
            voteBtnText: `Voted: ${newOptionCount}`,
            voteBtnStyle: "success",
          }));
        }
      });
    }
  };

  if (queryLoading) return { Loading };
  if (queryError) return { Error };

  const newLocal = queryData.poll;
  const poll = newLocal;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{poll.question}</Card.Title>
        <Card.Subtitle>
          {poll.options.map((option) => (
            <div key={option.id}>
              <input
                type="radio"
                id={option.text}
                name="option"
                value={option.id}
                checked={state.optionId === option.id}
                onChange={handleOptionChange}
              />
              <label htmlFor={option.text}>{option.text}</label>
              <span> ({option.count})</span>
            </div>
          ))}
        </Card.Subtitle>
        <button
          className={`btn btn-${state.voteBtnStyle}`}
          disabled={loading}
          onClick={handleVote}
        >
          {state.voteBtnText}
        </button>
      </Card.Body>
    </Card>
  );
}
