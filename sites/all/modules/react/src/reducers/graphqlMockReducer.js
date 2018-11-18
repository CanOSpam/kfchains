import {
  MOCK_GRAPHQL_BEGIN,
  MOCK_GRAPHQL_END
  // MOCK_GRAPQHL_MSG
} from '../actions/graphqlMockActions'

export default function graphqlMockReducer(state = { data: [] }, action) {
  const { type, data } = action

  switch (type) {

    case MOCK_GRAPHQL_BEGIN:
      return { ...state }

    case MOCK_GRAPHQL_END:
      // If the mocking on the graphql server is not enabled our query will
      // deliver a null response which causes issues with the component.
      return data ? { ...state, data } : { ...state }

    default:
      return state
  }
}
