import React, { useState, useEffect } from "react";
import { Icon, Label, Menu, Table } from "semantic-ui-react";
function MatchWinnerTable({ instance, accounts, id }) {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [winner, setWinner] = useState("");
  useEffect(() => {
    async function loadData() {
      const _team1 = await instance.methods.team1().call();
      const _team2 = await instance.methods.team2().call();
      const _winner = await instance.methods.MatchWinner().call();
      setTeam1(_team1);
      setTeam2(_team2);
      setWinner(_winner);
    }
    loadData();
  }, []);
  return (
    <Table.Row>
      <Table.Cell>{id}</Table.Cell>
      <Table.Cell>{`${team1} VS ${team2}`}</Table.Cell>
      <Table.Cell>{winner}</Table.Cell>
    </Table.Row>
  );
}

export default MatchWinnerTable;
