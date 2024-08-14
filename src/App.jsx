import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Notification from './components/Notification'
import { getAnecdotes, updateVotes } from './requests'
import AnecdoteForm from './components/Anecdoteform'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const updateVotesMutation = useMutation({
    mutationFn: updateVotes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })
  const notificationDispatch = useNotificationDispatch()

  const handleVote = (anecdote) => {
    updateVotesMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    notificationDispatch({
      type: 'MOUNT',
      payload: `anecdote '${anecdote.content}' is voted`
    })
    setTimeout(() => {
      notificationDispatch({
        type: 'UNMOUNT'
      })
    }, 5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
