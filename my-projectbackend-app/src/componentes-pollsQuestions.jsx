/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MUTATION_VOTE } from "../GraphQL";
import { Card, Button } from "react-bootstrap";
import { Error, Loading } from "./Components";
import joi from "joi";
import client from "../apollo";
import { gql } from "@apollo/client";

const schema = joi.object({
  optionId: joi.string().guid().required(),
});

const QUERY_GET_POLL = gql`
  query GetPoll($pollId: ID!) {
    poll(id: $pollId) {
      id
      question
      options {
        id
        text
        count
      }
    }
  }
`;

export function PollQuestion({ poll, userId }) {
  const [state, setState] = useState(defaultState);
  const { pollId } = useParams();

  const {
    loading: queryLoading,
    error: queryError,
    data,
    refetch,
  } = useQuery(QUERY_GET_POLL, {
    variables: { pollId },
    client,
  });

  // eslint-disable-next-line no-undef
  const [voteMutation] = useMutation(MUTATION_VOTE, {
    client,
  });

  const handleOptionChange = (e) => {
    const optionId = e.currentTarget.value;
    setState((prev) => ({ ...prev, optionId }));
  };

  const handleVote = () => {
    if (state.optionId) {
      const result = schema.validate({ optionId: state.optionId });
      if (result.error) {
        console.error("Invalid optionId: ", result.error.message);
        return;
      }
      voteMutation({
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
          refetch();
        }
      });
    }
  };

  useEffect(() => {
    if (data && data.poll) {
      setState((prev) => ({
        ...prev,
        options: data.poll.options.map((option) => ({
          id: option.id,
          text: option.text,
          count: option.count,
          checked: false,
        })),
      }));
    }
  }, [data]);

  if (queryLoading) return { Loading };
  if (queryError) return { Error };

  return (
    <Card>
      <Card.Body>
        <Card.Title>{poll.question}</Card.Title>
        <Card.Subtitle>
          {state.options.map((option) => (
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
        <Button
          className={`btn btn-${state.voteBtnStyle}`}
          disabled={Loading}
          onClick={handleVote}
        >
          {state.voteBtnText}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default PollQuestion;
