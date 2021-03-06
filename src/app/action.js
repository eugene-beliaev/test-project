import { createAction } from 'redux-act'

import { requestAssignees, requestIssues } from '../resources/github'

export const changeRepoInput = createAction('App:changeRepoInput')
export const changeAssigneeSearchInput = createAction('App:changeAssigneeSearchInput')
export const assigneesHasLoaded = createAction('App:assigneesHasLoaded')
export const issuesHasLoaded = createAction('App:issuesHasLoaded')
export const clearIssues = createAction('App:clearIssues')
export const clearAssignees = createAction('App:clearAssignees')
export const issuesLoadingFailed = createAction('App:issuesLoadingFailed')
export const selectAssignee = createAction('App:selectAssignee')

export const loadRepository = () => async (dispatch, getState) => {
  const { app } = getState()
  dispatch(clearIssues())
  dispatch(clearAssignees())
  dispatch(loadMoreAssignees(app.repoSearchBarValue))
  return await dispatch(loadMoreIssues(app.repoSearchBarValue))
}

export const loadMoreAssignees = () => async (dispatch, getState) => {
  const { repoSearchBarValue, assignees: { lastLoadedPage = 0 } } = getState().app
  const response = await requestAssignees(repoSearchBarValue, lastLoadedPage + 1)
  dispatch(assigneesHasLoaded(response))
}

export const loadMoreIssues = () => async (dispatch, getState) => {
  const { repoSearchBarValue, currentAssignee, issues: { lastLoadedPage = 0 } } = getState().app
  try {
    const response = await requestIssues(repoSearchBarValue, currentAssignee, lastLoadedPage + 1)
    dispatch(issuesHasLoaded(response))
  } catch (e) {
    const message = getErrorMessage(e)
    dispatch(issuesLoadingFailed(message))
  }
}

export const loadIssuesOfAssignee = (login) => async (dispatch) => {
  dispatch(selectAssignee(login))
  dispatch(clearIssues())
  return await dispatch(loadMoreIssues())
}

function getErrorMessage(e) {
  if (e.response.status === 404) {
    return 'This repository is not found :('
  }
  if (e.response.data.message) {
    return e.response.data.message
  }
  return 'Something went wrong'
}
