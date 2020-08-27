import React, { Component } from "react";
import BettingFactory from "./contracts/BettingFactory.json";
import getWeb3 from "./getWeb3";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import MainNavigation from "./components/Navigation/MainNavigation";
import CreateBetting from "./components/createBetting/CreateBetting";
import Bettings from "./components/Bettings/Bettings";
import PlaceBetting from "./components/PlaceBettings/PLaceBetting";
import CompletedMatches from "./components/CompletedMatches/CompletedMatches";
import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    BettingFactoryInstance: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      window.ethereum.on("accountsChanged", (accounts) => {
        this.setState({ accounts });
      });
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BettingFactory.networks[networkId];
      const instance = new web3.eth.Contract(
        BettingFactory.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, BettingFactoryInstance: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
    console.log(this.state.BettingFactoryInstance);
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <Router>
          <MainNavigation accounts={this.state.accounts} />
          <main>
            <Switch>
              <Route path="/" exact>
                <Bettings
                  BettingFactoryInstance={this.state.BettingFactoryInstance}
                  accounts={this.state.accounts}
                  web3={this.state.web3}
                />
              </Route>
              <Route path="/createBetting" exact>
                <CreateBetting
                  BettingFactoryInstance={this.state.BettingFactoryInstance}
                  accounts={this.state.accounts}
                  web3={this.state.web3}
                />
              </Route>
              <Route path="/placeBet/:address">
                <PlaceBetting
                  accounts={this.state.accounts}
                  web3={this.state.web3}
                />
              </Route>
              <Route path="/completedMatches">
                <CompletedMatches
                  accounts={this.state.accounts}
                  web3={this.state.web3}
                  BettingFactoryInstance={this.state.BettingFactoryInstance}
                />
              </Route>
              <Redirect to="/" />
            </Switch>
          </main>
        </Router>
      </div>
    );
  }
}

export default App;
