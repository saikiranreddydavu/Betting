// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract BettingFactory {
    address[] public deployedBettings;
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    function createBetting(string memory _team1, string memory _team2) public {
        require(msg.sender == owner, "only owner can ceate betting");
        address newBetting = address(new Betting(_team1, _team2, msg.sender));
        deployedBettings.push(newBetting);
    }

    function getBettings() public view returns (address[] memory) {
        return deployedBettings;
    }
}

contract Betting {
    address public owner;
    string public team1;
    string public team2;
    uint256 public Index;
    bool public active = true;
    uint256 public endTime;
    string public MatchWinner;

    constructor(
        string memory _team1,
        string memory _team2,
        address creator
    ) public {
        owner = creator;
        team1 = _team1;
        team2 = _team2;
        endTime = now + 3 hours;
    }

    struct Proposal {
        address bidCreator;
        address bidAcceptor;
        string team;
        address winner;
        bool pending;
        uint256 value;
        uint256 index;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can call");
        _;
    }
    mapping(uint256 => Proposal) public proposals;

    function createProposal(string memory _team) public payable {
        require(now <= endTime, "time out betting closed");
        require(
            keccak256(bytes(_team)) == keccak256(bytes(team1)) ||
                keccak256(bytes(_team)) == keccak256(bytes(team2)),
            "specify corrrect team"
        );
        require(active, "betting is not active");
        Index++;
        Proposal memory newProposal = Proposal({
            bidCreator: msg.sender,
            bidAcceptor: address(0),
            team: _team,
            pending: true,
            winner: address(0),
            value: msg.value,
            index: Index
        });
        (bool success, ) = address(this).call.value(msg.value)("");
        //require(success,"tx execution failed");
        proposals[Index] = newProposal;
    }

    function acceptProposal(uint256 _index) public payable {
        require(now <= endTime, "time out betting closed");
        require(_index <= Index, "index not valid");
        require(active, "betting is not active");
        require(
            proposals[_index].pending == true,
            "Proposal is not in pending state"
        );
        require(
            msg.value == proposals[_index].value,
            "bidding value not matched"
        );
        require(
            msg.sender != proposals[_index].bidCreator,
            "bid creator should not be bid acceptor"
        );
        proposals[_index].bidAcceptor = msg.sender;
        proposals[_index].pending = false;
        proposals[_index].value = proposals[_index].value + msg.value;

        (bool success, ) = address(this).call.value(msg.value)("");
    }

    function winner(string memory _winnerTeam) public onlyOwner {
        require(active, "Betting is not active");
        require(
            keccak256(bytes(_winnerTeam)) == keccak256(bytes(team1)) ||
                keccak256(bytes(_winnerTeam)) == keccak256(bytes(team2)),
            "specify corrrect team"
        );
        for (uint256 i = 1; i <= Index; i++) {
            if (proposals[i].pending == false) {
                if (
                    keccak256(bytes(proposals[i].team)) ==
                    keccak256(bytes(_winnerTeam))
                ) {
                    (bool success, ) = proposals[i].bidCreator.call.value(
                        proposals[i].value
                    )("");
                } else {
                    (bool success, ) = proposals[i].bidAcceptor.call.value(
                        proposals[i].value
                    )("");
                }
            } else {
                (bool success, ) = proposals[i].bidCreator.call.value(
                    proposals[i].value
                )("");
            }
        }
        MatchWinner = _winnerTeam;
        active = false;
    }

    function Draw() public onlyOwner {
        require(active, "Betting is not active");
        for (uint256 i = 1; i <= Index; i++) {
            if (proposals[i].pending) {
                (bool s, ) = proposals[i].bidAcceptor.call.value(
                    proposals[i].value
                )("");
            } else {
                (bool s1, ) = proposals[i].bidAcceptor.call.value(
                    proposals[i].value / 2
                )("");
                (bool s2, ) = proposals[i].bidCreator.call.value(
                    proposals[i].value / 2
                )("");
            }
        }
    }

    function balanceInContract() public view returns (uint256) {
        return address(this).balance;
    }
}
