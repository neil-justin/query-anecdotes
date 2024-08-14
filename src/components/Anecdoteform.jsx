import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notificationDispatch({
        type: 'MOUNT',
        payload: `new anecdote '${data.content}' is created`
      })
      setTimeout(() => {
        notificationDispatch({
          type: 'UNMOUNT'
        })
      }, 5000)
    },
    onError: (error, variables, context) => {
      if (error.name === 'AxiosError') {
        notificationDispatch({
          type: 'MOUNT',
          payload: `anecdote '${variables.content}' is too short. must have at least 5 characters`
        })
        setTimeout(() => {
          notificationDispatch({
            type: 'UNMOUNT'
          })
        }, 5000)
      }
    }
  })
  const notificationDispatch = useNotificationDispatch()

  const handleCreate = (event) => {
    event.preventDefault()
    const anecdoteText = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content: anecdoteText, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm