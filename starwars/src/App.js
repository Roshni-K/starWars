import React, { Component } from 'react';
import { AgGridReact } from "ag-grid-react";
import GridConfig from "./gridConfig";
import "ag-grid/dist/styles/ag-grid.css";
import "ag-grid/dist/styles/theme-blue.css";
import GridApi from "./api";
import Select from "react-select";
import 'react-select/dist/react-select.css';
import { uniq } from "lodash/array"


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mydata: [],
      peopleName: null,
      gender: null,
      birthyear: null,
      title:null,
      clearable: true,
      searchable:true,
    }

    this.options = {};
    this.filmData = new Map();
    this.grid = new GridConfig();
    this.getAllFilms = this.getAllFilms.bind(this);
    this.getAllPeople = this.getAllPeople.bind(this);
    this.logChange = this.logChange.bind(this);
    this.setOptions = this.setOptions.bind(this);
    this.onGridReady = this.onGridReady.bind(this);
    this.parseFilter = this.parseFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.setFilterState = this.setFilterState.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }
  componentDidMount() {
    this.getAllFilms();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.mydata.length === 173) {
      this.setOptions();
      return true;
    } else {
      return false;
    }
  }
  onGridReady(api) {
    this.api = api;
  }
  setOptions() {
    let people = [];
    let gender = [];
    let DOB = [];
    this.grid.config.columns.forEach(item => {
      this.state.mydata.forEach(e => {
        people.push(e.peopleName);
        gender.push(e.gender);
        DOB.push(e.birthyear);
      });
      this.options[item.field] = [];
      let myArray = [];
      let data = [];
      if (item.field === "title") {
        myArray = Array.from(this.filmData.values());
      } else if (item.field === "peopleName") {
        myArray = uniq(people);
      } else if (item.field === "gender") {
        myArray = uniq(gender);
      } else if (item.field === "birthyear") {
        myArray = uniq(DOB);
      }
      myArray.forEach(str => {
        data.push({ value: str, label: str, id: item.field });
      });
      this.options[item.field] = data;
    });
  }
  getAllPeople() {
    let allPeople = [];
    for (let i = 1; i <= 9; i++) {
      GridApi.fetchPeopleData(`https://swapi.co/api/people/?page=${i}`)
        .then(
        response => {
          if (response) {
            response.data.results.forEach(item => {
              if (this.filmData) {
                item.films.forEach(e => {
                  allPeople.push({
                    peopleName: item.name,
                    gender: item.gender,
                    birthyear: item.birth_year,
                    title: this.filmData.get(e),
                  });
                });
              }
            });
            i++;
            this.setState({
              mydata: allPeople
            });
          }
        }, error => {
          console.log(error);
        }
        );
    }
  }
  parseFilter(value){
    const filterdata = this.api.api.getFilterInstance(value.id);
    filterdata.setType("equals");
    filterdata.setFilter(value.value);
    this.api.api.onFilterChanged();
  }
  getAllFilms() {
    GridApi.fetchFilmData("films")
      .then(
      response => {
        if (response) {
          response.data.results.forEach(item => {
            this.filmData.set(item.url, item.title);
          });
          this.getAllPeople();
        }
      }, error => {
        console.log(error);
      },
    );
  }
  logChange(val) {
    if (val) {
      this.setFilterState(val);
      this.parseFilter(val);
    }
  }
  setFilterState(val){
    if (val.id === "peopleName") {
      this.setState({
        peopleName: val.value,
      });
    }
    else if (val.id === "gender") {
      this.setState({
        gender: val.value,
      });
    }
    else if (val.id === "birthyear") {
      this.setState({
        birthyear: val.value,
      });
    }
    else if (val.id === "title") {
      this.setState({
        title: val.value,
      });
    }
  }
  clearFilter(event){
   this.api.api.destroyFilter(event);
   let obj = {
     id: event,
     value:null
   }
   this.setFilterState(obj);
  }
  onFilter(){
  }
  render() {
    return (
      <div className="myapp">
        <header>CHOOSE YOUR STARWARS CHARACTERS </header>
        <div className="selector">
          {this.grid.config.columns && this.grid.config.columns.map(item => (
            <div className="inputHeader" key={item.field}>{item.headerName} 
              <Select className={"inputBox"}
                name="selected-state"
                placeholder={item.headerName}
                label={item.headerName}
                value={this.state[item.field]}
                autoFocus
                options={this.options[item.field]}
                onChange={this.logChange}
                searchable={this.state.searchable}
              />
              <span className={`clear${item.field}`} onClick={this.clearFilter.bind(this, item.field)}>Clear</span>
            </div>
          ))}
        </div>
        <div style={{ height: 600, width: 800 }} className="ag-blue myGrid">
          <AgGridReact
            columnDefs={this.grid.config.columns}
            rowData={this.state.mydata}
            enableFilter={this.grid.config.enableFilter}
            animateRows="true"
            rowHeight={this.grid.config.rowHeight}
            onGridReady={this.onGridReady}
            onFilterChanged={this.onFilter}
          />
        </div>
      </div>
    );
  }
}

export default App;
