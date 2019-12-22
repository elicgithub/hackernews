import React, { Component } from 'react';
import './App.css';


const list = [
  {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
  },
  {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
  },
  {
    title: 'Felix',
    url: 'https://Felix.js.org/',
    author: 'Felix Razikov, Andrew Clark',
    num_comments: 4,
    points: 6,
    objectID: 2,
    },
  ];

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
      list,
      searchTerm: '',
      };
      this.onDismiss = this.onDismiss.bind(this);
      this.onSearchChange = this.onSearchChange.bind(this);
    }

    onDismiss(id) {
      const isNotId = item => item.objectID !== id;
      const updatedList = this.state.list.filter(isNotId);
      this.setState({ list: updatedList });
    }
    onSearchChange (event) {
      this.setState({ searchTerm: event.target.value });
    }
    
  render () {
    const { searchTerm, list } = this.state;
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
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
          />
          </div>
    );
  }
}

// const Search = ({value, onChange, children}) => {
//     <Form>
//       {children} <input 
//         type="text"
//         value={value}
//         onChange={onChange}
//         />
//     </Form>
// }


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
