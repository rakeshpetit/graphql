const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLSchema } = graphql;
const axios = require('axios');

const OrgType = new GraphQLObjectType({
  name: 'Org',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    position: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/orgs/${parentValue.id}/users`)
          .then( resp => resp.data );
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    org: {
      type: OrgType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/orgs/${parentValue.orgId}`)
          .then( resp => resp.data );
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: {type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then( resp => resp.data );
      }
    },
    org: {
      type: OrgType,
      args: { id: {type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/orgs/${args.id}`)
          .then( resp => resp.data );
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery });
