import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

const HotelCard = (props) => {
  return (
    <div className="card">
      <div className="card-header">
        <strong>Name: </strong> { props.name }
      </div>
      <div className="card-body">
        <strong>Price: </strong> { props.price }<br/>
        <strong>City: </strong> { props.city }<br/>
        <strong>Availability: </strong><br/>
        { JSON.stringify(props.availability) }
      </div>
    </div>
  )
}

class Hotels extends React.Component {

  state = {
    rHotels: [],
    counter: 1,
  }

  componentDidMount() {
    fetch('https://api.myjson.com/bins/tl0bp')
      .then(response => response.json())
      .then(json => {
        this.setState({ rHotels: json.hotels });
      });
  }

  render() {
    return (
      <div>
        {this.state.rHotels.map((hotel) =>
          <HotelCard key={this.state.counter++} {...hotel}  />
        )}
      </div>
    );
  }
}

ReactDOM.render(<Hotels />, document.getElementById('root'));
