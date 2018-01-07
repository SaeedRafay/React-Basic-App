import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'reactstrap';
import { Button, Card, CardBody } from 'reactstrap';
import './index.css';

const HotelCard = (props) => {
  return (
    <Col md="6">
      <Card>
        <CardBody>
          <strong>Name: </strong> { props.name }<br/>
          <strong>Price: </strong> { props.price }<br/>
          <strong>City: </strong> { props.city }<br/>
        </CardBody>
      </Card>
    </Col>
  )
}

const HotelRow = (props) => {
  return (
    <Row>
      {
        props.hotelPair.map((hotel, index) => (
          <HotelCard key={index} {...hotel} />
        ))
      }
    </Row>
  )
}

const Hotels = (props) => {
  return (
    <div className="hotels_list">
      {
        props.rpHotels.reduce((pairs, hotel, index) => {
          if(index % 2 === 0) {
             pairs.push([]);
          }
          pairs[pairs.length - 1].push(hotel);
          return pairs;
        }, []).map((pair, index) => (
          <HotelRow key={index} hotelPair={pair} />
        ))
      }
    </div>
  )
}

const HotelSort = (props) => {
  return (
    <div className="hotels_sort text-right">
      <Button color="primary" onClick={() => props.onSort('name')}>Sort By Name</Button>{' '}
      <Button color="primary" onClick={() => props.onSort('price')}>Sort By Price</Button>
    </div>
  )
}

class App extends React.Component {
  state = {
    rHotels: [],
  }

  componentDidMount() {
    fetch('https://api.myjson.com/bins/tl0bp')
      .then(response => response.json())
      .then(json => {
        this.setState({ rHotels: json.hotels });
      });
  }

  sortByKey = (key) => {
    this.setState((prevState) => ({
      rHotels: prevState.rHotels.sort((a, b) => {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      }),
    }))
  };

  render() {
    return (
      <Container>
        <HotelSort onSort={this.sortByKey} />
        <Hotels rpHotels={this.state.rHotels} />
      </Container>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
