import './App.scss';
import React from 'react';
import Repositories from './components/Repositories';
import BranchSelector from './components/BranchSelector';
import AddCurrentRepository from './components/AddCurrentRepository';

export default function App() {
  return (
    <div className="App">
      <div className="header">
        <img src="logo192.png" />
        <span>Gitlab Branch Merger</span>
      </div>
      <AddCurrentRepository />
      <BranchSelector />
      <Repositories />
    </div>
  );
}
