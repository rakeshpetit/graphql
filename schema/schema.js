const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLSchema, GraphQLNonNull } = graphql;
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


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        firstName: {type: new GraphQLNonNull(GraphQLString) },
        age: {type: new GraphQLNonNull(GraphQLInt) },
        orgId: {type: GraphQLString },
      },
      resolve(parentValue, {firstName, age }) {
        return axios.post('http://localhost:3000/users/', { firstName, age })
          .then( resp => resp.data );
      }
    },
    modifyUser: {
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString) },
        firstName: {type: GraphQLString },
        age: {type: GraphQLInt },
        orgId: {type: GraphQLString },
      },
      resolve(parentValue, args ) {
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
          .then( resp => resp.data );
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id  }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then( resp => resp.data );
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
 });
