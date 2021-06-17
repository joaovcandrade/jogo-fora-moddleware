import Forca from "../screens/Forca";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function Routes() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/">
            <Forca />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default Routes;
