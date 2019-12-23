import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const DEFAULT_HPP = '10';
const PARAM_HPP = 'hitsPerPage=';


  const largeColumn = {
    width: '40%',
    };
    const midColumn = {
    width: '30%',
    };
    const smallColumn = {
    width: '10%',
    };

class App extends Component {
  constructor(props) {
    super(props);
      
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      };
    
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

    onDismiss(id) {
      const { searchKey, results } = this.state;
      const { hits, page } = results[searchKey];
      const isNotId = item => item.objectID !== id;
      const updatedHits = hits.filter(isNotId);
      this.setState({
        results: { ...results, [searchKey]: {hits: updatedHits, page }}
        });
    }
    onSearchChange (event) {
      this.setState({ searchTerm: event.target.value });
    }

    setSearchTopStories(result) {
      const {hits, page } = result;
      const { searchKey, results } = this.state;
      const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
      const updatedHits = [ ...oldHits, ...hits ];
      this.setState({
        results: {...results, [searchKey]: { hits: updatedHits, page }}
        });
    }

    needsToSearchTopStories(searchTerm) {
      return !this.state.results[searchTerm];
    }

    onSearchSubmit(event) {
      const { searchTerm } = this.state;
      this.setState({searchKey: searchTerm});

      let need = this.needsToSearchTopStories(searchTerm);
      console.log('needsToSearchTopStories', need);
      if (need) {
        this.fetchSearchTopStories(searchTerm);
      }
      event.preventDefault();
    }

    fetchSearchTopStories(searchTerm, page=0) {
      console.log('requested page:',page, 'search term:', searchTerm);
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => this.setState({error}));
      }

    componentDidMount() {
      const { searchTerm } = this.state;
      this.setState({searchKey: searchTerm});
      this.fetchSearchTopStories(searchTerm);
      }

    
  render () {
    const { searchTerm, results, searchKey, error } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    if (error) {
      return <p>something bad happend on the way to fetch data</p>
    }
    if (!results) {return null;}
    return (
      <div className="page">
        <div className="interactions">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          children='Search'
          onSubmit={this.onSearchSubmit}
        />
        </div>
          {results ?
          <Table
            list={list}
            onDismiss={this.onDismiss}
          /> : 
            null}
          <div className="interactions">
            <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
              More
            </Button>
          </div>
        </div>
    );
  }
}


class Search extends Component {
  render() {
    const { value, onChange, onSubmit, children } = this.props;
    return (
    <form onSubmit={onSubmit}>
      {/*children*/} <input
        type="text"
        value={value}
        onChange={onChange}
      />
      <button type="submit">
        {children}
      </button>
    </form>
    );
  }
}

class Table extends Component {
  render() {
    const { list, onDismiss } = this.props;
    return (
      <div className="table">
          {list.map(item =>
        <div key={item.objectID} className="table-row" >
          <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            {/* <span style={smallColumn}>{item.created_at}</span> */}
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
