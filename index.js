import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from 'express'
import cors from 'cors'
import axios from "axios";
 

async function startServer(){
    const app = express()
    app.use(express.json())
    app.use(cors())
    //server setup
    const server = new ApolloServer({
        typeDefs:`
            type Todo {
                id: ID!
                userId: Int!
                title: String!
                completed: Boolean
                user: User
            }

            type User {
                id: ID!
                name: String! 
                username: String!
                email: String!
            }


            type Query{
                getTodos: [Todo]
                getUsers: [User]
                getSingleUser(id: ID!): User
            }
        `,

        resolvers:{

            Todo:{

                user: async(todo)=>{
                    try{
                        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)
                        const data = response.data 
                        return data 
                    }catch(err){
                        console.log(err.message)
                    }
                }
            
            },
            Query:{
                getTodos:async()=> (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
                getUsers: async()=>(await axios.get("https://jsonplaceholder.typicode.com/users")).data,
                getSingleUser: async(parent, {id})=>{
                    return (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data
                }
            }
        }
    })
    await server.start()
    app.use("/graphql", expressMiddleware(server))


    app.listen(8000, ()=>{
        console.log('Server Start on 8000 ')
    })
}


startServer()