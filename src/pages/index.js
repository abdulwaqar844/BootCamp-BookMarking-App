import React from "react"
import { useQuery, useMutation } from '@apollo/client';
import style from "./index.module.css"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Formik } from "formik"
import TextField from '@material-ui/core/TextField';
import gql from 'graphql-tag';
import { BookMark } from "../components/BookMark";
const GET_BOOKMARKS = gql`
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
  const { loading, error, data } = useQuery(GET_BOOKMARKS);
  if (error) {
    return (
      <h1>An Error occured</h1>
    )
  }
  return (
    <div >
      <div className={style.content1}>
<h1 className={style.text}>Add New Bookmark</h1>
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
            refetchQueries: [{ query: GET_BOOKMARKS }]
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

            /><br />

            {errors.title && touched.title && errors.title}
            <br />

            <TextField
              id="standard-basic"
              prefix="http://"
              label="URL"
              type="text"
              name="url"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.url}

            /><br />
            {errors.url && touched.url && errors.url}
            <br />



            <Button variant="contained" color="primary" type="submit"     >
              Add BookMark
            </Button>
          </form>
        )}
      </Formik>
      </div>
      {loading ? (
        <div>
          <CircularProgress />
        </div>
      ) : data.BookMarks.length >= 1 ? (

        data.BookMarks.map(d => {
          return (
            <div className={style.bmcontainer}>
              <BookMark id={d.id} title={d.title} url={d.url} />
            </div>
          )
        }
        )


      ) : (
            <div className="no-task">
              <h4>No Book Marks</h4>
            </div>
          )}
    </div>
  )
}

