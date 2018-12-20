import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styled from 'styled-components';
import './App.css';

const requestFullscreen = (ele) => {
  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.webkitRequestFullscreen) {
    ele.webkitRequestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen();
  } else if (ele.msRequestFullscreen) {
    ele.msRequestFullscreen();
  } else {
    console.log('Fullscreen API is not supported.');
  }
};

const fullscreen = e => {
  let i = document.getElementById("apparea");
  requestFullscreen(i);
  e.preventDefault();
}

const Index = () => (
  <div className="App">
    <Link to="/game/3">start</Link>
    <a href="#" onClick={e => fullscreen(e)}>fullscreen</a>
  </div>
);


const Item = props => {
  let styleMap = {
    "MUSHROOM": {
      color: "#d7c3aa"
    },
    "LETTUCE": {
      color: "#9dbe70"
    },
    "SAUCE": {
      color: "rgb(231, 194, 58)"
    },
    "ONION": {
      color: "#703e13"
    },
    "PICKLE": {
      color: "#71be58"
    },
    "TOMATO": {
      color: "#973030"
    }
  }

  return (<p {...props}
    style={styleMap[props.content]}>
    {props.content}
  </p>)
};

const PointMarker = styled.span`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  padding: 8px;
  border: 2px solid;
  text-align: center;
  margin: 0 auto;
  color: #282c34;
`;

const Card = props => {
  let { contents, points, active } = props;

  return (
    <div
      className={props.className}
      onClick={props.onClick}
      style={{
        opacity: active ? 1 : 0.3
      }}>
      <PointMarker>{points}</PointMarker>
      {contents.map((c, i) => {
        return <Item key={i} content={c}></Item>
      })}
    </div>
  );
};

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  flex: 1;

  max-width: 30%;

  margin: 0.5em;
  padding: 0.5em;
  padding-top: 2em;
  
  background: slategray;
  border-radius: 0.5em;
  width: 10%;

  font-weight: bold;

  & p {
    margin: 0.5em;
  }
`;

const CardArea = styled.div`
  display: flex;
  justify-content: space-around;
  text-align: center;
`;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const pointsFor = (selection) => {
  return Math.floor((selection.length ** 2) / 2);
};

const generateCard = () => {
  const options = ["MUSHROOM", "LETTUCE", "SAUCE", "ONION", "PICKLE", "TOMATO"];
  let length = getRandomInt(2, 6);
  let chosen = [];
  for (let i = 0; i < length; i++) {
    chosen.push(options[Math.floor(Math.random() * options.length)]);
  }

  chosen.sort();

  return {
    points: pointsFor(chosen),
    contents: chosen,
    active: true
  };
}

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: []
    };
  }

  componentDidMount() {
    let { noCards } = this.props.match.params;

    let cards = [];
    for (let i = 0; i < noCards; i++) {
      cards.push(generateCard());
    }

    this.setState({
      cards
    });
  }

  handleReset() {
    let cards = this.state.cards;
    cards = cards.map(() => generateCard());
    this.setState({
      cards
    });
  }

  handleCardClick(i) {
    let cards = this.state.cards;
    cards[i].active = !cards[i].active;
    this.setState({
      cards
    });
  }

  render() {
    return (
      <div>
        <a
          href="#"
          onClick={e => this.handleReset(e)}
          style={{
            padding: "1em"
          }}
        >reset</a>
        <CardArea>
          {this.state.cards.map((c, i) =>
            <StyledCard
              onClick={() => this.handleCardClick(i)}
              key={i}
              contents={c.contents}
              points={c.points}
              active={c.active}
            />)}
        </CardArea>
      </div>
    );
  }
}

const AppArea = styled.div`
  display: flex;
  justify-content: space-around;;
  flex-direction: column;
  min-height: 100vh;
  background-color: #282c34;
`;

const App = () => (
  <Router>
    <div>
      <AppArea id="apparea">
        <Route path="/game/:noCards" exact component={Game} />
        <Route path="/" exact component={Index} />
      </AppArea>
    </div>
  </Router>
);

export default App;
