import React, { useState, useEffect } from "react";
import { Card, Button, Popup, Grid, Header } from "semantic-ui-react";
import { Link } from "react-router-dom";
function BettingCard({ instance, accounts }) {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [owner, setOwner] = useState("");
  useEffect(() => {
    async function fetchTeams() {
      const _team1 = await instance.methods.team1().call();
      const _team2 = await instance.methods.team2().call();
      setTeam1(_team1);
      setTeam2(_team2);
      const _owner = await instance.methods.owner().call();
      setOwner(_owner);
    }
    fetchTeams();
  }, []);
  const pickWinner = async (event) => {
    console.log(event.target.name);
    await instance.methods
      .winner(event.target.name)
      .send({ from: accounts[0] });
  };
  return (
    <div>
      <Card color="grey">
        <Card.Content>
          <Card.Header>{`${team1} VS ${team2}`}</Card.Header>
          <Card.Description>IPL</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="ui two buttons">
            <Link to={`/placeBet/${instance.options.address}`}>
              <Button basic color="green">
                Place Bet
              </Button>
            </Link>
            {accounts[0] === owner && (
              // <Button basic color="green" onClick={pickWinner}>
              //   Pick Winner
              // </Button>
              <Popup trigger={<Button>Pick Winner</Button>} flowing hoverable>
                <Grid centered divided columns={2}>
                  <Grid.Column textAlign="center">
                    <Button name={team1} onClick={pickWinner}>
                      {team1}
                    </Button>
                  </Grid.Column>
                  <Grid.Column textAlign="center">
                    <Button name={team2} onClick={pickWinner}>
                      {team2}
                    </Button>
                  </Grid.Column>
                </Grid>
              </Popup>
            )}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}

export default BettingCard;
