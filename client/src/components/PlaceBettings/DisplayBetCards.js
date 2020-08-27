import React, { useState } from "react";
import { Card, Button } from "semantic-ui-react";
function DisplayBetCards({ proposal, web3, instance, accounts }) {
  const [isPending, setIsPending] = useState(proposal.pending);
  const onAccept = async () => {
    try {
      await instance.methods
        .acceptProposal(proposal.index)
        .send({ from: accounts[0], value: proposal.value });
      setIsPending(!isPending);
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <div>
      <Card fluid>
        <Card.Content>
          <Card.Header>
            {proposal.team} wins, my bet is{" "}
            {web3.utils.fromWei(proposal.value, "ether")} ETH
          </Card.Header>
          <Card.Meta>Your Eth will be in contract</Card.Meta>
          <Card.Description>
            <strong>Bid creator:{proposal.bidCreator}</strong>
          </Card.Description>
          <Card.Description>
            <strong>
              {proposal.bidAcceptor !==
              "0x0000000000000000000000000000000000000000"
                ? `Bid acceptor:${proposal.bidAcceptor}`
                : null}
            </strong>
          </Card.Description>
          <Card.Description>Bet At Your own risk</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="ui two buttons">
            <Button
              basic
              color="green"
              onClick={onAccept}
              disabled={!isPending}
            >
              {!isPending ? "Approved" : "Approve"}
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}

export default DisplayBetCards;
