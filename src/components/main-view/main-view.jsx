import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { RegisterView } from '../registration-view/registration-view'
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';

import './main-view.scss'

import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Jumbotron,
} from 'react-bootstrap';

export class MainView extends React.Component {
  constructor() {
    super();
    // Initial state is set to null
    this.state = {
      movies: [],
      selectedMovie: "",
      user: "",
    };
  }

  // username token
  getMovies(token) {
    axios.get('https://myflix-zag.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // verify user is logged in in local storage
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  /*When a movie is clicked, this function is invoked and updates the state of the `selectedMovie` *property to that movie*/
  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  // register user
  onRegister(register) {
    this.setState({
      register
    });
  }

  /* When a user successfully logs in, this function updates the `user` property in state to that *particular user*/
  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  // log out user
  onLogout() {
    this.setState(state => ({
      user: null
    }));

    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // when clicked, this function sets selectedMovie state back to null, rendering the main-view page on the DOM
  onBackClick() {
    this.setState({
      selectedMovie: null
    });
  }

  render() {
    const { movies, user, register } = this.state;


    // if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
    if (!movies) return <div className="main-view" />;


    return (
      <Router>
        <div className="main-view">
          {/* Navbar */}
          <header>
            <Navbar bg='dark' variant='dark' fixed="top">
              <Nav>
                <Nav.Item>
                  <Nav.Link target='_blank' >Home</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link target='_blank' href='#Directors'>Directors</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link target='_blank' href='#Genres'>Genres</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className='logout-button' onClick={() => this.onLogout()}>Logout</Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar>
          </header>
          {/* Routes */}
          <Route exact path="/" render={() => {
            if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
            return movies.map(m => <MovieCard key={m._id} movie={m} />)
          }
          } />
          <Route path="/register" render={() => {
            if (!register) return <RegisterView onRegister={(register) => this.onRegister(register)} />
          }} />
          {/* you keep the rest routes here */}
          <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />
          <Route path="/directors/:name" render={({ match }) => {
            if (!movies) return <div className="main-view" />;
            return <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} />
          }
          } />
          <Route path="/genres/:name" render={({ match }) => {
            if (!movies) return <div className="main-view" />;
            return (
              <GenreView genre={movies.find(m => m.Genre.Name === match.params.name)} movies={movies} />
            );
          }
          } />

          <Jumbotron className='text-center'>
            <h1>myFlix Movie Database</h1>
            <p>All time favorite movie collection</p>
          </Jumbotron>
          {/* Footer */}
          <footer className='fixed-bottom bg-dark text-white text-center'>
            <p className='pt-3'>
              Coyright &#169; 2021 myFlix. All rights reserved
            </p>
          </footer>
        </div>
      </Router>
    );
  }

}

