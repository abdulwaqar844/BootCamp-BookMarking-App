
const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb'),
  q = faunadb.query;
const typeDefs = gql`
  type Query {
    BookMarks: [BookMark!]
  }
  type Mutation {
    addBookMark(title: String,url: String): BookMark
    deleteBookMark(id: ID!): BookMark
  }
  type BookMark {
    id: ID!
    title: String
    url: String
  }`
const resolvers = {
  Query: {
    BookMarks: async (parent, args, context) => {
      try {
        var client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
        let result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index('bookmark_index'))),
            q.Lambda(x => q.Get(x))
          )
        );
        console.log(result.data)
        return result.data.map(d => {
          return {
            id: d.ref.id,
            title: d.data.title,
            url: d.data.url
          }
        })
      }
      catch (err) {
        console.log(err)
      }
    }

  },
  Mutation: {
    addBookMark: async (_, { title, url }) => {
      try {
        var client = new faunadb.Client({ secret:process.env.FAUNADB_SECRET});
        let result = await client.query(
          q.Create(
            q.Collection('bookmarks'),
            {
              data: {
                title,
                url
              }
            },
          )
        );
        return result.data;
      } catch (err) {
        return err.toString();
      }
    },

    deleteBookMark: async (_, { id }) => {
      try {
        var client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
        let result = await client.query(
          q.Delete(
            q.Ref(q.Collection('bookmarks'), id)
          )
        ); console.log(result)
        return result.ref.data;
      } catch (err) {
        return err.toString();
      }
    }
  }
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
})
const handler = server.createHandler()
module.exports = { handler }