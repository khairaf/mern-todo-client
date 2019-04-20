import React, { Component } from 'react';
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import Paper from '@material-ui/core/Paper';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';

import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';

import Form from './Form';

const TodosQuery = gql`
  {
    todos {
      id
      text
      complete
    }
  }
`;

const updateMutation = gql`
  mutation ($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete)
  }
`;

const RemoveMutation = gql`
  mutation($id: ID!) {
    removeTodo(id: $id)
  }
`;

const CreateTodoMutation = gql`
  mutation($text: String!) {
    createTodo(text: $text) {
      id
      text
      complete
    }
  }
`;

class App extends Component {
  updateTodo = async todo => {
    await this.props.updateTodo ({
      variables: {
        id: todo.id,
        complete: !todo.complete
      },
      update: store => {
        //baca data dari chache
        const data = store.readQuery({ query: TodosQuery });
        //tambah data yg diupdate
        data.todos = data.todos.map(x => x.id === todo.id ? {
          ...todo,
          complete: !todo.complete,
        } : x 
        );
        //baca data kembalikan ke cache
        store.writeQuery({ query: TodosQuery, data });
      }
    });
  };

  removeTodo = async todo => {
    await this.props.removeTodo ({
      variables: {
        id: todo.id,
      },
      update: store => {
        //baca data dari chache
        const data = store.readQuery({ query: TodosQuery });
        //tambah data yg diupdate
        data.todos = data.todos.filter(x => x.id !== todo.id);
        //baca data kembalikan ke cache
        store.writeQuery({ query: TodosQuery, data });
      }
    });
  };

  createTodo = async text => {
    await this.props.createTodo ({
      variables: {
        text,
      },
      update: (store, { data: { createTodo }}) => {
        //baca data dari chache. createTodo punya 3 value
        const data = store.readQuery({ query: TodosQuery });
        //tambah data yg diupdate
        data.todos.unshift(createTodo);
        //baca data kembalikan ke cache
        store.writeQuery({ query: TodosQuery, data });
      }
    });
  };

  render() {
    const { data: { loading, todos }} = this.props;
    if (loading) {
      return null;
    }

    return (
      <div style = {{ display: "flex" }}>
        <div style = {{ margin: "auto", width: 400, paddingTop: 100 }}>
          <Paper elevation = { 1 }>
            {/* todos.map(todo => (<div key={`${todo.id}-todo-item`}>{todo.text}</div>))*/}
            <Form submit= {this.createTodo} />
            <List>
              {todos.map(todo => (
              <ListItem key={todo.id} 
                role={undefined} 
                dense 
                button 
                onClick={() => this.updateTodo(todo)}>
                  <Checkbox
                    checked={ todo.complete }
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={ todo.text } />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.removeTodo(todo)}>
                    <DeleteTwoToneIcon/>
                    </IconButton>
                  </ListItemSecondaryAction>
              </ListItem>
              ))}
            </List>

          </Paper>
        </div>
      </div>
    );
  }
}

export default compose(graphql(CreateTodoMutation, {name: "createTodo"}), graphql(RemoveMutation, {name: "removeTodo"}), graphql(updateMutation, {name: "updateTodo"}), graphql(TodosQuery))(App);

