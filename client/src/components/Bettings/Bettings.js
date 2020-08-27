import React, { useEffect, useState } from "react";
import getBettingInstance from "../shared/BettingInstance";
import BettingCard from "./BettingCard";
import { Grid } from "semantic-ui-react";
import "./Bettings.css";
function Bettings({ BettingFactoryInstance, accounts, web3 }) {
  const [BettingInstances, setBettingInstances] = useState([]);
  const [Bettings, setBettings] = useState([]);
  const [isActiveArray, setIsActiveArray] = useState([]);
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
    <div>
      {/* <h2 className="Bettings__title">IPL Bettings</h2> */}
      <div className="Bettings__container">
        <Grid>
          <Grid.Row columns={4}>
            {BettingInstances.map((instance, id) => {
              if (isActiveArray[id]) {
                return (
                  <Grid.Column key={id}>
                    <BettingCard instance={instance} accounts={accounts} />
                  </Grid.Column>
                );
              }
            })}
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
}

export default Bettings;
