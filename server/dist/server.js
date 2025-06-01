// import express from 'express';
// import path from 'node:path';
// import db from './config/connection.js';
// import routes from './routes/index.js';
// const app = express();
// const PORT = process.env.PORT || 3001;
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }
// app.use(routes);
// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });
// src/server.ts
import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { getUserFromToken } from './services/auth.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Apollo Server setup
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});
async function startServer() {
    await apolloServer.start();
    app.use(cors()); // Optional: Allow frontend access
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    // GraphQL endpoint
    app.use('/graphql', expressMiddleware(apolloServer, {
        context: async ({ req }) => {
            const user = getUserFromToken(req);
            return { user };
        },
    }));
    // Serve static assets in production
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));
        app.get('*', (_req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
    }
    // Keep REST routes if needed
    app.use(routes);
    db.once('open', () => {
        app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}/graphql`));
    });
}
startServer();
