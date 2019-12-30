import React, { Component } from 'react';
import axios from 'axios';
import PropType from 'prop-types';
import fontAwesome from 'font-awesome/css/font-awesome.min.css';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const DEFAULT_HPP = '5';
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

    const SORTS = {
      NONE: list => list,
      TITLE: list => sortBy(list, 'title'),
      AUTHOR: list => sortBy(list, 'author'),
      COMMENTS: list => sortBy(list, 'num_comments').reverse(),
      POINTS: list => sortBy(list, 'points').reverse(),
      };

class App extends Component {
  constructor(props) {
    super(props);
      
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false,
      };
    
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSort = this.onSort.bind(this);
  }

    onSort(sortKey) {
      const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
      this.setState({ sortKey, isSortReverse });
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
        results: {...results, [searchKey]: { hits: updatedHits, page }},
        isLoading: false
        });
    }

    needsToSearchTopStories(searchTerm) {
      return !this.state.results[searchTerm];
    }

    onSearchSubmit(event) {
      const { searchTerm } = this.state;
      this.setState({searchKey: searchTerm});

      let need = this.needsToSearchTopStories(searchTerm);
      if (need) {
        this.fetchSearchTopStories(searchTerm);
      }
      event.preventDefault();
    }

    fetchSearchTopStories(searchTerm, page=0) {
      this.setState({ isLoading: true });
      axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({error}));
      }

    componentDidMount() {
      const { searchTerm } = this.state;
      this.setState({searchKey: searchTerm});
      this.fetchSearchTopStories(searchTerm);
      }

    
  render () {
    const { searchTerm, results, searchKey, error, isLoading, sortKey, isSortReverse } = this.state;
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
            sortKey={sortKey}
            isSortReverse={isSortReverse}
            onSort={this.onSort}
            onDismiss={this.onDismiss}
          /> : 
            null}
          <div className="interactions">
            <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
            >
              <div><i className="fa">More</i></div>
            </ButtonWithLoading>
          </div>
        </div>
    );
  }
}

const Table = ({ list, sortKey, isSortReverse, onSort, onDismiss }) => {
  const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
    ? sortedList.reverse()
    : sortedList;
    return(
    <div className="table">
      <div className="table-header">
      <span style={largeColumn}>
        <Sort
          sortKey={'TITLE'}
          onSort={onSort}
          isSortReverse={isSortReverse}
          activeSortKey={sortKey}
        >
        Title
        </Sort>
      </span>
      <span style={midColumn}>
        <Sort
          sortKey={'AUTHOR'}
          onSort={onSort}
          isSortReverse={isSortReverse}
          activeSortKey={sortKey}
        >
        Author
        </Sort>
      </span>
      <span style={smallColumn}>
        <Sort
          sortKey={'COMMENTS'}
          onSort={onSort}
          isSortReverse={isSortReverse}
          activeSortKey={sortKey}
        >
        Comments
        </Sort>
      </span>
      <span style={smallColumn}>
        <Sort
          sortKey={'POINTS'}
          onSort={onSort}
          isSortReverse={isSortReverse}
          activeSortKey={sortKey}
        >
        Points
        </Sort>
      </span>
      <span style={smallColumn}>
        Archive
      </span>
  </div>
      {reverseSortedList.map(item =>
      <div key={item.objectID} className="table-row" >
      <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn}>{item.points}</span>
        <span style={smallColumn}>{item.created_at}</span>
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

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

const Button = ({ onClick, className = '', children }) =>
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>

const Loading = () => <div>Loading ...</div>

const withLoading = (Component) => ({ isLoading, ...rest }) =>
    isLoading
    ? <Loading />
    : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);

const Sort = ({
  sortKey,
  activeSortKey,
  isSortReverse,
  onSort,
  children
    }) => {
      const sortClass = classNames(
        'button-inline',
      { 'button-active': sortKey === activeSortKey }
      );
      const faIconClass = classNames(
          'fa fa-arrow-circle-o-down',
          {'fa fa-arrow-circle-o-up': isSortReverse === false }
      );
    return (
      <Button
        onClick={() => onSort(sortKey)}
        className={sortClass}
      >
        {children}
        <span> </span>
        <span><i className={faIconClass}></i></span>
      </Button>
    );
  }


export default App;
export {
  Button,
  Search,
  Table,
  };
