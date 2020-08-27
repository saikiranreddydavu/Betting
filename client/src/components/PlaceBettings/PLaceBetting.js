import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import getBettingInstance from "../shared/BettingInstance";
import { Grid, Card, Button, Input, Popup } from "semantic-ui-react";
import DisplayBettingCards from "./DisplayBetCards";
import "./PlaceBetting.css";
function PLaceBetting({ accounts, web3 }) {
  const [instance, setInstance] = useState({});
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [betValue, setBetValue] = useState("");
  const [proposals, setProposals] = useState([]);
  const address = useParams().address;
  useEffect(() => {
    async function loadInstance() {
      const _instance = getBettingInstance(address);
      setInstance(_instance);
      const _team1 = await _instance.methods.team1().call();
      const _team2 = await _instance.methods.team2().call();
      setTeam1(_team1);
      setTeam2(_team2);
      const id = await _instance.methods.Index().call();
      let _proposals = [];
      for (let i = 1; i <= id; i++) {
        let _proposal = await _instance.methods.proposals(i).call();
        _proposals.push({
          bidCreator: _proposal[0],
          bidAcceptor: _proposal[1],
          team: _proposal[2],
          winner: _proposal[3],
          pending: _proposal[4],
          value: _proposal[5],
          index: _proposal[6],
        });
      }
      setProposals(_proposals);
    }
    loadInstance();
  }, []);

  const onTeam = async (event) => {
    await instance.methods
      .createProposal(event.target.name)
      .send({ from: accounts[0], value: web3.utils.toWei(betValue, "ether") });
    const id = await instance.methods.Index().call();
    let _proposal = await instance.methods.proposals(id).call();
    let _proposals = {
      bidCreator: _proposal[0],
      bidAcceptor: _proposal[1],
      team: _proposal[2],
      winner: _proposal[3],
      pending: _proposal[4],
      value: _proposal[5],
      index: _proposal[6],
    };
    setProposals([...proposals, _proposals]);
  };
  console.log(proposals);
  return (
    <div>
      <div className="PlaceBettings__buttons">
        <Button.Group>
          <Button size="huge" name={team1} onClick={onTeam}>
            {team1}
          </Button>

          <Button.Or />
          <Button positive size="huge" name={team2} onClick={onTeam}>
            {team2}
          </Button>
        </Button.Group>
      </div>
      <br />
      <div className="PlaceBettings__buttons">
        <Input
          label={{ basic: true, content: "ETH" }}
          labelPosition="right"
          placeholder="Enter Bet value"
          value={betValue}
          onChange={(event) => setBetValue(event.target.value)}
        />
      </div>

      <br />
      <Grid divided="vertically">
        <Grid.Row columns={2}>
          {proposals.map((proposal, id) => {
            return (
              <Grid.Column key={id} className="PlaceBettings__leftcontainer">
                <DisplayBettingCards
                  proposal={proposal}
                  web3={web3}
                  instance={instance}
                  accounts={accounts}
                />
              </Grid.Column>
            );
          })}
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default PLaceBetting;
