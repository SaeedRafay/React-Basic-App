import React from 'react';
import ReactDOM from 'react-dom';
import SearchInput, {createFilter} from 'react-search-input';
import InputRange from 'react-input-range';
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
          <strong>City: </strong> { (props.city)[0].toUpperCase()+(props.city).slice(1) }<br/>
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
      <Button color="primary" onClick={() => props.onSortFunction('name')}>Sort By Name</Button>{' '}
      <Button color="primary" onClick={() => props.onSortFunction('price')}>Sort By Price</Button>
    </div>
  )
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rHotels: [],
      rFilteredHotels: [],
      rSort: { name:'', price:'' },
      rPriceRange: { min: 0, max: 0, },
    };
    this.DefaultPriceRange = '';
    this.rSearchTerm = "";
    this.rPriceFilter = "";
  }

  componentDidMount() {
    fetch('https://api.myjson.com/bins/tl0bp')
      .then(response => response.json())
      .then(json => {
        this.setState({ rHotels: json.hotels });
      })
      .then(() => {
        this.setState({ rFilteredHotels: this.state.rHotels })
      })
      .then(() => {
        this.setState({
          rPriceRange: {
            min: parseInt( Math.min.apply(Math, this.state.rHotels.map( h => {return h.price} )), 10 ),
            max: parseInt( Math.max.apply(Math, this.state.rHotels.map( h => {return h.price} )), 10 ),
          }
        })
      });

  }

  sortByKey = (key) => {
    const sortArray = this.state.rSort;
    if(sortArray[key] === "" || sortArray[key] === "DSC") {
      this.setState(() => ({
        rFilteredHotels: this.state.rFilteredHotels.sort((a, b) => {
          var x = a[key]; var y = b[key];
          if (typeof x==="string") {x=x.toLowerCase()};
          if (typeof y==="string") {y=y.toLowerCase()};
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        })
      }));
      sortArray[key] = "ASC";
    } else {
      this.setState(() => ({
        rFilteredHotels: this.state.rFilteredHotels.sort((a, b) => {
          var x = a[key]; var y = b[key];
          if (typeof x==="string") {x=x.toLowerCase()};
          if (typeof y==="string") {y=y.toLowerCase()};
          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        })
      }));
      sortArray[key] = "DSC";
    }
  }

  searchUpdated = (term) => {
    if(term !== "") { this.rSearchTerm = term; } else { this.rSearchTerm = ""; }

    if(this.rPriceFilter === "") {
      this.setState({ rFilteredHotels: this.state.rHotels.filter(createFilter(term, ['name'])) })
    } else {
      this.setState({ rFilteredHotels: this.state.rHotels.filter((h) => {
        if (h.price >= parseInt(this.rPriceFilter.min, 10) && h.price <= parseInt(this.rPriceFilter.max, 10)) { return h }
      }).filter(createFilter(term, ['name'])), })
    }

    console.log(this.props.rPriceFilter);
  }

  priceFilterFunc = (value) => {
    if(value.min !== this.DefaultPriceRange.min || value.max !== this.DefaultPriceRange.max) {
      this.rPriceFilter = value;
    } else {
      this.rPriceFilter = "";
    }

    if(this.rSearchTerm === "") {
      this.setState({
        rPriceRange: value,
        rFilteredHotels: this.state.rHotels.filter((h) => {
          if (h.price >= parseInt(value.min, 10) && h.price <= parseInt(value.max, 10)) { return h }
        }),
      });
    } else {
      this.setState({
        rPriceRange: value,
        rFilteredHotels: this.state.rHotels.filter((h) => {
          if (h.price >= parseInt(value.min, 10) && h.price <= parseInt(value.max, 10)) { return h }
        }).filter(createFilter(this.rSearchTerm, ['name'])),
      });
    }
  }

  render() {
    this.DefaultPriceRange = {
      min: parseInt( Math.min.apply(Math, this.state.rHotels.map( h => {return h.price} )), 10 ),
      max: parseInt( Math.max.apply(Math, this.state.rHotels.map( h => {return h.price} )), 10 ),
    }

    return (
      <Container>
        <Row>
          <Col md="3">
            <SearchInput className="form-control search-input" placeholder="Hotel Name" onChange={this.searchUpdated} /><br /><br />
            <InputRange minValue={this.DefaultPriceRange.min} maxValue={this.DefaultPriceRange.max} value={this.state.rPriceRange} onChange={this.priceFilterFunc} />
          </Col>
          <Col md="9">
            <HotelSort onSortFunction={this.sortByKey} />
            <Hotels rpHotels={this.state.rFilteredHotels} />
          </Col>
        </Row>
      </Container>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
