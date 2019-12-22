import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;


  const largeColumn = {
    width: '40%',
    };
    const midColumn = {
    width: '30%',
    };
    const smallColumn = {
    width: '10%',
    };

  function isSearched(searchTerm) {
    return function (item) {
      return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
  }

class App extends Component {
  constructor(props) {
    super(props);
      
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
      };
    
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

    onDismiss(id) {
      const isNotId = item => item.objectID !== id;
      const updatedHits = this.state.result.hits.filter(isNotId);
      this.setState({
        result: { ...this.state.result, hits: updatedHits }
        });
    }
    onSearchChange (event) {
      this.setState({ searchTerm: event.target.value });
    }

    setSearchTopStories(result) {
      this.setState({ result });
    }

    componentDidMount() {
      const { searchTerm } = this.state;
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
      }

    
  render () {
    const { searchTerm, result } = this.state;
    if (!result) {return null;}
    return (
      <div className="page">
        <div className="interactions">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          children='Search'
        />
        </div>
        <Table
          list={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
          />
        </div>
    );
  }
}


class Search extends Component {
  render() {
    const { value, onChange, children } = this.props;
    return (
    <form>
      {children} <input
        type="text"
        value={value}
        onChange={onChange}
      />
    </form>
    );
  }
}

class Table extends Component {
  render() {
    const { list, pattern, onDismiss } = this.props;
    return (
      <div className="table">
        {list.filter(isSearched(pattern)).map(item =>
        <div key={item.objectID} className="table-row" >
          <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span >
            <Button onClick={() => onDismiss(item.objectID)}>
              Dismiss
            </Button>
          </span>
        </div>
        )}
      </div>
    );
  }
}

class Button extends Component {
  render() {
    const {onClick, className = '', children,} = this.props;
    return (
      <button
        onClick={onClick}
        className={className}
        type="button"
        //className="button-inline"
        >
        {children}
      </button>
    );
  }
}
export default App;
