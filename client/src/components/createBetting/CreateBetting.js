import React, { useState, useEffect } from "react";
import { Form, Button } from "semantic-ui-react";
function CreateBetting({ BettingFactoryInstance, accounts, web3 }) {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  useEffect(() => {
    async function loadBettings() {
      const Bettings = await BettingFactoryInstance.methods
        .getBettings()
        .call();
    }
    loadBettings();
  }, []);
  const onSubmit = async () => {
    await BettingFactoryInstance.methods
      .createBetting(team1, team2)
      .send({ from: accounts[0] });
    setTeam1("");
    setTeam2("");
  };
  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <Form.Input
            placeholder="team1"
            value={team1}
            onChange={(event) => setTeam1(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            placeholder="team2"
            value={team2}
            onChange={(event) => setTeam2(event.target.value)}
          />
        </Form.Field>
        <Button color="green">Create Betting</Button>
      </Form>
    </div>
  );
}

export default CreateBetting;
