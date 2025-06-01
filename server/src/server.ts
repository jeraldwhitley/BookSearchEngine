import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
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

const apolloServer = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await apolloServer.start();

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ user: getUserFromToken(req) }),
    })
  );

  app.use(routes);

 if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}


  db.once('open', () => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}/graphql`)
    );
  });
}

startServer();
