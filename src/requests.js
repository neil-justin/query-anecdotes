import axios from "axios"

const baseUrl = 'http://localhost:3001/anecdotes'

const getAnecdotes = () => {
  return axios
    .get(baseUrl)
    .then(res => res.data)
}

const createAnecdote = newNote => {
  return axios
    .post(baseUrl, newNote)
    .then(res => res.data)

}

const updateVotes = updatedAnecdote => {
  return axios
    .put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote)
    .then(res => res.data)
}

export { getAnecdotes, createAnecdote, updateVotes }
