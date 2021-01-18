import React from "react"
import { useQuery, useMutation } from '@apollo/client';
import Completedicon from "./../Images/Completedicon.png"
import style from "./index.module.css"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Formik } from "formik"
import TextField from '@material-ui/core/TextField';
import gql from 'graphql-tag';
const GET_TODOS = gql`
{
  BookMarks  {
  id
  title
  url
}
} `
const ADD_BOOKMARK = gql`
    mutation addBookMark($title: String!,$url: String!){
      addBookMark(title: $title,url:$url){
            title
            url
        }
    }`
const DELETE_TODOS = gql`
    mutation deleteTodo($id: ID!){
      deleteTodo(id: $id){
            id
        }
    }`
const UPDATE_TODO = gql`
    mutation updateTodo($status: Boolean! , $id:ID!,$task: String!){
      updateTodo(status: $status id:$id task: $task){
        id    
        status
        task
        }
    }`
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));
export default function Index() {
  const classes = useStyles();
  const [addBookMark] = useMutation(ADD_BOOKMARK);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const handleupdate = (Obj) => {
    updateTodo({
      variables: {
        id: Obj.id,
        task: Obj.task,
        status: Obj.status
      },
      refetchQueries: [{ query: GET_TODOS }]
    })
    console.log(Obj)
  }
  const [deleteTodo] = useMutation(DELETE_TODOS);
  const handleDelete = (id) => {
    deleteTodo({
      variables: {
        id
      },
      refetchQueries: [{ query: GET_TODOS }]
    })
  }


  const { loading, error, data } = useQuery(GET_TODOS);
  return (
    <div className={style.container}>

      <Formik
        initialValues={{ title: '', url: '' }}
        validate={values => {
          const errors = {};
          if (!values.title) {
            errors.title = 'Required';
          } if (!values.url) {
            errors.url = 'Required';
          }
          return errors;

        }}
        onSubmit={(values, { resetForm }) => {
          addBookMark({
            variables: {
              title: values.title,
              url: values.url
            },
            refetchQueries: [{ query: GET_TODOS }]
          })
          resetForm({})

        }



        }
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          /* and other goodies */
        }) => (
          <form className={classes.root} noValidate autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              id="standard-basic"
              label="Title"
              type="text"
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}

            /><br/>

            {errors.title && touched.title && errors.title}
            <br/>

            <TextField
              id="standard-basic"
              label="URL"
              type="text"
              name="url"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.url}

            /><br/>
            {errors.url && touched.url && errors.url}
            <br/>



            <Button variant="contained" color="primary" type="submit"     >
              Add BookMark
            </Button>
          </form>
        )}
      </Formik>
      {loading ? (
        <div>
          <CircularProgress />
        </div>
      ) : data.BookMarks.length >= 1 ? (
        <table className={style.data}  >
          <thead>
            <tr>
              <th>Title</th>
              <th>URL</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.BookMarks.map(d => {
              return (
                <tr key={d.id}>
                  <td className={style.task}>{d.title}</td>
                  <td className={style.status}>{d.url}</td>
                </tr>
              )
            }
            )}
          </tbody>
        </table>
      ) : (
            <div className="no-task">
              <h4>No Book Marks</h4>
            </div>
      )}
    </div>
  )
}

