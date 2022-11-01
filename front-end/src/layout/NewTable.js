import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from '../utils/api';
import ErrorAlert from "./ErrorAlert";

function NewTable() {
  const history = useHistory();
  const [tableName, setTableName] = useState('');
  const [capacity, setCapacity] = useState(1);

  const [newTableError, setNewTableError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const table = {
      table_name: event.target.table_name.value,
      capacity: Number(event.target.capacity.value),
    };
    
    createTable(table)
      .then(() => {
        setTableName('');
        setCapacity(1);
        history.push('/dashboard')
      })
      .catch(setNewTableError);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    switch(event.target.id) {
      case 'table_name':
        setTableName(value);
        break;
      case 'capacity':
        setCapacity(value);
        break;
    };
  };

  return (
    <>
      <h1>Create a new table</h1>
      <form name='newtable' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='table_name'>
            Table Name
            <input id='table_name' name='table_name' type='text' minLength='2' onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label htmlFor='capacity'>
            Capacity
            <input id='capacity' name='capacity' type='number' min='1' onChange={handleChange} required />
          </label>
        </div>
        <div>
          <button onClick={history.goBack}>Cancel</button>
          <button type='submit'>Submit</button>
        </div>
      </form>
    </>
  );
}

export default NewTable;