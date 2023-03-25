import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import styled from "styled-components";
import { Provider } from 'react-redux'
import { store } from "./Redux/store";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Exo 2', sans-serif;
`

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
      <BrowserRouter>
          <Container>
              <App />
          </Container>
      </BrowserRouter>
  </Provider>
);