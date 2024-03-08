import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PollQuestion from "./componentes-pollsQuestions";
import Login from "./components-login";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Login />
        </Route>
        <Route path="/poll/:pollId" component={PollQuestion} />
      </Switch>
    </Router>
  );
}

export default App;
