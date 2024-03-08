// eslint-disable-next-line no-unused-vars
import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3000",
  cacheUrl: "http://localhost:3000",
  cache: new InMemoryCache(),
});

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
