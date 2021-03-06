import React from 'react'
import emotion from '@emotion/styled/macro'

import { colors } from '../../../ui/theme'
import { ReactComponent as LoadingIcon } from '../../../ui/icons/loading.svg'
import { LoadingPlaceholder } from './LoadingPlaceholder'

export class Assignees extends React.PureComponent {
  Placeholder = () => {
    const { loading, assignees } = this.props
    if (assignees.data.length === 0 && (loading.repository || loading.assignees)) {
      return <LoadingPlaceholder/>
    }
    return null
  }
    
  render() {
    return (
      <Self>
        <this.Placeholder/>
        { this.props.assignees.data.length > 0 &&
          <ClearButton
            isActive={this.props.currentAssignee === undefined}
            onClick={() => this.props.loadIssuesOfAssignee(undefined)}
          >
            <Text>
              Not assigned
            </Text>
          </ClearButton>
        }
        { this.assignees.map(assignee => (
          <Assignee
            key={assignee.login}
            isActive={this.props.currentAssignee === assignee.login}
            onClick={() => this.props.loadIssuesOfAssignee(assignee.login)}
          >
            <UserPic src={assignee.avatar_url}/>
            <Text>
              {assignee.login}
            </Text>
          </Assignee>
        ))}
        { this.props.loading.assignees
          ? <Loading/>
          : <this.LoadMoreButton/>
        }
      </Self>
    )
  }

  get assignees() {
    const { assignees, assigneeSearchInputValue } = this.props
    return assignees.data.filter(
      _ => _.login
        .toLowerCase()
        .startsWith(assigneeSearchInputValue.toLowerCase())
    )
  }
  
  LoadMoreButton = () => {
    const { data, lastLoadedPage, totalPages } = this.props.assignees
    if (data.length > 0 && lastLoadedPage < totalPages) {
      return (
        <LoadMoreButton onClick={this.props.loadMoreAssignees}>
          <Text>
            <b>More</b>
          </Text>
        </LoadMoreButton>
      )
    }
    return null
  }
}

const Self = emotion.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0 5px;
  min-height: 36px;
`

const Item = emotion.div`
  display: flex;
  border-radius: 12px;
  margin: 0 5px 10px 5px;
  height: 24px;
  cursor: pointer;
  border: 1px solid ${colors.greyLight};
  background-color: ${_ => _.isActive ? colors.blueLight : ''};
`

const ClearButton = emotion(Item)``

const Assignee = emotion(Item)``

const LoadMoreButton = emotion(Item)``

const Text = emotion.div`
  display: inline-flex;
  align-items: center;
  font-family: Roboto, sans-serif;
  font-size: 12px;
  color: ${colors.textPrimary};
  padding: 0 10px;
`

const UserPic = emotion.img`
  height: 24px;
  width: 24px;
  border-radius: 50%;
`
const Loading = emotion(LoadingIcon)`
  height: 24px;
  width: 34px;
  stroke: #e0e0e0;
`
