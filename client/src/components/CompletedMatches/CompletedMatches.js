import React, { useState, useEffect } from "react";
import getBettingInstance from "../shared/BettingInstance";
import MatchWinnerTable from "./MatchWinnerTable";
import { Icon, Label, Menu, Table } from "semantic-ui-react";

import "./CompletedMatches.css";
function CompletedMatches({ accounts, web3, BettingFactoryInstance }) {
  const [isActiveArray, setIsActiveArray] = useState([]);
  const [Bettings, setBettings] = useState([]);
  const [BettingInstances, setBettingInstances] = useState([]);
  useEffect(() => {
    async function loadBettings() {
      const bettings = await BettingFactoryInstance.methods
        .getBettings()
        .call();
      setBettings(bettings);
      const bettingInstances = bettings.map((bettingAddress) => {
        return getBettingInstance(bettingAddress);
      });
      setBettingInstances(bettingInstances);
      let _isActiveArray = [];
      for (let i = 0; i < bettingInstances.length; i++) {
        let active = await bettingInstances[i].methods.active().call();
        _isActiveArray.push(active);
      }
      setIsActiveArray(_isActiveArray);
    }
    loadBettings();
  }, []);
  return (
    <div className="completedmatches__container">
      <Table celled size="large" textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>Match</Table.HeaderCell>
            <Table.HeaderCell>Winner</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {BettingInstances.map((instance, id) => {
            if (isActiveArray[id] === false) {
              return (
                <MatchWinnerTable
                  id={id}
                  instance={instance}
                  accounts={accounts}
                />
              );
            }
          })}
        </Table.Body>
      </Table>
    </div>
  );
}

export default CompletedMatches;
