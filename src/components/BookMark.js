import React from 'react'
import style from "./BookMark.module.css"
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Button from '@material-ui/core/Button';
const DELETE_BOOKMARK = gql`
    mutation deleteBookMark($id: ID!){
        deleteBookMark(id: $id){
            id
        }
    }`
const GET_BOOKMARKS = gql`
{
  BookMarks  {
  id
  title
  url
}
} `
export const BookMark = (prop) => {
    const [deleteBookMark] = useMutation(DELETE_BOOKMARK);
    const handleDelete = (id) => {
        deleteBookMark({
            variables: {
                id
            },
            refetchQueries: [{ query: GET_BOOKMARKS }]
        })
        }
    return (
        <div className={style.content}>
            <div className={style.bookmark} key={prop.id}>
                <h3>Title: {prop.title}</h3>
                <h3><a href={`https://${prop.url}`}>URL: {(prop.url)}</a></h3>
                <Button variant="contained" color="secondary" type="submit"     onClick={() => handleDelete(prop.id)}>Delete</Button> 
            </div>
        </div>
    )
}
